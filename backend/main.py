from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes.models import router as models_router
import uuid
import os
import shutil

# ✅ CREATE APP FIRST
app = FastAPI()

# ✅ THEN include routers
app.include_router(models_router, prefix="/models")

# Allow your frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.shortypro.com",
        "https://shortypro.com",
        "http://localhost:3000",  # optional, for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADS = {}  # swap to Redis/DB later
UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "/tmp/shortypro_uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/uploads")
async def create_upload(file: UploadFile = File(...)):
    upload_id = f"u_{uuid.uuid4().hex[:12]}"
    save_path = os.path.join(UPLOAD_DIR, f"{upload_id}_{file.filename}")

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    UPLOADS[upload_id] = {
        "upload_id": upload_id,
        "status": "processing",
        "progress": 10,
        "stage": "upload",
        "message": "Upload received"
    }
    return UPLOADS[upload_id]
