from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/", include_in_schema=False)
@router.post("/")

def chat(req: ChatRequest):
    return {
        "reply": f"Chatterly received: {req.message}"
    }
