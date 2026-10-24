import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient

# Load env
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'nusa_pratama')
NEW_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@nusapratama.com').lower().strip()
NEW_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'AdminNusa123!')

def hash_pw(plain: str) -> str:
    return bcrypt.hashpw(plain.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def main():
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # 1. Clear failed login attempts / lockout
    deleted_attempts = await db.login_attempts.delete_many({})
    print(f"✓ Cleared {deleted_attempts.deleted_count} failed login attempt(s) / lockout(s).")
    
    # 2. Reset or create admin
    hashed = hash_pw(NEW_PASSWORD)
    user = await db.users.find_one({"email": NEW_EMAIL})
    
    if user:
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"password_hash": hashed, "role": "admin"}}
        )
        print(f"✓ Berhasil mereset password untuk: {NEW_EMAIL}")
    else:
        # Check any admin user
        any_admin = await db.users.find_one({"role": "admin"})
        if any_admin:
            await db.users.update_one(
                {"_id": any_admin["_id"]},
                {"$set": {"email": NEW_EMAIL, "password_hash": hashed}}
            )
            print(f"✓ Berhasil mengupdate akun admin menjadi: {NEW_EMAIL}")
        else:
            import uuid
            from datetime import datetime, timezone
            await db.users.insert_one({
                "id": str(uuid.uuid4()),
                "email": NEW_EMAIL,
                "password_hash": hashed,
                "name": "Admin",
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat()
            })
            print(f"✓ Berhasil membuat akun admin baru: {NEW_EMAIL}")

    print("\n" + "="*50)
    print("KREDENSIAL LOGIN ADMIN:")
    print(f"Email    : {NEW_EMAIL}")
    print(f"Password : {NEW_PASSWORD}")
    print("="*50)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
