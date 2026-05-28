import os

from dotenv import load_dotenv
from supabase import Client, create_client

# Carrega variáveis do arquivo .env (quando existir)
load_dotenv()


def get_supabase_client() -> Client:
    """Cria e retorna um client do Supabase usando variáveis de ambiente."""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")

    if not supabase_url or not supabase_key:
        raise RuntimeError(
            "SUPABASE_URL e SUPABASE_KEY são obrigatórios no ambiente (.env)."
        )

    return create_client(supabase_url, supabase_key)


# Client singleton para reutilização nas rotas
supabase: Client = get_supabase_client()
