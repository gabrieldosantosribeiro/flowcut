from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from database import supabase
from .auth import AuthContext, get_current_auth, require_shop_access

router = APIRouter(prefix="/barber-shops", tags=["barber_shops"])


class BarberShopPublic(BaseModel):
    """Dados públicos da barbearia (para landing/agenda)."""

    id: str
    name: str
    slug: str
    description: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class BarberShopUpdate(BaseModel):
    """Dados editáveis pela barbearia (autenticado)."""

    name: Optional[str] = Field(None, min_length=2, max_length=80)
    slug: Optional[str] = Field(
        None,
        min_length=2,
        max_length=60,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    )
    description: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=30)
    address: Optional[str] = Field(None, max_length=200)


@router.get("/{slug}", response_model=BarberShopPublic)
def get_barber_shop_by_slug(slug: str) -> BarberShopPublic:
    """Retorna dados públicos da barbearia pelo slug."""
    res = (
        supabase.table("barber_shops")
        .select("id, name, slug, description, phone, address")
        .eq("slug", slug)
        .limit(1)
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=404, detail="Barbearia não encontrada.")
    row = res.data[0]
    return BarberShopPublic(**{**row, "id": str(row["id"])})


@router.put("/{id}", response_model=BarberShopPublic)
def update_barber_shop(
    id: str,
    payload: BarberShopUpdate,
    auth: AuthContext = Depends(get_current_auth),
) -> BarberShopPublic:
    """Atualiza dados da barbearia (somente dentro do tenant do usuário)."""
    require_shop_access(auth, barber_shop_id=id)

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nada para atualizar.")

    # Se atualizar o slug, valida duplicidade
    if "slug" in update_data:
        existing = (
            supabase.table("barber_shops")
            .select("id")
            .eq("slug", update_data["slug"])
            .neq("id", id)
            .limit(1)
            .execute()
        )
        if existing.data:
            raise HTTPException(status_code=409, detail="Slug de barbearia já existe.")

    res = (
        supabase.table("barber_shops")
        .update(update_data)
        .eq("id", id)
        .select("id, name, slug, description, phone, address")
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=404, detail="Barbearia não encontrada.")
    row = res.data[0]
    return BarberShopPublic(**{**row, "id": str(row["id"])})

