from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field, conint

from database import supabase
from .auth import AuthContext, get_current_auth, require_shop_access

router = APIRouter(prefix="/services", tags=["services"])


class Service(BaseModel):
    """Representa um serviço oferecido pela barbearia."""

    id: str
    barber_shop_id: str
    name: str
    price_cents: int
    duration_minutes: int
    active: bool = True
    description: Optional[str] = None


class ServiceCreate(BaseModel):
    """Payload para criação de serviço (autenticado)."""

    barber_shop_id: str
    name: str = Field(..., min_length=2, max_length=80)
    price_cents: conint(ge=0)  # type: ignore[valid-type]
    duration_minutes: conint(ge=5, le=480)  # type: ignore[valid-type]
    active: bool = True
    description: Optional[str] = Field(None, max_length=500)


class ServiceUpdate(BaseModel):
    """Payload para edição de serviço (autenticado)."""

    name: Optional[str] = Field(None, min_length=2, max_length=80)
    price_cents: Optional[int] = Field(None, ge=0)
    duration_minutes: Optional[int] = Field(None, ge=5, le=480)
    active: Optional[bool] = None
    description: Optional[str] = Field(None, max_length=500)


@router.get("", response_model=List[Service])
def list_services(
    barber_shop_id: str = Query(..., description="ID da barbearia"),
) -> List[Service]:
    """Lista serviços de uma barbearia (público)."""
    res = (
        supabase.table("services")
        .select("id, barber_shop_id, name, price_cents, duration_minutes, active, description")
        .eq("barber_shop_id", barber_shop_id)
        .order("name")
        .execute()
    )
    return [
        Service(
            id=str(r["id"]),
            barber_shop_id=str(r["barber_shop_id"]),
            name=r["name"],
            price_cents=int(r.get("price_cents", 0)),
            duration_minutes=int(r.get("duration_minutes", 30)),
            active=bool(r.get("active", True)),
            description=r.get("description"),
        )
        for r in (res.data or [])
    ]


@router.post("", response_model=Service, status_code=201)
def create_service(
    payload: ServiceCreate,
    auth: AuthContext = Depends(get_current_auth),
) -> Service:
    """Cria um serviço (autenticado)."""
    require_shop_access(auth, payload.barber_shop_id)
    res = (
        supabase.table("services")
        .insert(payload.model_dump())
        .select("id, barber_shop_id, name, price_cents, duration_minutes, active, description")
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=500, detail="Falha ao criar serviço.")
    r = res.data[0]
    return Service(
        id=str(r["id"]),
        barber_shop_id=str(r["barber_shop_id"]),
        name=r["name"],
        price_cents=int(r.get("price_cents", 0)),
        duration_minutes=int(r.get("duration_minutes", 30)),
        active=bool(r.get("active", True)),
        description=r.get("description"),
    )


@router.put("/{id}", response_model=Service)
def update_service(
    id: str,
    payload: ServiceUpdate,
    auth: AuthContext = Depends(get_current_auth),
) -> Service:
    """Edita um serviço (autenticado)."""
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nada para atualizar.")

    existing = (
        supabase.table("services")
        .select("id, barber_shop_id")
        .eq("id", id)
        .limit(1)
        .execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Serviço não encontrado.")
    require_shop_access(auth, str(existing.data[0]["barber_shop_id"]))

    res = (
        supabase.table("services")
        .update(update_data)
        .eq("id", id)
        .select("id, barber_shop_id, name, price_cents, duration_minutes, active, description")
        .execute()
    )
    r = res.data[0]
    return Service(
        id=str(r["id"]),
        barber_shop_id=str(r["barber_shop_id"]),
        name=r["name"],
        price_cents=int(r.get("price_cents", 0)),
        duration_minutes=int(r.get("duration_minutes", 30)),
        active=bool(r.get("active", True)),
        description=r.get("description"),
    )


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    id: str,
    auth: AuthContext = Depends(get_current_auth),
) -> None:
    """Remove um serviço (autenticado)."""
    existing = (
        supabase.table("services")
        .select("id, barber_shop_id")
        .eq("id", id)
        .limit(1)
        .execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Serviço não encontrado.")
    require_shop_access(auth, str(existing.data[0]["barber_shop_id"]))

    supabase.table("services").delete().eq("id", id).execute()
    return None

