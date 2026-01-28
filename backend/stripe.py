from main import app
import os
import stripe
from fastapi import Request, HTTPException

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")

@app.post("/stripe/create-checkout-session")
async def create_checkout_session(payload: dict):
    price_id = payload.get("priceId")
    success_url = payload.get("successUrl")
    cancel_url = payload.get("cancelUrl")

    if not price_id:
        raise HTTPException(status_code=400, detail="Missing priceId")

    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
    )

    return {"url": session.url}
