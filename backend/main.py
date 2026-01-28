import os
import uuid
from fastapi import FastAPI, HTTPException, Depends, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv
from stripe_webhook import router as stripe_webhook_router
from db import get_pool, close_pool
from security import hash_password, verify_password, create_access_token, decode_token

load_dotenv()
app.include_router(stripe_webhook_router)
APP_NAME = os.getenv("APP_NAME", "ShortyPro")

def cors_origins():
    raw = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    return [o.strip() for o in raw.split(",") if o.strip()]

app = FastAPI(title=APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)

class LoginOut(BaseModel):
    token: str
    user_id: str
    email: EmailStr

class MeOut(BaseModel):
    user_id: str
    email: EmailStr

class ProfileIn(BaseModel):
    display_name: str | None = None
    bio: str | None = None

class ProfileOut(BaseModel):
    user_id: str
    display_name: str | None
    bio: str | None

async def init_db_and_admin():
    pool = await get_pool()
    # Create schema
    schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
    with open(schema_path, "r", encoding="utf-8") as f:
        sql = f.read()
    async with pool.acquire() as conn:
        await conn.execute(sql)

        # Bootstrap admin if no users exist
        count = await conn.fetchval("SELECT COUNT(*) FROM users;")
        if count == 0:
            admin_email = os.getenv("ADMIN_EMAIL", "").strip().lower()
            admin_password = os.getenv("ADMIN_PASSWORD", "")
            if not admin_email or not admin_password:
                # Don't crash production if not set; just skip bootstrap
                return
            user_id = uuid.uuid4()
            await conn.execute(
                "INSERT INTO users(id, email, password_hash) VALUES($1, $2, $3);",
                user_id,
                admin_email,
                hash_password(admin_password),
            )
            await conn.execute(
                "INSERT INTO profiles(user_id, display_name, bio) VALUES($1, $2, $3);",
                user_id,
                "Billy (Admin)",
                "Welcome to ShortyPro.",
            )

@app.on_event("startup")
async def on_startup():
    await init_db_and_admin()

@app.on_event("shutdown")
async def on_shutdown():
    await close_pool()

@app.get("/")
async def root():
    return {"status": "ok", "service": "shortypro-backend"}

@app.head("/")
async def root_head():
    return Response(status_code=200)

@app.get("/health")
async def health():
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute("SELECT 1;")
    return {"ok": True}

def get_bearer_token(req: Request) -> str:
    auth = req.headers.get("authorization", "")
    if auth.lower().startswith("bearer "):
        return auth.split(" ", 1)[1].strip()
    return ""

async def require_user(req: Request) -> dict:
    token = get_bearer_token(req)
    if not token:
        raise HTTPException(status_code=401, detail="Missing bearer token")
    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload

@app.post("/auth/login", response_model=LoginOut)
async def login(data: LoginIn):
    pool = await get_pool()
    email = data.email.strip().lower()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT id, email, password_hash FROM users WHERE email=$1;", email)
        if not row:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not verify_password(data.password, row["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_access_token(str(row["id"]), row["email"])
        return LoginOut(token=token, user_id=str(row["id"]), email=row["email"])

@app.get("/auth/me", response_model=MeOut)
async def me(payload=Depends(require_user)):
    return MeOut(user_id=payload["sub"], email=payload["email"])

@app.get("/profile", response_model=ProfileOut)
async def get_profile(payload=Depends(require_user)):
    pool = await get_pool()
    user_id = uuid.UUID(payload["sub"])
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT user_id, display_name, bio FROM profiles WHERE user_id=$1;",
            user_id
        )
        if not row:
            return ProfileOut(user_id=str(user_id), display_name=None, bio=None)
        return ProfileOut(user_id=str(row["user_id"]), display_name=row["display_name"], bio=row["bio"])

@app.post("/profile", response_model=ProfileOut)
async def upsert_profile(data: ProfileIn, payload=Depends(require_user)):
    pool = await get_pool()
    user_id = uuid.UUID(payload["sub"])
    async with pool.acquire() as conn:
        await conn.execute(
            """INSERT INTO profiles(user_id, display_name, bio)
                 VALUES($1, $2, $3)
                 ON CONFLICT (user_id)
                 DO UPDATE SET display_name=EXCLUDED.display_name, bio=EXCLUDED.bio, updated_at=now();""",
            user_id,
            data.display_name,
            data.bio,
        )
        row = await conn.fetchrow(
            "SELECT user_id, display_name, bio FROM profiles WHERE user_id=$1;",
            user_id
        )
        return ProfileOut(user_id=str(row["user_id"]), display_name=row["display_name"], bio=row["bio"])
