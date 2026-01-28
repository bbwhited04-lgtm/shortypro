from __future__ import annotations

import os
from typing import Optional

import stripe
from fastapi import FastAPI
from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr

# ------------------------------
# Settings (env vars on Render)
# ------------------------------
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID", "")
PUBLIC_FRONTEND_URL = os.getenv("PUBLIC_FRONTEND_URL", "http://localhost:3000").rstrip("/")
STRIPE_SUCCESS_URL = os.getenv("STRIPE_SUCCESS_URL", f"{PUBLIC_FRONTEND_URL}/success")
STRIPE_CANCEL_URL = os.getenv("STRIPE_CANCEL_URL", f"{PUBLIC_FRONTEND_URL}/cancel")
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "")

if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

app = FastAPI(title="ShortyPro API", version="1.0.0")

# Allow frontend to call backend from Vercel/Custom domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://shortypro.com",
        "https://www.shortypro.com",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Models
# ------------------------------
class LoginIn(BaseModel):
    # This fixes your crash: EmailStr must be imported from pydantic
    email: EmailStr

class CheckoutOut(BaseModel):
    url: str

# ------------------------------
# Helpers
# ------------------------------
def require_admin(x_admin_api_key: Optional[str]) -> None:
    if not ADMIN_API_KEY:
        # If you don't set an admin key, we don't enforce it.
        return
    if x_admin_api_key != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

# ------------------------------
# Routes
# ------------------------------
@app.get("/health")
def health():
    return {"ok": True}

@app.post("/auth/login")
def login(payload: LoginIn):
    # Stub login response (you can wire magic links later)
    return {"ok": True, "email": str(payload.email)}

@app.post("/stripe/create-checkout-session", response_model=CheckoutOut)
def create_checkout_session(request: Request):
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="STRIPE_SECRET_KEY is not set")
    if not STRIPE_PRICE_ID:
        raise HTTPException(status_code=500, detail="STRIPE_PRICE_ID is not set")

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=[{"price": STRIPE_PRICE_ID, "quantity": 1}],
            success_url=STRIPE_SUCCESS_URL,
            cancel_url=STRIPE_CANCEL_URL,
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stripe error: {e}")

@app.post("/stripe/create-portal-session", response_model=CheckoutOut)
def create_portal_session(customer_id: Optional[str] = None):
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="STRIPE_SECRET_KEY is not set")

    # NOTE: Portal sessions require a real Stripe customer id.
    # You can store customer_id after checkout via webhook.
    if not customer_id:
        raise HTTPException(status_code=400, detail="customer_id is required")

    try:
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=PUBLIC_FRONTEND_URL,
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stripe error: {e}")

@app.get("/admin/status")
def admin_status(x_admin_api_key: Optional[str] = Header(default=None)):
    require_admin(x_admin_api_key)
    return {
        "ok": True,
        "stripe_configured": bool(STRIPE_SECRET_KEY and STRIPE_PRICE_ID),
        "frontend": PUBLIC_FRONTEND_URL,
    }

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Makes Render logs clearer and avoids generic 500 pages
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)},
    )
