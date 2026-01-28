import os
import stripe
from fastapi import APIRouter, HTTPException, Request

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
FRONTEND_BASE_URL = (os.getenv("FRONTEND_BASE_URL") or "").rstrip("/")

@router.post("/stripe/create-checkout-session")
async def create_checkout_session(payload: dict, request: Request):
    price_id = payload.get("priceId")
    success_url = payload.get("successUrl")
    cancel_url = payload.get("cancelUrl")

    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="STRIPE_SECRET_KEY missing")
    if not price_id:
        raise HTTPException(status_code=400, detail="Missing priceId")

    # If the frontend didn't send success/cancel, generate safe defaults.
    if not success_url or not cancel_url:
        origin = FRONTEND_BASE_URL
        if not origin:
            origin = (request.headers.get("origin") or "").rstrip("/")
        if not origin:
            ref = request.headers.get("referer") or ""
            # best-effort extract scheme+host
            m = re.match(r"^(https?://[^/]+)", ref)
            origin = (m.group(1) if m else "").rstrip("/")
        if not origin:
            origin = "https://www.shortypro.com"

        success_url = success_url or (origin + "/index.html?checkout=success")
        cancel_url = cancel_url or (origin + "/index.html?checkout=cancel")

    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
    )

    return {"url": session.url}
