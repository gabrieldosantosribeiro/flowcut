import os
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from database import supabase
from .auth import AuthContext, get_current_auth, require_shop_access

router = APIRouter(prefix="/billing", tags=["billing"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

PRICE_IDS = {
    "basic": os.getenv("STRIPE_PRICE_BASIC"),
    "pro": os.getenv("STRIPE_PRICE_PRO"),
    "premium": os.getenv("STRIPE_PRICE_PREMIUM"),
}


class CreateCheckoutRequest(BaseModel):
    plan: str
    success_url: str
    cancel_url: str


@router.post("/create-checkout")
def create_checkout(
    payload: CreateCheckoutRequest,
    auth: AuthContext = Depends(get_current_auth),
):
    """Cria uma sessão de checkout do Stripe."""
    price_id = PRICE_IDS.get(payload.plan)
    if not price_id:
        raise HTTPException(status_code=400, detail="Plano inválido.")

    # Busca ou cria customer no Stripe
    sub_res = (
        supabase.table("subscriptions")
        .select("stripe_customer_id")
        .eq("barber_shop_id", auth.barber_shop_id)
        .limit(1)
        .execute()
    )

    customer_id = None
    if sub_res.data and sub_res.data[0].get("stripe_customer_id"):
        customer_id = sub_res.data[0]["stripe_customer_id"]
    else:
        customer = stripe.Customer.create(
            email=auth.email,
            metadata={"barber_shop_id": auth.barber_shop_id},
        )
        customer_id = customer.id
        supabase.table("subscriptions").update(
            {"stripe_customer_id": customer_id}
        ).eq("barber_shop_id", auth.barber_shop_id).execute()

    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url=payload.success_url,
        cancel_url=payload.cancel_url,
        metadata={"barber_shop_id": auth.barber_shop_id, "plan": payload.plan},
    )

    return {"checkout_url": session.url}


@router.post("/webhook")
async def webhook(request: Request):
    """Recebe eventos do Stripe e atualiza assinaturas."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except Exception:
        raise HTTPException(status_code=400, detail="Webhook inválido.")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        barber_shop_id = session["metadata"].get("barber_shop_id")
        plan = session["metadata"].get("plan")
        subscription_id = session.get("subscription")

        if barber_shop_id:
            supabase.table("subscriptions").update({
                "plan": plan,
                "status": "active",
                "stripe_subscription_id": subscription_id,
            }).eq("barber_shop_id", barber_shop_id).execute()

    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        supabase.table("subscriptions").update({
            "status": "cancelled",
        }).eq("stripe_subscription_id", subscription["id"]).execute()

    elif event["type"] == "invoice.payment_failed":
        subscription = event["data"]["object"]
        supabase.table("subscriptions").update({
            "status": "past_due",
        }).eq("stripe_customer_id", subscription["customer"]).execute()

    return {"status": "ok"}


@router.get("/subscription")
def get_subscription(auth: AuthContext = Depends(get_current_auth)):
    """Retorna a assinatura atual da barbearia."""
    res = (
        supabase.table("subscriptions")
        .select("*")
        .eq("barber_shop_id", auth.barber_shop_id)
        .limit(1)
        .execute()
    )
    if not res.data:
        return {"plan": "trial", "status": "active", "trial_ends_at": None}
    return res.data[0]