# ShortyPro Backend UI (Static Demo)

This folder contains **original** HTML/CSS/JS for a Sprout-like admin layout, built from scratch to avoid
copyright/patent/trademark issues.

## What this is
- A **static** admin UI you can drop into your project (`/public/admin` or similar).
- Feature gating demo using `localStorage` plan values (`free|creator|growth|pro`).

## What this is NOT
- A full backend implementation.
- OAuth flows or Stripe secret-key work (those must be server-side).

## Files
- `dashboard.html` – overview
- `video.html` – Video Studio (short creation)
- `calendar.html` – Publishing Calendar
- `funnels.html` – Magnetic Funnels builder
- `analytics.html` – analytics table
- `listening.html` – listening/keywords
- `cases.html` – support cases
- `integrations.html` – integration + login stubs
- `account.html` – profile + connect platforms
- `billing.html` – billing placeholder (wire to Stripe)
- `assets/admin.css`, `assets/admin.js` – shared styles + gating

## Hooking into real auth + Stripe (recommended)
1. **Auth**: after login, issue a session cookie/JWT with plan claims.
2. **Stripe**: create checkout sessions server-side; listen to webhooks to update the user's plan in DB.
3. **Server-side gating**: never trust client-only checks. Redirect unauthorized users.

## OAuth Connections (platforms)
Use official platform APIs/SDKs:
- Google Sign-In (OAuth 2.0)
- Meta (Facebook/Instagram)
- TikTok, YouTube, LinkedIn, X, Pinterest, Threads (as supported)

Store tokens encrypted and refresh them via official flows.

## Local preview
Open `dashboard.html` in a browser. Use "Upgrade" to simulate plans.
