# PRD — Landing Page PT Nusa Pratama Solution

## Problem Statement (asli)
"buatkan landing page persis seperti file terlampir, menggunakan custom domain yang ada dilampiran" — Clone pixel-perfect dari PDF "landing Page NP.pdf" (9 halaman company profile PT Nusa Pratama Solution).
Bahasa user: **Indonesia** — selalu balas dalam Bahasa Indonesia.

## Yang Sudah Diimplementasikan (28 Jun 2026)
Frontend-only landing page (tidak butuh backend/DB):
- Aset asli diekstrak langsung dari PDF via pymupdf (dengan smask/transparansi) → `/app/frontend/public/images/` (logo_full, logo_mark, legal_akta, legal_nib, vision_team, building_bg, hvac_logo, value_1..4, food_trays, warehouse, boxes_bg, qr_code)
- Komponen: `src/components/landing/` (Navbar, HeroIntro, ServicesValues, ProcessSupply, LogisticContact), halaman `src/pages/Landing.jsx`
- Section (urut sesuai PDF): Hero logo + COMPANY PROFILE → Introduction + dokumen legal (Akta & NIB) + pita "LEGAL" → Vision & Mission → Our Services (Catering, General Supply, Logistics, HVAC) → Our Value (4 kartu bernomor, urutan gambar sudah dikoreksi) → Standard Food Process → General Supply (bg gudang) → Logistic (4 langkah) → Contact Us (alamat Balikpapan, email, telp, QR) → Footer
- Font Poppins, warna oranye #F5A742, smooth scroll, navbar sticky + mobile menu, animasi fade-up hero
- Diverifikasi via screenshot semua section (desktop 1920px) — sesuai desain PDF

## Catatan Custom Domain
PDF tidak memuat nama domain eksplisit (hanya email gmail). Custom domain dipasang lewat fitur Deploy Emergent → Settings → Custom Domain setelah user deploy & menyediakan domainnya (mis. nusapratamasolution.com).

## Backlog
- P1: Hubungkan custom domain saat deploy (butuh konfirmasi nama domain dari user)
- P2: Form kontak fungsional (backend + simpan ke MongoDB / kirim email)
- P2: Versi Bahasa Indonesia / toggle EN-ID untuk konten
- P2: Tombol WhatsApp langsung ke +62 8225 370 6473
