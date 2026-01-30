from fastapi import FastAPI
from app.routes.chat import router as chat_router

app = FastAPI(title="Chatterly API")

app.include_router(chat_router, prefix="/chat")

@app.get("/")
def root():
    return {"status": "Chatterly backend running"}
