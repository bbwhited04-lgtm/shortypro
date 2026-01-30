from fastapi import FastAPI
from app.routes.chat import router as chat_router

# If you added models_router:
from app.routes.models import router as models_router

app = FastAPI(title="Chatterly API")

app.include_router(chat_router, prefix="/chat")
app.include_router(models_router, prefix="/models")

@app.get("/")
def root():
    return {"status": "Chatterly backend running"}
