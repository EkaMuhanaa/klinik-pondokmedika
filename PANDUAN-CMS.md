# Panduan CMS Klinik Pondok Medika

Panduan untuk admin klinik yang mengelola isi website.

**Alamat login:** https://klinikpondokmedika.id/admin/login

Semua perubahan di CMS **langsung tampil** di website setelah disimpan. Di HP, buka menu admin lewat tombol ☰ di kiri atas.

> **Prinsip penting:** tulis hanya informasi yang benar dan bisa dibuktikan, misalnya jam buka, layanan, gelar dokter, dan akreditasi. Informasi yang tidak sesuai kenyataan bisa merugikan pasien dan menurunkan kepercayaan Google.

---

## Menu CMS

### Artikel & Edukasi
Tulis artikel kesehatan atau pengumuman. Centang **Terbitkan** agar tampil di website.

Artikel rutin dengan topik lokal (misalnya "imunisasi anak di Cengkareng") membantu klinik muncul di pencarian Google.

### Kelola Latar / Slider
Foto besar di bagian atas setiap halaman, maksimal 4 per halaman. Pakai foto asli klinik dengan ukuran lebar (landscape), minimal 1600 px.

### Kelola Fasilitas
Foto dan nama ruangan atau sarana klinik (ruang tunggu, ruang periksa, dan sebagainya).

### Kelola Layanan
Isi halaman setiap layanan dan daftar layanan di Beranda.
- **Ringkasan:** 1–2 kalimat yang tampil di kartu layanan dan di hasil pencarian Google.
- **Isi halaman:** latar belakang, penjelasan, kondisi pasien, tahapan (satu tahap per baris), dan lokasi ruangan. Bagian yang dikosongkan tidak ditampilkan.
- **Punya halaman sendiri:** layanan muncul di menu Layanan, footer, dan Google.
- **Tampil di Beranda:** layanan masuk bagian "Layanan Unggulan" di Beranda.
- **Tonjolkan:** layanan tampil paling besar. Hanya satu layanan yang bisa ditonjolkan.
- **Urutan:** angka kecil tampil lebih dulu. Kosongkan agar layanan baru diletakkan di urutan terakhir.

> Hati-hati mengubah **Alamat Halaman** layanan yang sudah lama tayang, karena link lama di Google akan menjadi tidak ditemukan.

### Kelola Dokter
Foto, nama dan gelar, spesialisasi, deskripsi, dan jadwal praktik.
- **Foto:** potret 4:5 dengan latar polos yang **seragam untuk semua dokter**, maksimal 2 MB.
- **Jadwal:** centang hari praktik, lalu isi jam mulai dan selesai. Status "Aktif Praktik" di website dihitung otomatis dari jadwal ini (WIB).
- **Dokter cuti panjang:** hapus centang **Tampilkan di website**, tidak perlu dihapus.

### Pop-Up Promo
Promo yang muncul sekali per kunjungan, beberapa detik setelah halaman dibuka.
- **Jadwal tayang:** atur Mulai dan Selesai Tayang, maka promo tampil dan berhenti sendiri.
- **Link tombol:** bisa ke WhatsApp (`https://wa.me/62...`) atau halaman website (`/layanan/poli-gigi-mulut`).
- **Satu promo saja:** jika ada beberapa promo aktif, yang tampil adalah promo yang terakhir diubah.

### Pengaturan Klinik
Data klinik yang dipakai di seluruh website dan oleh Google.
- **Alamat, telepon, jam buka:** harus **sama persis** dengan profil Google Maps (Google Business Profile) klinik.
- **Wilayah layanan:** kelurahan dan kecamatan sekitar klinik, dipisah koma.
- **Media sosial:** isi link yang ada saja. Yang dikosongkan tidak ditampilkan.
- **Konten Beranda & Tentang Kami:**
  - judul bagian dokter;
  - daftar Rekan Medis (satu nama per baris);
  - sorotan di halaman Tentang Kami, dengan format `Judul | Keterangan` per baris. Contoh: `Terakreditasi Paripurna | KARS 2025`.

---

## Setelah mengubah Pengaturan Klinik atau Layanan

Tampilan website langsung berubah. Supaya **Google** juga membaca data terbaru (judul halaman, alamat di hasil pencarian), minta pengelola teknis menjalankan deploy sekali. Caranya: GitHub → **Actions** → **Deploy ke Hostinger** → **Run workflow** (lihat `DEPLOY.md` bagian 4).

## Tips agar klinik mudah ditemukan di Google

1. **Google Business Profile:** lengkapi profil klinik di Google Maps dengan foto, jam buka, dan kategori "Klinik". Pastikan alamat dan nomornya sama dengan website.
2. **Ulasan pasien:** minta pasien memberi ulasan di Google Maps, dan balas setiap ulasan.
3. **Artikel:** terbitkan artikel kesehatan secara rutin, misalnya 2–4 per bulan.
4. **Isi CMS:** jaga jadwal dokter, layanan, dan promo tetap terbaru.
