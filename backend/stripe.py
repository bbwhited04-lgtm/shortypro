import os
import stripe
from fastapi import APIRouter, HTTPException

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@router.post("/stripe/create-checkout-session")
async def create_checkout_session(payload: dict):
    price_id = payload.get("priceId")
    success_url = payload.get("successUrl")
    cancel_url = payload.get("cancelUrl")

    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="STRIPE_SECRET_KEY missing")
    if not price_id or not success_url or not cancel_url:
        raise HTTPException(status_code=400, detail="Missing priceId/successUrl/cancelUrl")

    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
    )

    return {"url": session.url}
