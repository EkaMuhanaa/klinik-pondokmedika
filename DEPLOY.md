# Panduan Deploy ke Hostinger (Web/Cloud Hosting)

Susunan yang dipakai:

| Bagian | Domain | Isi folder di server |
|---|---|---|
| Frontend (React) | `klinikpondokmedika.id` | hasil build `frontend/dist/` |
| Backend (Laravel API) | `api.klinikpondokmedika.id` | `backend/public/` |


---

## 1. Persiapan di hPanel

1. **Versi PHP**: hPanel → Advanced → PHP Configuration → pilih **PHP 8.3** (minimal 8.2).
2. **Batas upload**: di PHP Configuration → PHP options, set `upload_max_filesize` dan `post_max_size` minimal **8M** (gambar slider boleh sampai 5 MB).
3. **Database**: hPanel → Databases → MySQL Databases → buat database + user. Catat nama database, username, dan password.
4. **Subdomain**: hPanel → Domains → Subdomains → buat `api` untuk `klinikpondokmedika.id`, **tanpa** mencentang "Custom folder untuk subdomain".
5. **SSH**: hPanel → Advanced → SSH Access → aktifkan, catat host, port, dan username.
6. **SSL**: hPanel → Security → SSL → pastikan SSL aktif untuk `klinikpondokmedika.id` **dan** `api.klinikpondokmedika.id`.

## 2. Deploy Backend (Laravel)

### Cara cepat: script otomatis

Masuk lewat SSH, lalu jalankan:

```bash
cd ~
git clone https://github.com/EkaMuhanaa/klinik-pondokmedika.git
cd klinik-pondokmedika
bash scripts/hostinger-setup.sh
```

Script akan menanyakan nama database, user database, password database, serta email
dan password admin. Password diketik tersembunyi. Untuk pertanyaan domain cukup tekan Enter.
Script lalu menjalankan semua langkah di bawah (install, `.env`, migrate, `storage:link`,
akun admin, cache). Setelah selesai, tinggal lanjut ke bagian
[Arahkan subdomain `api` ke folder `public`](#arahkan-subdomain-api-ke-folder-public).

> Jika repo GitHub bersifat private, `git clone` akan meminta login. Gunakan username GitHub
> dan Personal Access Token (bukan password), atau unggah kode lewat File Manager.

### Cara manual


Masuk lewat SSH, lalu simpan kode **di luar** folder publik:

```bash
cd ~
git clone https://github.com/EkaMuhanaa/klinik-pondokmedika.git
cd klinik-pondokmedika/backend
composer install --no-dev --optimize-autoloader --no-scripts
php artisan package:discover
cp .env.example .env
php artisan key:generate
```

Edit `backend/.env` (`nano .env`) dan ubah nilai berikut:

```dotenv
APP_NAME="Klinik Pondok Medika"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.klinikpondokmedika.id
APP_LOCALE=id

CORS_ALLOWED_ORIGINS=https://klinikpondokmedika.id,https://www.klinikpondokmedika.id
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
Cek path folder subdomain di hPanel (biasanya `~/domains/klinikpondokmedika.id/public_html/api`
atau `~/domains/api.klinikpondokmedika.id/public_html`), lalu ganti dengan symlink:

```bash
# cek dulu path folder subdomain api di hPanel; folder ini akan DIHAPUS dan diganti symlink
API_DIR=~/domains/klinikpondokmedika.id/public_html/api
rm -rf "$API_DIR"
ln -s ~/klinik-pondokmedika/backend/public "$API_DIR"
```

> Jika symlink tidak bisa dipakai, salin seluruh isi `backend/` ke folder subdomain.
> File `backend/.htaccess` akan meneruskan semua request ke `public/` sehingga `.env`
> dan folder lain tetap tidak bisa diakses dari browser. Setelah itu jalankan
> perintah artisan di atas dari folder tersebut.

**Cek:** buka `https://api.klinikpondokmedika.id/up` (harus tampil halaman sehat) dan
`https://api.klinikpondokmedika.id/api/facilities` (harus tampil `[]` atau data JSON).
Pastikan `https://api.klinikpondokmedika.id/.env` **tidak** bisa dibuka (harus 403/404).

### Buat akun admin

Jangan jalankan `db:seed` di production (seeder bawaan membuat akun uji). Buat admin dengan:

```bash
php artisan admin:create admin@klinikpondokmedika.id
```

Password akan ditanyakan secara tersembunyi.

## 3. Deploy Lewat SSH (tanpa File Manager, tanpa npm di server)

Hosting tidak menyediakan npm, jadi frontend **dibangun di GitHub** dan **dipasang lewat SSH**:

1. Setiap ada perubahan di branch `main`, workflow **Build frontend** (`.github/workflows/build-frontend.yml`)
   membangun frontend dan menyimpan hasilnya di GitHub Release **`frontend-latest`**.
   Workflow ini **tidak** masuk ke server dan tidak butuh kunci SSH.
2. Anda menjalankan deploy kapan pun siap, dengan satu perintah di server:

```bash
bash ~/klinik-pondokmedika/scripts/deploy.sh
```

`scripts/deploy.sh` akan:
- mengambil kode terbaru dari `main` (repo di server dipaksa sama persis dengan GitHub);
- memperbarui backend: dependensi, migrasi database, cache (`scripts/server-update-backend.sh`);
- mengunduh hasil build frontend dan **mengecek versinya sama** dengan kode backend;
- memasang frontend ke `public_html` tanpa menyentuh symlink `api`, dan membuatnya ulang jika hilang
  (`scripts/server-publish-frontend.sh`).

`.env`, `vendor/`, database, dan gambar upload tidak terpengaruh.

### 3.1 Pertama kali

Script `deploy.sh` baru ada setelah kode terbaru ditarik, jadi untuk pertama kali jalankan:

```bash
cd ~/klinik-pondokmedika && git checkout main && git pull && bash scripts/deploy.sh
```

### 3.2 Pesan yang mungkin muncul

| Pesan | Artinya |
|---|---|
| `Versi frontend (...) belum sama dengan kode backend` | Build di GitHub masih berjalan. Tunggu 2–3 menit (cek tab **Actions → Build frontend**), lalu jalankan ulang. Backend sudah diperbarui. |
| `Gagal mengunduh hasil build frontend` | Workflow **Build frontend** belum pernah selesai atau gagal. Buka tab **Actions**, jalankan **Run workflow** jika perlu, tunggu centang hijau. |
| `Deploy selesai: abc1234` | Berhasil. Buka website untuk mengecek. |

Opsi: `--skip-frontend` (hanya backend), `--force` (pasang frontend walau versinya berbeda, untuk darurat).

### 3.3 Alamat API

Frontend memakai `https://klinikpondokmedika.id/api` (lewat symlink `api` di `public_html`), sehingga tidak
bergantung pada DNS subdomain `api`. Untuk mengubahnya, isi variabel `VITE_API_BASE_URL` di GitHub
(Settings → Secrets and variables → Actions → **Variables**), lalu jalankan ulang **Build frontend**.

### 3.4 Cara cadangan (build di komputer sendiri)

Jika GitHub Actions tidak bisa dipakai, dari komputer yang punya Node.js:

```bash
cd frontend && npm ci && VITE_API_BASE_URL=https://klinikpondokmedika.id/api npm run build && tar -czf ../frontend-release.tar.gz -C dist . && cd ..
```

```bash
scp -P 65002 frontend-release.tar.gz USER_SSH@IP_SERVER:frontend-release.tar.gz
```

Lalu di server:

```bash
bash ~/klinik-pondokmedika/scripts/deploy.sh --skip-frontend && bash ~/klinik-pondokmedika/scripts/server-publish-frontend.sh ~/frontend-release.tar.gz
```

**Cek setelah deploy:** buka `https://klinikpondokmedika.id`, halaman artikel lalu refresh (tidak boleh 404),
`https://klinikpondokmedika.id/sitemap.xml`, dan login di `https://klinikpondokmedika.id/admin/login`.

## 4. Update Berikutnya

1. Merge perubahan ke `main` di GitHub.
2. Tunggu **Actions → Build frontend** centang hijau (±2–3 menit).
3. Di server: `bash ~/klinik-pondokmedika/scripts/deploy.sh`

Perubahan isi website (artikel, layanan, dokter, promo, alamat) dilakukan admin di CMS dan **langsung tampil**
tanpa deploy. Satu pengecualian: judul/deskripsi untuk Google ditulis saat build. Setelah mengubah
Pengaturan Klinik atau daftar layanan, jalankan **Actions → Build frontend → Run workflow**, tunggu selesai,
lalu `bash ~/klinik-pondokmedika/scripts/deploy.sh` agar Google ikut melihat data terbaru.

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
| CMS/artikel/promo tidak muncul, `/api/up` 404 | Symlink `api` di `public_html` hilang (biasanya setelah mengubah file lewat File Manager). Jalankan `bash ~/klinik-pondokmedika/scripts/deploy.sh`; script akan membuatnya kembali. |
| Error 500 | Lihat `backend/storage/logs/laravel.log`. |
| `The Process class relies on proc_open` saat `composer install` | Hostinger mematikan `proc_open`. Pakai `composer install --no-scripts` lalu `php artisan package:discover`. |
