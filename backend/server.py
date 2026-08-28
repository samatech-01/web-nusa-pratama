from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, UploadFile, File
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
import os
import logging
import uuid
import bcrypt
import jwt
import requests
from datetime import datetime, timezone, timedelta

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ['JWT_SECRET']

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "nusa-pratama"
storage_key = None


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data, timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def get_current_admin(request: Request) -> dict:
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------- Models ----------

class LoginInput(BaseModel):
    email: str
    password: str


class ChangePasswordInput(BaseModel):
    current_password: str
    new_password: str


class ServiceUpdate(BaseModel):
    description_en: Optional[str] = None
    description_id: Optional[str] = None
    customers: Optional[List[str]] = None
    gallery: Optional[List[str]] = None


class SettingsUpdate(BaseModel):
    nib_image_url: str


# ---------- Auth ----------

MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


@api_router.post("/auth/login")
async def login(body: LoginInput, request: Request):
    email = body.email.strip().lower()
    identifier = f"{get_client_ip(request)}:{email}"
    now = datetime.now(timezone.utc)

    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= MAX_ATTEMPTS:
        locked_at = datetime.fromisoformat(attempt["last_attempt"])
        if now - locked_at < timedelta(minutes=LOCKOUT_MINUTES):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        await db.login_attempts.delete_one({"identifier": identifier})

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last_attempt": now.isoformat(), "expires_at": now + timedelta(minutes=LOCKOUT_MINUTES)}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Email atau password salah")

    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(user["id"], user["email"])
    return {
        "access_token": token,
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")},
    }


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_admin)):
    return user


@api_router.post("/auth/change-password")
async def change_password(body: ChangePasswordInput, user: dict = Depends(get_current_admin)):
    full_user = await db.users.find_one({"id": user["id"]})
    if not verify_password(body.current_password, full_user["password_hash"]):
        raise HTTPException(status_code=400, detail="Password saat ini salah")
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password baru minimal 8 karakter")
    await db.users.update_one({"id": user["id"]}, {"$set": {"password_hash": hash_password(body.new_password)}})
    return {"message": "Password berhasil diubah"}


# ---------- Content ----------

@api_router.get("/content")
async def get_content():
    services = await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(20)
    settings = await db.settings.find_one({"key": "site"}, {"_id": 0})
    return {"services": services, "settings": settings or {}}


@api_router.put("/services/{service_key}")
async def update_service(service_key: str, body: ServiceUpdate, user: dict = Depends(get_current_admin)):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    if "customers" in updates:
        updates["customers"] = [c.strip() for c in updates["customers"] if c.strip()]
    existing = await db.services.find_one({"key": service_key}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Service not found")
    if "gallery" in updates:
        removed = set(existing.get("gallery", [])) - set(updates["gallery"])
        removed_ids = [u.split("/api/files/")[1] for u in removed if u.startswith("/api/files/")]
        if removed_ids:
            settings = await db.settings.find_one({"key": "site"}) or {}
            still_used = {settings.get("nib_image_url", "")}
            async for svc in db.services.find({"key": {"$ne": service_key}}, {"gallery": 1}):
                still_used.update(svc.get("gallery", []))
            for fid in removed_ids:
                if f"/api/files/{fid}" not in still_used:
                    await db.files.update_one({"id": fid}, {"$set": {"is_deleted": True}})
    await db.services.update_one({"key": service_key}, {"$set": updates})
    service = await db.services.find_one({"key": service_key}, {"_id": 0})
    return service


@api_router.put("/settings")
async def update_settings(body: SettingsUpdate, user: dict = Depends(get_current_admin)):
    await db.settings.update_one({"key": "site"}, {"$set": {"nib_image_url": body.nib_image_url}}, upsert=True)
    settings = await db.settings.find_one({"key": "site"}, {"_id": 0})
    return settings


# ---------- Files ----------

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_FILE_SIZE = 8 * 1024 * 1024


@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...), user: dict = Depends(get_current_admin)):
    content_type = file.content_type or "application/octet-stream"
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Hanya file gambar (JPG/PNG/WebP/GIF) yang diperbolehkan")
    data = await file.read()
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Ukuran file maksimal 8MB")
    ext = file.filename.split(".")[-1].lower() if "." in (file.filename or "") else "jpg"
    file_id = str(uuid.uuid4())
    path = f"{APP_NAME}/uploads/{file_id}.{ext}"
    try:
        result = put_object(path, data, content_type)
    except Exception as e:
        logger.error(f"Storage upload failed: {e}")
        raise HTTPException(status_code=502, detail="Upload ke storage gagal, coba lagi")
    await db.files.insert_one({
        "id": file_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"id": file_id, "url": f"/api/files/{file_id}"}


@api_router.get("/files/{file_id}")
async def serve_file(file_id: str):
    record = await db.files.find_one({"id": file_id, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = get_object(record["storage_path"])
    except Exception as e:
        logger.error(f"Storage fetch failed: {e}")
        raise HTTPException(status_code=502, detail="Gagal mengambil file")
    return Response(
        content=data,
        media_type=record.get("content_type", content_type),
        headers={"Cache-Control": "public, max-age=86400"},
    )


# ---------- Seed ----------

DEFAULT_SERVICES = [
    {
        "key": "catering",
        "label": "Catering",
        "label_id": "Katering",
        "order": 1,
        "description_en": "We provide catering services for industrial sectors, mining, gas and oil companies, offices and events. Every menu is halal, safe and healthy, prepared under HACCP food safety standards with daily menu cycles and laboratory sampling every 3 months.",
        "description_id": "Kami menyediakan jasa katering untuk sektor industri, pertambangan, perusahaan migas, perkantoran dan acara. Setiap menu halal, aman dan sehat, disiapkan sesuai standar keamanan pangan HACCP dengan siklus menu harian dan uji laboratorium setiap 3 bulan.",
        "customers": [
            "Perusahaan pertambangan batu bara — Kalimantan Timur",
            "Kontraktor migas — Balikpapan",
            "Perkantoran & event korporat — Kota Balikpapan",
        ],
        "gallery": [
            "https://static.prod-images.emergentagent.com/jobs/e3147f0b-4e58-4e9a-a73b-2f2e410a807b/images/626e29a99963e4864d7fcb1388dbce695da70acf236e75c3dab2165fde5a15ae.jpeg",
            "https://static.prod-images.emergentagent.com/jobs/e3147f0b-4e58-4e9a-a73b-2f2e410a807b/images/eb4e13cb87a751e32b3e91b7d99c37fe072fa0302d69370feb6f428cca43955f.jpeg",
        ],
    },
    {
        "key": "general-supply",
        "label": "General Supply",
        "label_id": "General Supply",
        "order": 2,
        "description_en": "A process of activities for the fulfillment or provision of the needs and supply of goods under contract or direct purchase to meet the needs of the business, with the aim of obtaining goods at an accountable price, the appropriate amount and quality and the procurement on time.",
        "description_id": "Proses kegiatan pemenuhan atau penyediaan kebutuhan dan pasokan barang berdasarkan kontrak maupun pembelian langsung untuk memenuhi kebutuhan bisnis, dengan tujuan memperoleh barang dengan harga yang akuntabel, jumlah dan kualitas yang tepat serta pengadaan yang tepat waktu.",
        "customers": [
            "Perusahaan tambang & kontraktor — Kalimantan Timur",
            "Instansi & perkantoran — Balikpapan",
        ],
        "gallery": [
            "https://static.prod-images.emergentagent.com/jobs/e3147f0b-4e58-4e9a-a73b-2f2e410a807b/images/50f4c5716cf4ac0f57d2b1166023d6bedf127eccd83a63c0fd3ae664d8a0580f.jpeg",
            "https://static.prod-images.emergentagent.com/jobs/e3147f0b-4e58-4e9a-a73b-2f2e410a807b/images/607f00b8c819be4eb529204f8d8bbfb5c2a312995935c82d3296107381ef6e00.jpeg",
        ],
    },
    {
        "key": "logistics",
        "label": "Logistics",
        "label_id": "Logistik",
        "order": 3,
        "description_en": "Our logistics service handles packages from hand-over to retail shipping, sorting by type of goods and delivery area, safe courier delivery until destination, and on-time acceptance by the receiver.",
        "description_id": "Layanan logistik kami menangani paket mulai dari serah terima ke jasa pengiriman ritel, penyortiran berdasarkan jenis barang dan area pengiriman, pengiriman kurir yang aman sampai tujuan, hingga diterima tepat waktu oleh penerima.",
        "customers": [
            "Distribusi barang industri — Kalimantan Timur",
            "Pengiriman ritel & korporat — Balikpapan dan sekitarnya",
        ],
        "gallery": [
            "https://static.prod-images.emergentagent.com/jobs/e3147f0b-4e58-4e9a-a73b-2f2e410a807b/images/66a879a15165a316e220d0eae72b43861b5dae647040d77c66c198991e940fee.jpeg",
            "https://static.prod-images.emergentagent.com/jobs/e3147f0b-4e58-4e9a-a73b-2f2e410a807b/images/132b9a821aad5bf45dc64c946b6f4ca7191db9760752284d5b75268130fcc24f.jpeg",
        ],
    },
    {
        "key": "hvac",
        "label": "HVAC",
        "label_id": "HVAC",
        "order": 4,
        "description_en": "HVAC contractor services (Heating, Ventilation & Air Conditioning): installation, maintenance and repair of air conditioning and ventilation systems for offices, industrial facilities and commercial buildings.",
        "description_id": "Jasa kontraktor HVAC (Heating, Ventilation & Air Conditioning): instalasi, perawatan dan perbaikan sistem tata udara dan ventilasi untuk perkantoran, fasilitas industri dan gedung komersial.",
        "customers": [
            "Gedung perkantoran — Balikpapan",
            "Fasilitas industri & pergudangan — Kalimantan Timur",
        ],
        "gallery": [
            "https://static.prod-images.emergentagent.com/jobs/e3147f0b-4e58-4e9a-a73b-2f2e410a807b/images/49154b5c9daf97e8f81e4147c51bbff48ea697efe6222b47c33f3f8808b22c15.jpeg",
            "https://static.prod-images.emergentagent.com/jobs/e3147f0b-4e58-4e9a-a73b-2f2e410a807b/images/c405c2807686872170eeae2e7ff2777f9c811c7200a2c386e14cb1cf9e2d64f4.jpeg",
        ],
    },
]


async def seed():
    admin_email = os.environ['ADMIN_EMAIL'].lower()
    admin_password = os.environ['ADMIN_PASSWORD']
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin seeded")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated from env")

    for svc in DEFAULT_SERVICES:
        if await db.services.find_one({"key": svc["key"]}) is None:
            await db.services.insert_one(dict(svc))
    if await db.settings.find_one({"key": "site"}) is None:
        await db.settings.insert_one({"key": "site", "nib_image_url": "/images/legal_nib.png"})

    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.login_attempts.create_index("expires_at", expireAfterSeconds=0)
    await db.services.create_index("key", unique=True)


@app.on_event("startup")
async def on_startup():
    await seed()
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@api_router.get("/")
async def root():
    return {"message": "PT Nusa Pratama Solution API"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
