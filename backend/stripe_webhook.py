import os
import stripe
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

@router.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not endpoint_secret:
        raise HTTPException(status_code=500, detail="Webhook secret not configured")

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=endpoint_secret,
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    except Exception:
        raise HTTPException(status_code=400, detail="Webhook error")

    # 🔔 Handle events
    event_type = event["type"]

    if event_type == "checkout.session.completed":
        session = event["data"]["object"]
        # TODO: create user / activate subscription
        print("✅ Checkout completed:", session["id"])

    elif event_type == "customer.subscription.created":
        sub = event["data"]["object"]
        print("🆕 Subscription created:", sub["id"])

    elif event_type == "customer.subscription.updated":
        sub = event["data"]["object"]
        print("🔄 Subscription updated:", sub["id"])

    elif event_type == "customer.subscription.deleted":
        sub = event["data"]["object"]
        print("❌ Subscription deleted:", sub["id"])

    elif event_type == "invoice.payment_succeeded":
        invoice = event["data"]["object"]
        print("💰 Payment succeeded:", invoice["id"])

    elif event_type == "invoice.payment_failed":
        invoice = event["data"]["object"]
        print("⚠️ Payment failed:", invoice["id"])

    return JSONResponse({"status": "ok"})
