from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes.models import router as models_router
app.include_router(models_router, prefix="/models")
import uuid
import os
import shutil

app = FastAPI()

# Allow your frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.shortypro.com",
        "https://shortypro.com",
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

@app.get("/api/uploads/{upload_id}")
async def get_upload(upload_id: str):
    data = UPLOADS.get(upload_id)
    if not data:
        return JSONResponse({"status": "error", "message": "Not found"}, status_code=404)

    # TEMP demo progress
    if data["status"] == "processing":
        p = min(100, data["progress"] + 12)
        data["progress"] = p

        if p < 40:
            data["stage"] = "auto_clips"
        elif p < 70:
            data["stage"] = "captions"
        elif p < 95:
            data["stage"] = "export"
        else:
            data["status"] = "complete"
            data["progress"] = 100

    return data
