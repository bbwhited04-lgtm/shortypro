import os
import stripe
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter()

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
APP_URL = os.environ.get("APP_URL", "https://www.shortypro.com")

PRICE_MAP = {
    "starter": os.environ.get("STRIPE_PRICE_STARTER", ""),
    "pro": os.environ.get("STRIPE_PRICE_PRO", ""),
    "agency": os.environ.get("STRIPE_PRICE_AGENCY", ""),
}

@router.post("/api/billing/checkout")
async def create_checkout(req: Request):
    body = await req.json()
    plan = (body.get("plan") or "").lower()
    price_id = PRICE_MAP.get(plan)

    if not price_id:
        return JSONResponse({"ok": False, "error": "Invalid plan"}, status_code=400)

    # TODO: replace with your real user id/email once auth exists
    # For now, tie checkout to an email if you have it.
    email = body.get("email")  # optional

    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=f"{APP_URL}/dashboard/index.html?billing=success",
        cancel_url=f"{APP_URL}/dashboard/billing.html?billing=cancel",
        customer_email=email if email else None,
        allow_promotion_codes=True,
        automatic_tax={"enabled": True},
        metadata={"plan": plan},
    )

    return {"ok": True, "url": session.url}
