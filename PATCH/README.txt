SHORTYPRO — One-touch Fix Pack (Vercel + Render)

What this fixes:
1) shortypro.com loads blank but /index.html works
   - Adds Next.js home route that redirects / -> /index.html
     (creates BOTH frontend/src/app/page.tsx and frontend/app/page.tsx to cover your layout)

2) Stripe buttons not working
   - Fixes malformed Stripe Price IDs in public/index.html
   - Fixes a JS bug that could hard-crash the page (toast called with an unquoted identifier)
   - Sends successUrl/cancelUrl to backend

3) Render Stripe endpoint expecting successUrl/cancelUrl
   - Updates backend/stripe.py to accept missing success/cancel URLs by generating safe defaults
   - Adds CORS-friendly URL derivation via FRONTEND_BASE_URL (optional env var)

How to apply:
- Unzip into your repo root (same level as frontend/ and backend/ folders)
- Run:
    python PATCH/apply_shortypro_fixes.py

Then:
    git add -A
    git commit -m "One-touch: fix homepage redirect + stripe checkout wiring + render defaults"
    git push

Render environment recommendation:
- Set FRONTEND_BASE_URL = https://www.shortypro.com  (optional but recommended)

Notes:
- This pack overwrites frontend/public/index.html with a corrected version based on the file you uploaded.
