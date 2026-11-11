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

## 3. Deploy Otomatis dengan GitHub Actions (tanpa File Manager)

Setelah disiapkan **sekali**, setiap perubahan yang masuk ke branch `main` (misalnya PR yang di-merge)
otomatis di-deploy ke Hostinger oleh workflow `.github/workflows/deploy.yml`:

1. backend: ambil kode terbaru, `composer install`, migrasi database, cache (`scripts/server-update-backend.sh`);
2. frontend: build di server GitHub, dikirim lewat SSH, dipasang ke `public_html` tanpa menyentuh symlink `api`
   (`scripts/server-publish-frontend.sh`);
3. cek otomatis: Beranda, `/api/up`, API layanan, dan `sitemap.xml` harus merespons 200.

Tidak perlu Node.js di komputer Anda dan tidak perlu File Manager.

### 3.1 Buat kunci SSH khusus deploy (sekali, lewat SSH ke Hostinger)

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy
```

Perintah terakhir menampilkan **kunci privat** (diawali `-----BEGIN OPENSSH PRIVATE KEY-----`).
Salin seluruh isinya untuk langkah 3.2, lalu jangan dibagikan ke siapa pun.

> Jika Hostinger menolak kunci dari `authorized_keys`, tambahkan isi `~/.ssh/github_deploy.pub`
> lewat hPanel → Advanced → SSH Access → **SSH Keys** → Add SSH key.

### 3.2 Isi Secrets di GitHub (sekali)

Buka repo di GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Nama secret | Isi |
|---|---|
| `SSH_HOST` | IP server dari hPanel → SSH Access (mis. `IP_SERVER`) |
| `SSH_PORT` | `65002` |
| `SSH_USER` | username SSH (mis. `USER_SSH`) |
| `SSH_PRIVATE_KEY` | seluruh isi kunci privat dari langkah 3.1 |

Opsional di tab **Variables** (bukan Secrets): `SITE_URL` (default `https://klinikpondokmedika.id`) dan
`VITE_API_BASE_URL` (default `https://klinikpondokmedika.id/api`).

### 3.3 Jalankan deploy pertama

GitHub → tab **Actions** → **Deploy ke Hostinger** → **Run workflow** → pilih `main` → **Run workflow**.
Tunggu sampai centang hijau (±3–5 menit). Jika merah, klik job-nya untuk melihat langkah yang gagal;
pesan error sudah menyebutkan secret mana yang belum diisi.

> Repo di server dipaksa sama persis dengan `main` (`git reset --hard`). Jangan mengedit file kode
> langsung di server; `.env`, `vendor/`, dan gambar upload tidak terpengaruh.

### 3.4 Alamat API

Selama DNS `api.klinikpondokmedika.id` belum aktif, frontend memakai `https://klinikpondokmedika.id/api`
(lewat symlink `api` di `public_html`). Setelah subdomain aktif, URL ini tetap boleh dipakai.

### 3.5 Cara manual tanpa File Manager (cadangan)

Jika GitHub Actions tidak bisa dipakai, dari komputer yang punya Node.js dan SSH:

```bash
cd frontend && npm ci && VITE_API_BASE_URL=https://klinikpondokmedika.id/api npm run build && tar -czf ../frontend-release.tar.gz -C dist . && cd ..
```

```bash
scp -P 65002 frontend-release.tar.gz USER_SSH@IP_SERVER:frontend-release.tar.gz
```

```bash
ssh -p 65002 USER_SSH@IP_SERVER 'bash ~/klinik-pondokmedika/scripts/server-update-backend.sh && bash ~/klinik-pondokmedika/scripts/server-publish-frontend.sh ~/frontend-release.tar.gz'
```

**Cek:** buka `https://klinikpondokmedika.id`, halaman artikel lalu refresh (tidak boleh 404),
`https://klinikpondokmedika.id/sitemap.xml`, dan login di `https://klinikpondokmedika.id/admin/login`.

## 4. Update Berikutnya

Cukup merge perubahan ke `main`; deploy berjalan otomatis (lihat tab **Actions**).

Perubahan isi website (artikel, layanan, dokter, promo, alamat) dilakukan admin di CMS dan **langsung tampil**
tanpa deploy. Satu pengecualian: judul/deskripsi untuk Google yang ditulis saat build. Setelah mengubah
Pengaturan Klinik atau daftar layanan, jalankan **Actions → Deploy ke Hostinger → Run workflow** sekali
agar Google ikut melihat data terbaru.

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
| CMS/artikel/promo tidak muncul, `/api/up` 404 | Symlink `api` di `public_html` hilang (biasanya setelah mengubah file lewat File Manager). Jalankan ulang deploy (Actions → Run workflow); script akan membuatnya kembali. |
| Deploy GitHub Actions gagal di langkah "Siapkan kunci SSH" | Secret `SSH_PRIVATE_KEY` salah salin (harus termasuk baris BEGIN/END) atau kunci publik belum ada di `authorized_keys` (bagian 3.1). |
| Error 500 | Lihat `backend/storage/logs/laravel.log`. |
| `The Process class relies on proc_open` saat `composer install` | Hostinger mematikan `proc_open`. Pakai `composer install --no-scripts` lalu `php artisan package:discover`. |
