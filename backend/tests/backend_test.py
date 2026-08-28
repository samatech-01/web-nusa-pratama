import io
import os
import re
import uuid
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")

SERVICE_KEYS = ["catering", "general-supply", "logistics", "hvac"]


@pytest.fixture(scope="session")
def test_credentials():
    p = Path("/app/memory/test_credentials.md")
    if not p.exists():
        pytest.skip("missing credentials file")
    c = p.read_text(encoding="utf-8")
    e = re.search(r'(?im)^\s*(?:[-*]\s*)?(?:\*\*)?email(?:\*\*)?\s*:\s*`?([^`\s]+)', c)
    pw = re.search(r'(?im)^\s*(?:[-*]\s*)?(?:\*\*)?password(?:\*\*)?\s*:\s*`?([^`\s]+)', c)
    if not e or not pw:
        pytest.skip("no creds parsed")
    return {"email": e.group(1), "password": pw.group(1)}


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    return s


@pytest.fixture(scope="session")
def auth_token(api_client, test_credentials):
    r = api_client.post(f"{BASE_URL}/api/auth/login", json=test_credentials, timeout=30)
    if r.status_code != 200:
        pytest.fail(f"admin login failed {r.status_code}: {r.text[:300]}")
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}


# ---------- Health / root ----------
class TestHealth:
    def test_root(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/", timeout=30)
        assert r.status_code == 200
        assert "message" in r.json()


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, api_client, test_credentials):
        r = api_client.post(f"{BASE_URL}/api/auth/login", json=test_credentials, timeout=30)
        assert r.status_code == 200, r.text
        d = r.json()
        assert isinstance(d["access_token"], str) and len(d["access_token"]) > 20
        assert d["user"]["email"] == test_credentials["email"].lower()
        assert d["user"]["role"] == "admin"
        assert "password_hash" not in d["user"]

    def test_login_returns_bearer_token(self, api_client, test_credentials):
        r = requests.post(f"{BASE_URL}/api/auth/login", json=test_credentials, timeout=30)
        # design decision: Bearer token in JSON body (localStorage), not httpOnly cookie
        assert r.status_code == 200 and r.json().get("access_token"), "login does not return access_token"

    def test_login_wrong_password(self, api_client, test_credentials):
        r = api_client.post(f"{BASE_URL}/api/auth/login",
                            json={"email": test_credentials["email"], "password": "WrongPass!123"}, timeout=30)
        assert r.status_code == 401
        assert "detail" in r.json()

    def test_login_unknown_user(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/auth/login",
                            json={"email": f"nobody-{uuid.uuid4().hex[:6]}@x.test", "password": "whatever12"}, timeout=30)
        assert r.status_code == 401

    def test_login_validation_error(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/auth/login", json={"email": "a@b.c"}, timeout=30)
        assert r.status_code == 422

    def test_brute_force_lockout_dummy_email(self, api_client):
        # NOTE: lockout identifier is f"{request.client.host}:{email}" and request.client.host is the
        # ingress proxy pod IP (multiple replicas), so the counter is split across IPs and lockout
        # triggers after >5 attempts instead of exactly 5. Reported as a security defect.
        dummy = f"lockout-{uuid.uuid4().hex[:8]}@x.test"
        codes = []
        for _ in range(12):
            r = api_client.post(f"{BASE_URL}/api/auth/login",
                                json={"email": dummy, "password": "bad-password"}, timeout=30)
            codes.append(r.status_code)
        assert codes[:5] == [401] * 5, codes
        assert 429 in codes, f"lockout never triggered in 12 attempts: {codes}"

    def test_me_with_token(self, api_client, auth_headers, test_credentials):
        r = api_client.get(f"{BASE_URL}/api/auth/me", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert d["email"] == test_credentials["email"].lower()
        assert "password_hash" not in d and "_id" not in d

    def test_me_without_token(self, api_client):
        r = requests.get(f"{BASE_URL}/api/auth/me", timeout=30)
        assert r.status_code == 401

    def test_me_invalid_token(self, api_client):
        r = requests.get(f"{BASE_URL}/api/auth/me", headers={"Authorization": "Bearer garbage.token.here"}, timeout=30)
        assert r.status_code == 401

    def test_bcrypt_hash_format(self):
        import asyncio
        from motor.motor_asyncio import AsyncIOMotorClient
        env = dotenv_values("/app/backend/.env")

        async def _check():
            cl = AsyncIOMotorClient(env["MONGO_URL"])
            u = await cl[env["DB_NAME"]].users.find_one({"email": env["ADMIN_EMAIL"].lower()})
            cl.close()
            return u

        u = asyncio.get_event_loop().run_until_complete(_check()) if False else asyncio.run(_check())
        assert u is not None, "admin user not seeded"
        assert u["password_hash"].startswith("$2b$"), u["password_hash"][:10]


# ---------- Change password ----------
class TestChangePassword:
    def test_wrong_current_password(self, api_client, auth_headers):
        r = api_client.post(f"{BASE_URL}/api/auth/change-password", headers=auth_headers,
                            json={"current_password": "definitely-wrong", "new_password": "NewPass12345!"}, timeout=30)
        assert r.status_code == 400
        assert "detail" in r.json()

    def test_no_token(self, api_client):
        r = requests.post(f"{BASE_URL}/api/auth/change-password",
                          json={"current_password": "a", "new_password": "b"}, timeout=30)
        assert r.status_code == 401

    def test_short_new_password_rejected(self, api_client, auth_headers, test_credentials):
        r = api_client.post(f"{BASE_URL}/api/auth/change-password", headers=auth_headers,
                            json={"current_password": test_credentials["password"], "new_password": "short"}, timeout=30)
        assert r.status_code == 400

    def test_change_and_revert(self, api_client, auth_headers, test_credentials):
        temp = "TempQAPass2026!"
        r = api_client.post(f"{BASE_URL}/api/auth/change-password", headers=auth_headers,
                            json={"current_password": test_credentials["password"], "new_password": temp}, timeout=30)
        assert r.status_code == 200, r.text
        try:
            lr = requests.post(f"{BASE_URL}/api/auth/login",
                               json={"email": test_credentials["email"], "password": temp}, timeout=30)
            assert lr.status_code == 200, "cannot login with new password"
            new_headers = {"Authorization": f"Bearer {lr.json()['access_token']}"}
        finally:
            rr = api_client.post(f"{BASE_URL}/api/auth/change-password",
                                 headers=locals().get("new_headers", auth_headers),
                                 json={"current_password": temp, "new_password": test_credentials["password"]}, timeout=30)
            assert rr.status_code == 200, f"REVERT FAILED: {rr.text}"
        back = requests.post(f"{BASE_URL}/api/auth/login", json=test_credentials, timeout=30)
        assert back.status_code == 200, "original password not restored"


# ---------- Content ----------
class TestContent:
    def test_get_content_public(self, api_client):
        r = requests.get(f"{BASE_URL}/api/content", timeout=30)
        assert r.status_code == 200
        d = r.json()
        keys = [s["key"] for s in d["services"]]
        assert keys == SERVICE_KEYS, keys
        for s in d["services"]:
            assert s["description_en"] and s["description_id"]
            assert isinstance(s["customers"], list) and len(s["customers"]) > 0
            assert isinstance(s["gallery"], list) and len(s["gallery"]) > 0
            assert "_id" not in s
        assert d["settings"].get("nib_image_url")
        assert "_id" not in d["settings"]


class TestServiceUpdate:
    def test_update_requires_auth(self, api_client):
        r = requests.put(f"{BASE_URL}/api/services/catering", json={"description_id": "x"}, timeout=30)
        assert r.status_code == 401

    def test_update_unknown_key_404(self, api_client, auth_headers):
        r = api_client.put(f"{BASE_URL}/api/services/does-not-exist", headers=auth_headers,
                           json={"description_id": "TEST_x"}, timeout=30)
        assert r.status_code == 404

    def test_update_empty_body_400(self, api_client, auth_headers):
        r = api_client.put(f"{BASE_URL}/api/services/catering", headers=auth_headers, json={}, timeout=30)
        assert r.status_code == 400

    def test_update_and_revert(self, api_client, auth_headers):
        orig = requests.get(f"{BASE_URL}/api/content", timeout=30).json()
        svc = next(s for s in orig["services"] if s["key"] == "hvac")
        payload = {
            "description_id": "TEST_deskripsi ID",
            "description_en": "TEST_description EN",
            "customers": ["TEST_customer A", "TEST_customer B"],
            "gallery": svc["gallery"] + [{"url": "https://example.com/test.png", "caption_id": "TEST cap ID", "caption_en": "TEST cap EN"}],
        }
        try:
            r = api_client.put(f"{BASE_URL}/api/services/hvac", headers=auth_headers, json=payload, timeout=30)
            assert r.status_code == 200, r.text
            d = r.json()
            assert d["description_id"] == payload["description_id"]
            assert d["customers"] == payload["customers"]
            assert "_id" not in d
            # verify persistence via public GET
            after = requests.get(f"{BASE_URL}/api/content", timeout=30).json()
            svc2 = next(s for s in after["services"] if s["key"] == "hvac")
            assert svc2["description_en"] == payload["description_en"]
            assert svc2["gallery"] == payload["gallery"]
        finally:
            rev = api_client.put(f"{BASE_URL}/api/services/hvac", headers=auth_headers, json={
                "description_en": svc["description_en"],
                "description_id": svc["description_id"],
                "customers": svc["customers"],
                "gallery": svc["gallery"],
            }, timeout=30)
            assert rev.status_code == 200, f"REVERT FAILED {rev.text}"


class TestSettings:
    def test_requires_auth(self):
        r = requests.put(f"{BASE_URL}/api/settings", json={"nib_image_url": "/x.png"}, timeout=30)
        assert r.status_code == 401

    def test_update_and_revert(self, api_client, auth_headers):
        orig = requests.get(f"{BASE_URL}/api/content", timeout=30).json()["settings"]["nib_image_url"]
        try:
            r = api_client.put(f"{BASE_URL}/api/settings", headers=auth_headers,
                               json={"nib_image_url": "/images/TEST_nib.png"}, timeout=30)
            assert r.status_code == 200
            assert r.json()["nib_image_url"] == "/images/TEST_nib.png"
            check = requests.get(f"{BASE_URL}/api/content", timeout=30).json()
            assert check["settings"]["nib_image_url"] == "/images/TEST_nib.png"
        finally:
            rev = api_client.put(f"{BASE_URL}/api/settings", headers=auth_headers,
                                 json={"nib_image_url": orig}, timeout=30)
            assert rev.status_code == 200
            assert rev.json()["nib_image_url"] == orig


# ---------- Upload / files ----------
def _png_bytes():
    from PIL import Image
    buf = io.BytesIO()
    Image.new("RGB", (40, 40), (10, 120, 200)).save(buf, format="PNG")
    return buf.getvalue()


class TestUpload:
    uploaded_id = None

    def test_upload_requires_auth(self):
        r = requests.post(f"{BASE_URL}/api/upload",
                          files={"file": ("TEST_a.png", _png_bytes(), "image/png")}, timeout=60)
        assert r.status_code == 401

    def test_upload_non_image_rejected(self, api_client, auth_headers):
        r = api_client.post(f"{BASE_URL}/api/upload", headers=auth_headers,
                            files={"file": ("TEST_a.txt", b"hello world", "text/plain")}, timeout=60)
        assert r.status_code == 400

    def test_upload_png_and_serve(self, api_client, auth_headers):
        data = _png_bytes()
        r = api_client.post(f"{BASE_URL}/api/upload", headers=auth_headers,
                            files={"file": ("TEST_qa.png", data, "image/png")}, timeout=120)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["url"] == f"/api/files/{d['id']}"
        TestUpload.uploaded_id = d["id"]
        g = requests.get(f"{BASE_URL}{d['url']}", timeout=60)
        assert g.status_code == 200, g.text
        assert g.headers["content-type"].startswith("image/png")
        assert len(g.content) == len(data)

    def test_serve_unknown_file_404(self):
        r = requests.get(f"{BASE_URL}/api/files/{uuid.uuid4()}", timeout=30)
        assert r.status_code == 404
