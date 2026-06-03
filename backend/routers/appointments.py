from __future__ import annotations

from datetime import date, datetime, time, timedelta, timezone
from typing import List, Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from database import supabase
from .auth import AuthContext, get_current_auth, require_shop_access

router = APIRouter(prefix="/appointments", tags=["appointments"])

# Timezone de Brasília (UTC-3)
BR_TZ = timezone(timedelta(hours=-3))

AppointmentStatus = Literal["pending", "confirmed", "cancelled", "completed"]


class Appointment(BaseModel):
    id: str
    barber_shop_id: str
    barber_id: str
    service_id: str
    customer_id: str
    starts_at: str
    ends_at: str
    status: AppointmentStatus = "pending"
    notes: Optional[str] = None


class AppointmentCreate(BaseModel):
    barber_shop_id: str
    barber_id: str
    service_id: str
    customer_id: str
    starts_at: str = Field(..., description="ISO 8601, ex: 2026-05-28T14:00:00")
    notes: Optional[str] = Field(None, max_length=500)


class AvailableSlot(BaseModel):
    starts_at: str
    ends_at: str


class AppointmentStatusPatch(BaseModel):
    status: AppointmentStatus


def _parse_iso(dt_str: str) -> datetime:
    try:
        dt = datetime.fromisoformat(dt_str)
        # Se não tiver timezone, assume UTC
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Data/hora inválida (ISO 8601).") from exc


def _overlaps(a_start: datetime, a_end: datetime, b_start: datetime, b_end: datetime) -> bool:
    return a_start < b_end and b_start < a_end


@router.get("/available-slots", response_model=List[AvailableSlot])
def get_available_slots(
    barber_id: str = Query(...),
    day: str = Query(...),
    service_duration_minutes: int = Query(30, ge=5, le=480),
) -> List[AvailableSlot]:
    try:
        target_day = date.fromisoformat(day)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Parâmetro day deve ser YYYY-MM-DD.") from exc

    weekday = target_day.isoweekday() % 7

    rules_res = (
        supabase.table("availability")
        .select("start_time, end_time, slot_minutes, enabled")
        .eq("barber_id", barber_id)
        .eq("day_of_week", weekday)
        .execute()
    )
    rules = [r for r in (rules_res.data or []) if bool(r.get("enabled", True))]
    if not rules:
        return []

    # Busca agendamentos do dia em horário de Brasília
    start_of_day = datetime(target_day.year, target_day.month, target_day.day, 0, 0, 0, tzinfo=BR_TZ)
    end_of_day = start_of_day + timedelta(days=1)

    appts_res = (
        supabase.table("appointments")
        .select("scheduled_at, ends_at, status")
        .eq("barber_id", barber_id)
        .neq("status", "cancelled")
        .gte("scheduled_at", start_of_day.isoformat())
        .lt("scheduled_at", end_of_day.isoformat())
        .execute()
    )
    appts = []
    for a in (appts_res.data or []):
        appts.append((_parse_iso(a["scheduled_at"]), _parse_iso(a["ends_at"])))

    slots: List[AvailableSlot] = []
    for rule in rules:
        slot_minutes = int(rule.get("slot_minutes", 30))
        try:
            s_h, s_m = [int(x) for x in str(rule["start_time"]).split(":")[:2]]
            e_h, e_m = [int(x) for x in str(rule["end_time"]).split(":")[:2]]
        except Exception as exc:
            raise HTTPException(status_code=500, detail="Regra de disponibilidade inválida.") from exc

        # Janela de disponibilidade em horário de Brasília
        window_start = datetime(target_day.year, target_day.month, target_day.day, s_h, s_m, tzinfo=BR_TZ)
        window_end = datetime(target_day.year, target_day.month, target_day.day, e_h, e_m, tzinfo=BR_TZ)

        step = timedelta(minutes=slot_minutes)
        duration = timedelta(minutes=service_duration_minutes)

        cursor = window_start
        while cursor + duration <= window_end:
            candidate_start = cursor
            candidate_end = cursor + duration

            has_conflict = any(_overlaps(candidate_start, candidate_end, a_s, a_e) for a_s, a_e in appts)
            if not has_conflict:
                slots.append(
                    AvailableSlot(
                        starts_at=candidate_start.isoformat(),
                        ends_at=candidate_end.isoformat(),
                    )
                )
            cursor += step

    return slots


@router.post("", response_model=Appointment, status_code=201)
def create_appointment(payload: AppointmentCreate) -> Appointment:
    starts_at = _parse_iso(payload.starts_at)
    if starts_at.tzinfo is None:
        starts_at = starts_at.replace(tzinfo=BR_TZ)

    svc_res = (
        supabase.table("services")
        .select("id, barber_shop_id, duration_minutes, active")
        .eq("id", payload.service_id)
        .limit(1)
        .execute()
    )
    if not svc_res.data:
        raise HTTPException(status_code=404, detail="Serviço não encontrado.")
    svc = svc_res.data[0]
    if str(svc["barber_shop_id"]) != str(payload.barber_shop_id):
        raise HTTPException(status_code=400, detail="Serviço não pertence à barbearia.")
    if not bool(svc.get("active", True)):
        raise HTTPException(status_code=400, detail="Serviço inativo.")

    duration = timedelta(minutes=int(svc.get("duration_minutes", 30)))
    ends_at = starts_at + duration

    conflict_res = (
        supabase.table("appointments")
        .select("id, scheduled_at, ends_at, status")
        .eq("barber_id", payload.barber_id)
        .neq("status", "cancelled")
        .lt("scheduled_at", ends_at.isoformat())
        .gt("ends_at", starts_at.isoformat())
        .limit(1)
        .execute()
    )
    if conflict_res.data:
        raise HTTPException(status_code=409, detail="Horário já ocupado.")

    ins = (
        supabase.table("appointments")
        .insert(
            {
                "barber_shop_id": payload.barber_shop_id,
                "barber_id": payload.barber_id,
                "service_id": payload.service_id,
                "customer_id": payload.customer_id,
                "scheduled_at": starts_at.isoformat(),
                "ends_at": ends_at.isoformat(),
                "status": "pending",
                "notes": payload.notes,
            }
        )
        .select("id, barber_shop_id, barber_id, service_id, customer_id, scheduled_at, ends_at, status, notes")
        .execute()
    )
    if not ins.data:
        raise HTTPException(status_code=500, detail="Falha ao criar agendamento.")
    r = ins.data[0]
    return Appointment(
        id=str(r["id"]),
        barber_shop_id=str(r["barber_shop_id"]),
        barber_id=str(r["barber_id"]),
        service_id=str(r["service_id"]),
        customer_id=str(r["customer_id"]),
        starts_at=r["scheduled_at"],
        ends_at=r["ends_at"],
        status=r.get("status", "pending"),
        notes=r.get("notes"),
    )


@router.get("", response_model=list)
def list_appointments(
    barber_shop_id: str = Query(...),
    date: str = Query(None),
    auth: AuthContext = Depends(get_current_auth),
) -> list:
    require_shop_access(auth, barber_shop_id)

    query = (
        supabase.table("appointments")
        .select("""
            id,
            barber_shop_id,
            scheduled_at,
            ends_at,
            status,
            notes,
            customers(id, name, phone),
            barbers(id, name),
            services(id, name, price, duration_minutes)
        """)
        .eq("barber_shop_id", barber_shop_id)
        .order("scheduled_at", desc=False)
    )

    if date:
        try:
            day = datetime.fromisoformat(date)
            if day.tzinfo is None:
                day = day.replace(tzinfo=BR_TZ)
            next_day = day + timedelta(days=1)
            query = query.gte("scheduled_at", day.isoformat()).lt("scheduled_at", next_day.isoformat())
        except ValueError:
            pass

    res = query.execute()
    return res.data or []


@router.patch("/{id}/status", response_model=Appointment)
def patch_appointment_status(
    id: str,
    payload: AppointmentStatusPatch,
    auth: AuthContext = Depends(get_current_auth),
) -> Appointment:
    existing = (
        supabase.table("appointments")
        .select("id, barber_shop_id")
        .eq("id", id)
        .limit(1)
        .execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado.")
    require_shop_access(auth, str(existing.data[0]["barber_shop_id"]))

    res = (
        supabase.table("appointments")
        .update({"status": payload.status})
        .eq("id", id)
        .select("id, barber_shop_id, barber_id, service_id, customer_id, scheduled_at, ends_at, status, notes")
        .execute()
    )
    r = res.data[0]
    return Appointment(
        id=str(r["id"]),
        barber_shop_id=str(r["barber_shop_id"]),
        barber_id=str(r["barber_id"]),
        service_id=str(r["service_id"]),
        customer_id=str(r["customer_id"]),
        starts_at=r["scheduled_at"],
        ends_at=r["ends_at"],
        status=r.get("status", "pending"),
        notes=r.get("notes"),
    )