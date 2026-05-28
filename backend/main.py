from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import (
    appointments,
    auth,
    availability,
    barber_shops,
    barbers,
    customers,
    services,
)

# Carrega .env (quando existir) antes de inicializar dependências
load_dotenv()

app = FastAPI(title="FlowCut API", version="0.1.0")


# CORS liberado por enquanto (para facilitar desenvolvimento)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Inclui todos os routers
app.include_router(auth.router)
app.include_router(barber_shops.router)
app.include_router(barbers.router)
app.include_router(services.router)
app.include_router(availability.router)
app.include_router(appointments.router)
app.include_router(customers.router)


@app.get("/")
def root():
    """Health check simples da API."""
    return {"status": "FlowCut API running"}

