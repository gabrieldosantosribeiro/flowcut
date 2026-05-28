from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field, conint

from database import supabase
from .auth import AuthContext, get_current_auth, require_shop_access

router = APIRouter(prefix="/availability", tags=["availability"])


class AvailabilityRule(BaseModel):
    """Regra de disponibilidade semanal do barbeiro.

    day_of_week: 0=Segunda ... 6=Domingo
    start_time/end_time: formato HH:MM (24h)
    """

    id: str
    barber_shop_id: str
    barber_id: str
    day_of_week: int
    start_time: str
    end_time: str
    slot_minutes: int = 30
    enabled: bool = True


class AvailabilityUpsert(BaseModel):
    """Define/atualiza o conjunto de regras do barbeiro (autenticado)."""

    barber_shop_id: str
    barber_id: str
    rules: List[
        dict
    ] = Field(
        ...,
        description="Lista de regras: {day_of_week,start_time,end_time,slot_minutes,enabled}",
        min_length=1,
    )


@router.get("", response_model=List[AvailabilityRule])
def get_availability(
    barber_id: str = Query(..., description="ID do barbeiro"),
) -> List[AvailabilityRule]:
    """Retorna as regras de disponibilidade do barbeiro (público)."""
    res = (
        supabase.table("availability")
        .select(
            "id, barber_shop_id, barber_id, day_of_week, start_time, end_time, slot_minutes, enabled"
        )
        .eq("barber_id", barber_id)
        .order("day_of_week")
        .order("start_time")
        .execute()
    )
    return [
        AvailabilityRule(
            id=str(r["id"]),
            barber_shop_id=str(r["barber_shop_id"]),
            barber_id=str(r["barber_id"]),
            day_of_week=int(r["day_of_week"]),
            start_time=r["start_time"],
            end_time=r["end_time"],
            slot_minutes=int(r.get("slot_minutes", 30)),
            enabled=bool(r.get("enabled", True)),
        )
        for r in (res.data or [])
    ]


@router.post("", response_model=List[AvailabilityRule])
def set_availability(
    payload: AvailabilityUpsert,
    auth: AuthContext = Depends(get_current_auth),
) -> List[AvailabilityRule]:
    """Define as regras de disponibilidade do barbeiro (autenticado).

    Estratégia simples: apaga todas as regras do barbeiro e recria.
    """
    require_shop_access(auth, payload.barber_shop_id)

    # Valida que o barbeiro pertence ao tenant
    barber_res = (
        supabase.table("barbers")
        .select("id, barber_shop_id")
        .eq("id", payload.barber_id)
        .limit(1)
        .execute()
    )
    if not barber_res.data:
        raise HTTPException(status_code=404, detail="Barbeiro não encontrado.")
    require_shop_access(auth, str(barber_res.data[0]["barber_shop_id"]))

    # Remove regras antigas
    supabase.table("availability").delete().eq("barber_id", payload.barber_id).execute()

    # Normaliza e insere novas regras
    inserts = []
    for rule in payload.rules:
        day = int(rule.get("day_of_week"))
        if day < 0 or day > 6:
            raise HTTPException(status_code=400, detail="day_of_week deve ser 0..6.")
        start_time = str(rule.get("start_time"))
        end_time = str(rule.get("end_time"))
        slot_minutes = int(rule.get("slot_minutes", 30))
        enabled = bool(rule.get("enabled", True))
        if slot_minutes < 5 or slot_minutes > 240:
            raise HTTPException(status_code=400, detail="slot_minutes inválido.")
        inserts.append(
            {
                "barber_shop_id": payload.barber_shop_id,
                "barber_id": payload.barber_id,
                "day_of_week": day,
                "start_time": start_time,
                "end_time": end_time,
                "slot_minutes": slot_minutes,
                "enabled": enabled,
            }
        )

    res = (
        supabase.table("availability")
        .insert(inserts)
        .select(
            "id, barber_shop_id, barber_id, day_of_week, start_time, end_time, slot_minutes, enabled"
        )
        .execute()
    )
    return [
        AvailabilityRule(
            id=str(r["id"]),
            barber_shop_id=str(r["barber_shop_id"]),
            barber_id=str(r["barber_id"]),
            day_of_week=int(r["day_of_week"]),
            start_time=r["start_time"],
            end_time=r["end_time"],
            slot_minutes=int(r.get("slot_minutes", 30)),
            enabled=bool(r.get("enabled", True)),
        )
        for r in (res.data or [])
    ]

