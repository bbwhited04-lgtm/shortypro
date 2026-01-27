# ShortyPro — Full Stack Drop (Frontend + Backend + Postgres)

This zip is a **drop-in monorepo** with:
- **Frontend:** Next.js (App Router) on Vercel
- **Backend:** FastAPI on Render
- **Database:** Render Postgres

Includes:
- Pages: **Index, Bio, Docs, FAQ**
- **User Login + Dashboard**
- **Social links + social share buttons**
- **Cross-links** to your other sites
- Clean, modern UI

---

## 1) Repo layout

- `frontend/` — Next.js app (deploy to Vercel)
- `backend/` — FastAPI app (deploy to Render)
- `render.yaml` — optional Render blueprint

---

## 2) Local run (recommended first)

### Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# mac/linux:
# source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Edit DATABASE_URL and secrets
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Next.js)
```bash
cd ../frontend
npm install
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_BASE_URL to your backend (local or Render)
npm run dev
```

Open http://localhost:3000

Login uses your backend env:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

---

## 3) Deploy

### Vercel (frontend)
- Root Directory: `frontend`
- Env vars: copy from `frontend/.env.example` to Vercel project env

### Render (backend)
- Create a **Web Service** from this repo
- Root Directory: `backend`
- Build Command:
  ```bash
  pip install -r requirements.txt
  ```
- Start Command:
  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```
- Add a Render Postgres instance and set `DATABASE_URL` (Render provides it)

---

## 4) Git push

From repo root:
```bash
git add .
git commit -m "feat: shortypro full-stack drop"
git push
```

---

## Notes
- Backend auto-creates tables and the admin user (from env) on startup.
- Dashboard is protected by a **httpOnly cookie** set by the Next.js `/api/auth/login` route.
