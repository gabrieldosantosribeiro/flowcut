from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from database import supabase
from .auth import AuthContext, get_current_auth, require_shop_access

router = APIRouter(prefix="/barbers", tags=["barbers"])


class Barber(BaseModel):
    """Representa um barbeiro."""

    id: str
    barber_shop_id: str
    name: str
    bio: Optional[str] = None
    active: bool = True


class BarberCreate(BaseModel):
    """Payload para criação de barbeiro (autenticado)."""

    barber_shop_id: str
    name: str = Field(..., min_length=2, max_length=80)
    bio: Optional[str] = Field(None, max_length=500)
    active: bool = True


class BarberUpdate(BaseModel):
    """Payload para edição de barbeiro (autenticado)."""

    name: Optional[str] = Field(None, min_length=2, max_length=80)
    bio: Optional[str] = Field(None, max_length=500)
    active: Optional[bool] = None


@router.get("", response_model=List[Barber])
def list_barbers(
    barber_shop_id: str = Query(..., description="ID da barbearia"),
) -> List[Barber]:
    """Lista barbeiros de uma barbearia (público)."""
    res = (
        supabase.table("barbers")
        .select("id, barber_shop_id, name, bio, active")
        .eq("barber_shop_id", barber_shop_id)
        .order("name")
        .execute()
    )
    return [
        Barber(
            id=str(r["id"]),
            barber_shop_id=str(r["barber_shop_id"]),
            name=r["name"],
            bio=r.get("bio"),
            active=bool(r.get("active", True)),
        )
        for r in (res.data or [])
    ]


@router.post("", response_model=Barber, status_code=201)
def create_barber(
    payload: BarberCreate,
    auth: AuthContext = Depends(get_current_auth),
) -> Barber:
    """Cria um barbeiro para a barbearia (autenticado)."""
    require_shop_access(auth, payload.barber_shop_id)

    res = (
        supabase.table("barbers")
        .insert(payload.model_dump())
        .select("id, barber_shop_id, name, bio, active")
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=500, detail="Falha ao criar barbeiro.")
    r = res.data[0]
    return Barber(
        id=str(r["id"]),
        barber_shop_id=str(r["barber_shop_id"]),
        name=r["name"],
        bio=r.get("bio"),
        active=bool(r.get("active", True)),
    )


@router.put("/{id}", response_model=Barber)
def update_barber(
    id: str,
    payload: BarberUpdate,
    auth: AuthContext = Depends(get_current_auth),
) -> Barber:
    """Edita um barbeiro (autenticado)."""
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nada para atualizar.")

    # Carrega barbeiro para validar tenant
    existing = (
        supabase.table("barbers")
        .select("id, barber_shop_id")
        .eq("id", id)
        .limit(1)
        .execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Barbeiro não encontrado.")
    require_shop_access(auth, str(existing.data[0]["barber_shop_id"]))

    res = (
        supabase.table("barbers")
        .update(update_data)
        .eq("id", id)
        .select("id, barber_shop_id, name, bio, active")
        .execute()
    )
    r = res.data[0]
    return Barber(
        id=str(r["id"]),
        barber_shop_id=str(r["barber_shop_id"]),
        name=r["name"],
        bio=r.get("bio"),
        active=bool(r.get("active", True)),
    )


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_barber(
    id: str,
    auth: AuthContext = Depends(get_current_auth),
) -> None:
    """Remove um barbeiro (autenticado)."""
    existing = (
        supabase.table("barbers")
        .select("id, barber_shop_id")
        .eq("id", id)
        .limit(1)
        .execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Barbeiro não encontrado.")
    require_shop_access(auth, str(existing.data[0]["barber_shop_id"]))

    supabase.table("barbers").delete().eq("id", id).execute()
    return None

