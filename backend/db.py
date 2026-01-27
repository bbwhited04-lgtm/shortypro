import os
import asyncpg
from typing import Optional

_pool: Optional[asyncpg.Pool] = None

def database_url() -> str:
    url = os.getenv("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL is required")
    # Render sometimes provides 'postgres://', asyncpg prefers 'postgresql://'
    return url.replace("postgres://", "postgresql://", 1)

async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(dsn=database_url(), min_size=1, max_size=5)
    return _pool

async def close_pool() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None
