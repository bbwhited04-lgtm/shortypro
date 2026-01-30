from fastapi import APIRouter
from pydantic import BaseModel
from app.core.models import MODELS, default_model
router = APIRouter()

from app.core.models import MODELS, default_model
from fastapi import HTTPException

def find_model(model_id: str):
    for m in MODELS:
        if m["id"] == model_id:
            return m
    return None

class ChatRequest(BaseModel):
    message: str
    model: str | None=none

@router.post("/", include_in_schema=False)
@router.post("/")

def chat(req: ChatRequest):
    chosen = req.model or default_model()
    m = find_model(chosen)

    if not m:
        raise HTTPException(400, detail=f"Unknown model: {chosen}")

    if m["provider"] == "openai":
        return chat_openai(req.message, m["id"])

    if m["provider"] == "deepseek":
        return chat_deepseek(req.message, m["id"])

    raise HTTPException(400, detail="Unsupported provider")
def find_model(model_id: str):
    for m in MODELS:
        if m["id"] == model_id:
            return m
    return None

@router.post("")
def chat(req: ChatRequest):
    chosen = req.model or default_model()
    m = find_model(chosen)
    if not m:
        raise HTTPException(400, detail=f"Unknown model: {chosen}")

    if m["provider"] == "openai":
        # call OpenAI with m["id"]
        ...
    elif m["provider"] == "deepseek":
        # call DeepSeek with m["id"]
        ...
    else:
        raise HTTPException(400, detail="Unsupported provider")
