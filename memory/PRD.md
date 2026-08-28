# PRD — Landing Page PT Nusa Pratama Solution

## Problem Statement (asli)
"buatkan landing page persis seperti file terlampir, menggunakan custom domain yang ada dilampiran" — Clone pixel-perfect dari PDF "landing Page NP.pdf" (9 halaman company profile PT Nusa Pratama Solution).
Bahasa user: **Indonesia** — selalu balas dalam Bahasa Indonesia.

## Yang Sudah Diimplementasikan

### Fase 1 (28 Jun 2026) — Landing page statis
- Aset asli diekstrak dari PDF via pymupdf → `/app/frontend/public/images/`
- Semua section sesuai PDF: Hero, Introduction+Legal, Vision & Mission, Our Services, Our Value, Standard Food Process, General Supply, Logistic, Contact, Footer
- Font Poppins, oranye #F5A742, navbar sticky, smooth scroll

### Fase 2 (28 Jun 2026) — Interaktif + Admin CMS (semua diverifikasi testing agent, 26/26 backend pass, frontend 100%)
- **Tombol WhatsApp** mengambang → wa.me/6282253706473 (`WhatsAppButton.jsx`)
- **Toggle EN/ID** (default ID, tersimpan di localStorage `np_lang`) — `LanguageContext.jsx` berisi semua terjemahan
- **Icon Our Services klik-able** → modal detail (deskripsi per bahasa, galeri foto dokumentasi, daftar pelanggan) — data dari DB via GET /api/content
- **Admin CMS** (JWT auth, Bearer token di localStorage `np_token`):
  - /admin/login → /admin dashboard
  - Edit deskripsi ID/EN, pelanggan, galeri (upload/hapus foto) per service
  - Ganti gambar NIB, ganti password admin
  - Upload gambar via **Emergent Object Storage** (POST /api/upload → GET /api/files/{id})
- Brute force lockout (5 gagal/15 mnt, IP dari X-Forwarded-For, TTL index), seed idempotent (password admin ikut .env)
- Galeri seed: 8 foto ilustrasi hasil generate (admin bisa ganti)

### Fase 3 (28 Jun 2026) — Caption galeri + email admin baru
- Galeri dokumentasi kini berformat `{url, caption_id, caption_en}` — keterangan tampil di bawah foto pada modal (mengikuti bahasa aktif), dapat diedit di panel admin (input ID & EN per foto)
- Migrasi otomatis galeri lama (string → objek) di seed()
- Email admin diganti ke **admin@samaexpress.info** (seed memperbarui akun admin lama secara otomatis dari .env)
- Diverifikasi: pytest 26/26 pass + screenshot modal & panel admin

### Fase 4 (28 Jun 2026) — Hero sesuai PDF (bug fix user)
- Hero dirombak persis PDF hal. 1: logo mark besar + bayangan abu di kiri, teks NUSA/PRATAMA/SOLUTION bertumpuk 3 baris di kanan, "PROFIL PERUSAHAAN/COMPANY PROFILE" di bawah tengah
- Fix hasil testing agent (iteration_2): tagline tidak center (animasi CSS menimpa transform Tailwind → pakai left-0 right-0 text-center) + overflow 7px mobile (email panjang di Contact → break-all). Verifikasi: tagline center 960/960, overflow mobile 0px
- CATATAN: kelas .animate-fade-up* memakai animation-fill-mode both dengan transform — jangan digabung dengan utilitas translate/scale Tailwind di elemen yang sama

## Arsitektur
- Backend: FastAPI (`/app/backend/server.py`) — koleksi Mongo: users, services, settings, files, login_attempts
- Frontend: React — pages: Landing, AdminLogin, AdminDashboard; context: LanguageContext, AuthContext
- Kredensial admin: lihat `/app/memory/test_credentials.md`
- Regression suite: `cd /app/backend && python -m pytest tests/backend_test.py` (26 pass)

## Catatan Custom Domain
PDF tidak memuat nama domain. Pasang via Deploy → Settings → Custom Domain setelah deploy.

## Backlog
- P1: Hubungkan custom domain saat deploy (butuh nama domain dari user)
- P2: Form kontak fungsional (simpan ke Mongo / kirim email)
- P2: Galeri katering di landing page utama
- P3: Invalidasi JWT lama setelah ganti password (token version)
