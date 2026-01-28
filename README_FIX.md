# ShortyPro One-Touch Fix ZIP

This ZIP includes:
- `/backend` FastAPI service with EmailStr import fixed and Stripe endpoints
- `/frontend` Next.js 14 App Router site with click-safe card buttons and stable styles
- robots.txt + sitemap.xml
- example env files

## 1) Copy folders into your repo root
Copy `frontend/` and `backend/` into your repo root.

## 2) Frontend (Vercel)
Set env var:
- `NEXT_PUBLIC_API_BASE` = your Render backend URL (example: https://shortypro-backend.onrender.com)

Deploy as normal (Vercel auto-detects Next.js).

## 3) Backend (Render)
Create a new Render Web Service pointing to `/backend`, or set Root Directory to `backend`.

Set env vars:
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `PUBLIC_FRONTEND_URL` = https://shortypro.com
- (optional) `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL`
- (optional) `ADMIN_API_KEY`

## 4) Push
git add . && git commit -m "one-touch fix" && git push
