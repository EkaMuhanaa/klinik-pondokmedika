# Panduan Deploy ke Hostinger (Web/Cloud Hosting)

Susunan yang dipakai:

| Bagian | Domain (contoh) | Isi folder di server |
|---|---|---|
| Frontend (React) | `domain-anda.com` | hasil build `frontend/dist/` |
| Backend (Laravel API) | `api.domain-anda.com` | `backend/public/` |

Ganti `domain-anda.com` dengan domain klinik yang sebenarnya.

---

## 1. Persiapan di hPanel

1. **Versi PHP**: hPanel → Advanced → PHP Configuration → pilih **PHP 8.3** (minimal 8.2).
2. **Batas upload**: di PHP Configuration → PHP options, set `upload_max_filesize` dan `post_max_size` minimal **8M** (gambar slider boleh sampai 5 MB).
3. **Database**: hPanel → Databases → MySQL Databases → buat database + user. Catat nama database, username, dan password.
4. **Subdomain**: hPanel → Domains → Subdomains → buat `api`.
5. **SSH**: hPanel → Advanced → SSH Access → aktifkan, catat host, port, dan username.
6. **SSL**: hPanel → Security → SSL → pastikan SSL aktif untuk `domain-anda.com` **dan** `api.domain-anda.com`.

## 2. Deploy Backend (Laravel)

Masuk lewat SSH, lalu simpan kode **di luar** folder publik:

```bash
cd ~
git clone https://github.com/EkaMuhanaa/klinik-pondokmedika.git
cd klinik-pondokmedika/backend
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
```

Edit `backend/.env` (`nano .env`) dan ubah nilai berikut:

```dotenv
APP_NAME="Klinik Pondok Medika"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.domain-anda.com
APP_LOCALE=id

CORS_ALLOWED_ORIGINS=https://domain-anda.com,https://www.domain-anda.com
SANCTUM_EXPIRATION=720

LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u123456789_klinik
DB_USERNAME=u123456789_klinik
DB_PASSWORD=password-database-anda

QUEUE_CONNECTION=sync
```

Lalu jalankan:

```bash
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

### Arahkan subdomain `api` ke folder `public`

Folder web subdomain `api` harus menampilkan isi `backend/public/`, **bukan** seluruh folder `backend/`.
Cek path folder subdomain di hPanel (biasanya `~/domains/domain-anda.com/public_html/api`
atau `~/domains/api.domain-anda.com/public_html`), lalu ganti dengan symlink:

```bash
# sesuaikan API_DIR dengan path folder subdomain api di akun Anda
API_DIR=~/domains/domain-anda.com/public_html/api
rm -rf "$API_DIR"
ln -s ~/klinik-pondokmedika/backend/public "$API_DIR"
```

> Jika symlink tidak bisa dipakai, salin seluruh isi `backend/` ke folder subdomain.
> File `backend/.htaccess` akan meneruskan semua request ke `public/` sehingga `.env`
> dan folder lain tetap tidak bisa diakses dari browser. Setelah itu jalankan
> perintah artisan di atas dari folder tersebut.

**Cek:** buka `https://api.domain-anda.com/up` (harus tampil halaman sehat) dan
`https://api.domain-anda.com/api/facilities` (harus tampil `[]` atau data JSON).
Pastikan `https://api.domain-anda.com/.env` **tidak** bisa dibuka (harus 403/404).

### Buat akun admin

Jangan jalankan `db:seed` di production (seeder bawaan membuat akun uji). Buat admin lewat tinker:

```bash
php artisan tinker
>>> \App\Models\User::create(['name' => 'Admin', 'email' => 'admin@domain-anda.com', 'password' => 'GANTI-password-kuat']);
>>> exit
```

## 3. Deploy Frontend (React)

Hostinger Web Hosting tidak perlu menjalankan Node.js; cukup unggah hasil build.
Build di komputer Anda:

```bash
cd frontend
cp .env.example .env
# ubah isi .env menjadi: VITE_API_BASE_URL=https://api.domain-anda.com
npm ci
npm run build
```

Unggah **isi** folder `frontend/dist/` (bukan foldernya) ke `public_html` domain utama,
lewat hPanel → File Manager atau FTP. Pastikan file `.htaccess` ikut terunggah
(file ini tersembunyi; aktifkan "show hidden files" di File Manager/FTP client).
`.htaccess` ini membuat route seperti `/artikel/judul-artikel` dan `/admin` tidak 404 saat di-refresh.

> `VITE_API_BASE_URL` ditanam ke hasil build. Jika URL backend berubah, build ulang lalu unggah lagi.

**Cek:** buka `https://domain-anda.com`, buka halaman artikel lalu refresh (tidak boleh 404),
dan login di `https://domain-anda.com/admin/login`.

## 4. Update Berikutnya

Backend (lewat SSH):

```bash
cd ~/klinik-pondokmedika
git pull
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
```

Frontend: `npm run build` di komputer Anda, lalu unggah ulang isi `frontend/dist/`.

## 5. Backup

Gambar yang diunggah admin tersimpan di `backend/storage/app/public/`, dan data di database MySQL.
Keduanya **tidak** ada di Git, jadi pastikan backup Hostinger aktif (hPanel → Files → Backups)
atau unduh berkala.

## Masalah Umum

| Gejala | Penyebab & solusi |
|---|---|
| Gambar tidak muncul (404 di `/storage/...`) | `php artisan storage:link` belum dijalankan. |
| Frontend error CORS di console browser | `CORS_ALLOWED_ORIGINS` belum berisi domain frontend (termasuk versi `www`). Setelah mengubah `.env`, jalankan `php artisan config:cache`. |
| Request API ke `undefined/api/...` | `VITE_API_BASE_URL` kosong saat build. Isi `.env` frontend lalu build ulang. |
| Upload gambar gagal (413 / error validasi) | Naikkan `upload_max_filesize` dan `post_max_size` di PHP Configuration. |
| Perubahan `.env` tidak berpengaruh | Jalankan `php artisan config:cache` lagi. |
| Error 500 | Lihat `backend/storage/logs/laravel.log`. |
