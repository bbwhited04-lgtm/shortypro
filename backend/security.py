import os
import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt
from typing import Any, Dict

def _env(name: str, default: str = "") -> str:
    return os.getenv(name, default)

JWT_SECRET = _env("JWT_SECRET")
JWT_ISSUER = _env("JWT_ISSUER", "shortypro-backend")
JWT_AUDIENCE = _env("JWT_AUDIENCE", "shortypro-frontend")
TTL_MIN = int(_env("ACCESS_TOKEN_TTL_MINUTES", "10080"))

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except Exception:
        return False

def create_access_token(sub: str, email: str) -> str:
    if not JWT_SECRET:
        raise RuntimeError("JWT_SECRET is required")
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=TTL_MIN)
    payload: Dict[str, Any] = {
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "sub": sub,
        "email": email,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
        "typ": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def decode_token(token: str) -> Dict[str, Any]:
    if not JWT_SECRET:
        raise RuntimeError("JWT_SECRET is required")
    return jwt.decode(
        token,
        JWT_SECRET,
        algorithms=["HS256"],
        issuer=JWT_ISSUER,
        audience=JWT_AUDIENCE,
    )
