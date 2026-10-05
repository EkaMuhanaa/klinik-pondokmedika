# Klinik Pondok Medika

Sistem Web & Backend API untuk Klinik Pondok Medika.

## Struktur Direktori

- `frontend/` : Aplikasi web frontend menggunakan React + Vite & Tailwind CSS.
- `backend/`  : Backend REST API menggunakan Laravel & Sanctum authentication.
- `DESIGN.md` : Dokumentasi desain dan arsitektur UI/UX.

---

## Panduan Instalasi & Menjalankan

### 1. Frontend (React + Vite)
```bash
cd frontend
npm install
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
