# Klinik Pondok Medika

Sistem Web & Backend API untuk Klinik Pondok Medika.

## Struktur Direktori

- `frontend/` : Aplikasi web frontend menggunakan React + Vite & Tailwind CSS.
- `backend/`  : Backend REST API menggunakan Laravel & Sanctum authentication.
- `DESIGN.md` : Dokumentasi desain dan arsitektur UI/UX.
- `DEPLOY.md` : Panduan deploy ke Hostinger.

---

## Panduan Instalasi & Menjalankan

### 1. Frontend (React + Vite)
```bash
cd frontend
npm install
cp .env.example .env   # isi VITE_API_BASE_URL dengan URL backend
npm run dev
```

### 2. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Konfigurasi Environment Production

Langkah deploy lengkap ke Hostinger ada di [DEPLOY.md](DEPLOY.md).

**Frontend** (`frontend/.env`, diisi sebelum `npm run build`):
- `VITE_API_BASE_URL` — URL backend, tanpa `/api` dan tanpa garis miring di akhir. Wajib diisi saat build.

**Backend** (`backend/.env`):
- `CORS_ALLOWED_ORIGINS` — domain frontend yang boleh mengakses API, dipisah koma (mis. `https://pondokmedika.com,https://www.pondokmedika.com`).
- `SANCTUM_EXPIRATION` — masa berlaku token login admin dalam menit (default 720 = 12 jam).
- Login admin dibatasi 5 percobaan per menit per IP.
