from fastapi import APIRouter
from app.core.models import MODELS

router = APIRouter()

@router.get("")
def list_models():
    return MODELS
