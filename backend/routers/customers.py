from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from database import supabase
from .auth import AuthContext, get_current_auth, require_shop_access

router = APIRouter(prefix="/customers", tags=["customers"])


class Customer(BaseModel):
    """Representa um cliente da barbearia."""

    id: str
    barber_shop_id: str
    name: Optional[str] = None
    phone: str


class CustomerUpsert(BaseModel):
    """Cria ou retorna cliente existente pelo telefone."""

    barber_shop_id: str
    phone: str = Field(..., min_length=8, max_length=30)
    name: Optional[str] = Field(None, min_length=2, max_length=80)


@router.post("", response_model=Customer, status_code=201)
def create_or_get_customer(payload: CustomerUpsert) -> Customer:
    """Cria (se não existir) ou retorna um cliente pelo telefone (público)."""
    # Busca por telefone dentro do tenant
    existing = (
        supabase.table("customers")
        .select("id, barber_shop_id, name, phone")
        .eq("barber_shop_id", payload.barber_shop_id)
        .eq("phone", payload.phone)
        .limit(1)
        .execute()
    )
    if existing.data:
        r = existing.data[0]
        return Customer(
            id=str(r["id"]),
            barber_shop_id=str(r["barber_shop_id"]),
            name=r.get("name"),
            phone=r["phone"],
        )

    ins = (
        supabase.table("customers")
        .insert(payload.model_dump())
        .select("id, barber_shop_id, name, phone")
        .execute()
    )
    if not ins.data:
        raise HTTPException(status_code=500, detail="Falha ao criar cliente.")
    r = ins.data[0]
    return Customer(
        id=str(r["id"]),
        barber_shop_id=str(r["barber_shop_id"]),
        name=r.get("name"),
        phone=r["phone"],
    )


@router.get("", response_model=List[Customer])
def list_customers(
    barber_shop_id: str = Query(..., description="ID da barbearia"),
    auth: AuthContext = Depends(get_current_auth),
) -> List[Customer]:
    """Lista clientes de uma barbearia (autenticado)."""
    require_shop_access(auth, barber_shop_id)
    res = (
        supabase.table("customers")
        .select("id, barber_shop_id, name, phone")
        .eq("barber_shop_id", barber_shop_id)
        .order("name")
        .execute()
    )
    return [
        Customer(
            id=str(r["id"]),
            barber_shop_id=str(r["barber_shop_id"]),
            name=r.get("name"),
            phone=r["phone"],
        )
        for r in (res.data or [])
    ]

