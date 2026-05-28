import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field

from database import supabase

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def _get_jwt_settings() -> tuple[str, str]:
    """Lê SECRET_KEY e ALGORITHM do ambiente para assinar/verificar JWT."""
    secret_key = os.getenv("SECRET_KEY")
    algorithm = os.getenv("ALGORITHM", "HS256")
    if not secret_key:
        raise RuntimeError("SECRET_KEY é obrigatório no ambiente (.env).")
    return secret_key, algorithm


def hash_password(password: str) -> str:
    """Gera hash seguro da senha para armazenamento."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Confere se a senha informada bate com o hash armazenado."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Cria um JWT com expiração e payload customizado."""
    secret_key, algorithm = _get_jwt_settings()
    to_encode = dict(data)
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=12))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=algorithm)


def decode_token(token: str) -> Dict[str, Any]:
    """Decodifica e valida o JWT, retornando o payload."""
    secret_key, algorithm = _get_jwt_settings()
    try:
        return jwt.decode(token, secret_key, algorithms=[algorithm])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado.",
        ) from exc


class AuthContext(BaseModel):
    """Contexto do usuário autenticado (multi-tenant via barber_shop_id)."""

    user_id: str
    barber_shop_id: str
    email: Optional[EmailStr] = None


def get_current_auth(token: str = Depends(oauth2_scheme)) -> AuthContext:
    """Dependency que valida o JWT e devolve o contexto autenticado."""
    payload = decode_token(token)

    user_id = payload.get("sub")
    barber_shop_id = payload.get("barber_shop_id")
    email = payload.get("email")

    if not user_id or not barber_shop_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token sem dados obrigatórios (sub / barber_shop_id).",
        )

    return AuthContext(user_id=str(user_id), barber_shop_id=str(barber_shop_id), email=email)


def require_shop_access(auth: AuthContext, barber_shop_id: str) -> None:
    """Garante que a operação está dentro do tenant do usuário autenticado."""
    if str(auth.barber_shop_id) != str(barber_shop_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado para esta barbearia.",
        )


class RegisterRequest(BaseModel):
    """Payload de cadastro inicial (cria barbearia + usuário)."""

    barber_shop_name: str = Field(..., min_length=2, max_length=80)
    barber_shop_slug: str = Field(..., min_length=2, max_length=60, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class RegisterResponse(BaseModel):
    """Resposta do cadastro."""

    barber_shop_id: str
    user_id: str


class LoginRequest(BaseModel):
    """Payload de login."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Resposta com o token JWT."""

    access_token: str
    token_type: str = "bearer"


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(payload: RegisterRequest) -> RegisterResponse:
    """Cria uma barbearia e um usuário administrador inicial."""
    # Verifica slug duplicado
    existing_shop = (
        supabase.table("barber_shops")
        .select("id")
        .eq("slug", payload.barber_shop_slug)
        .limit(1)
        .execute()
    )
    if existing_shop.data:
        raise HTTPException(status_code=409, detail="Slug de barbearia já existe.")

    # Cria barbearia
    shop_insert = (
        supabase.table("barber_shops")
        .insert({"name": payload.barber_shop_name, "slug": payload.barber_shop_slug})
        .execute()
    )
    if not shop_insert.data:
        raise HTTPException(status_code=500, detail="Falha ao criar barbearia.")
    shop_id = str(shop_insert.data[0]["id"])

    # Verifica email duplicado (global)
    existing_user = (
        supabase.table("users")
        .select("id")
        .eq("email", str(payload.email).lower())
        .limit(1)
        .execute()
    )
    if existing_user.data:
        raise HTTPException(status_code=409, detail="E-mail já cadastrado.")

    # Cria usuário (vinculado ao tenant)
    user_insert = (
        supabase.table("users")
        .insert(
            {
                "barber_shop_id": shop_id,
                "email": str(payload.email).lower(),
                "password_hash": hash_password(payload.password),
                "role": "owner",
            }
        )
        .execute()
    )
    if not user_insert.data:
        raise HTTPException(status_code=500, detail="Falha ao criar usuário.")

    user_id = str(user_insert.data[0]["id"])
    return RegisterResponse(barber_shop_id=shop_id, user_id=user_id)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    """Valida credenciais e retorna um JWT para usar nos endpoints autenticados."""
    user_res = (
        supabase.table("users")
        .select("id, barber_shop_id, email, password_hash")
        .eq("email", str(payload.email).lower())
        .limit(1)
        .execute()
    )
    if not user_res.data:
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    user = user_res.data[0]
    if not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    token = create_access_token(
        {
            "sub": str(user["id"]),
            "barber_shop_id": str(user["barber_shop_id"]),
            "email": user.get("email"),
        }
    )
    return TokenResponse(access_token=token)

