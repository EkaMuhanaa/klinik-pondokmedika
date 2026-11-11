# Sistem Desain & Panduan Visual (design.md)

**Proyek:** Website Company Profile Multipage Klinik Pondok Medika
**Versi:** 1.0

## 1. Tema & Nuansa Visual (Visual Nuance)

Berdasarkan logo Klinik Pondok Medika, desain antarmuka (UI) akan mengusung tema **"Modern, Terpercaya, dan Menenangkan"**.

* **Profesional & Kredibel:** Ditunjukkan melalui penggunaan warna hijau tua (Dark Green) yang tegas, mewakili stabilitas dan keahlian medis.
* **Ramah & Menenangkan:** Diwakili oleh warna biru kehijauan (Teal/Cyan) yang cerah, memberikan kesan bersih, higienis, dan pelayanan yang mengutamakan kenyamanan pasien.
* **Bentuk Visual (Shape):** Logo menggunakan elemen melingkar (lingkaran stetoskop) dan sudut melengkung (rounded). Sudut melengkung dipakai bertingkat (lihat §7): `rounded-full` hanya untuk tombol aksi utama, kartu dan gambar `rounded-xl`, chip/label/input `rounded-lg` atau `rounded-md`.



## 2. Palet Warna (Color Palette)

Warna ini akan dikonfigurasi ke dalam file `tailwind.config.js`.

* **Primary Color (Teal / Cyan):** `#32B3B2` (Estimasi dari logo "Medika" dan garis stetoskop)
* *Fungsi:* Warna logo. Di halaman hanya boleh untuk elemen dekoratif di atas latar putih/terang. **Tidak dipakai untuk teks, tombol berteks putih, atau ikon di atas teal gelap** (kontras 2,52–2,55:1).
* *Tailwind:* `text-brand-teal`.
* **Teal Gelap (warna aksi):** `#006A69` (`primary`). Tombol, tautan, dan teks berwarna. Kontras dengan putih 6,43:1.


* **Secondary Color (Dark Green):** `#065A3C` (Estimasi dari logo "Pondok" dan teks "Klinik Pondok Medika")
* *Fungsi:* Warna teks utama (Heading), warna latar belakang untuk seksi (section) yang membutuhkan kontras tinggi (seperti Footer atau Banner).
* *Tailwind:* `bg-emerald-900`, `text-emerald-900`.


* **Accent & Utility Colors:**
* **WhatsApp Green:** `#25D366` (Khusus untuk tombol *Call to Action* WhatsApp), dengan teks/ikon gelap `#06331B` (`on-whatsapp`, kontras 7,07:1). Teks putih di atas hijau ini hanya 1,98:1 dan tidak dipakai.


* **Background Light:** `#F8FAFC` (Slate 50) untuk latar belakang halaman agar terlihat bersih dan luas.
* **Text Body:** `#475569` (Slate 600) untuk teks paragraf agar mudah dibaca dan tidak terlalu kontras seperti warna hitam pekat.
* **White:** `#FFFFFF` untuk latar belakang *Card* layanan dan profil dokter.





## 3. Tipografi (Typography)

Memilih font *sans-serif* yang bersih, geometris, dan modern untuk menyesuaikan dengan logo.

* **Heading Font:** **Poppins** atau **Montserrat**. Digunakan pada elemen H1-H6, meniru ketegasan teks pada logo. *Style: Bold / Semi-Bold.*
* **Body Font:** **Inter** atau **Roboto**. Digunakan untuk teks deskripsi, artikel edukasi kesehatan, dan informasi detail. *Style: Regular / Medium.*



## 4. Panduan Komponen Antarmuka (UI Components)

### 4.1. Tombol (Buttons)

* **Primary Button (Aksi Utama):** Latar belakang Teal Gelap `#006A69` (atau hijau WhatsApp untuk pendaftaran), teks putih, sudut melengkung penuh (`rounded-full`). Hanya tombol aksi utama yang berbentuk pill.


* **WhatsApp CTA Button:** Latar belakang *WhatsApp Green*, teks dan ikon gelap `#06331B`, dilengkapi ikon logo WhatsApp. Ada di hero Beranda dan sebagai tombol mengambang.


* **Secondary/Outline Button:** Tanpa latar belakang, border tebal dengan warna *Secondary Dark Green*, teks *Secondary Dark Green*. Digunakan untuk filter pencarian dokter.



### 4.2. Kartu (Cards)

* Digunakan pada **Seksi Layanan Unggulan** dan **Dokter Kami**.


* *Desain:* Latar belakang putih (`bg-white`), garis tepi tipis, sudut `rounded-xl`, tanpa bayangan. Hover mengubah warna garis tepi, tidak mengangkat kartu. Bayangan hanya untuk lapisan yang benar-benar melayang (lihat §7).



### 4.3. Indikator Status Ketersediaan Dokter

Menyesuaikan spesifikasi PRD, indikator status menggunakan *badge* warna:

* 🟢 **Aktif Praktik:** Dot hijau cerah (`bg-green-500`) + teks "Aktif Praktik".
* 🔴 **Selesai / Tidak Praktik:** Dot abu-abu/merah pudar (`bg-gray-400` atau `bg-red-400`) + teks "Tidak Praktik".
* 🟡 **Cuti / Izin:** Dot kuning/oranye (`bg-amber-400`) + teks "Cuti".

## 5. Implementasi Desain Per Halaman (Layouting)

### Beranda (Home)



* **Hero Section:** Latar belakang gambar fasilitas medis berkualitas tinggi, di-overlay dengan gradasi transparan warna *Secondary Dark Green*. Teks *headline* berwarna putih, dengan CTA "Buat Janji Temu" berwarna *Teal* atau *WhatsApp Green*.
* **Informasi Utama (Jam, Lokasi, CTA):** Didesain melayang (*floating card*) sedikit menimpa bagian bawah Hero Section untuk menarik perhatian seketika.
* **Layanan Unggulan:** Layout *Grid* (maksimal 4 item). Menggunakan ikon garis (line icons) berwarna *Primary Teal*.


* **Seksi Fasilitas:** Galeri foto *masonry* atau *slider* horizontal dengan sudut foto *rounded-lg*.

### Tentang Kami (About)



* Menggunakan banyak ruang putih (*white space*) untuk kesan bersih. Sejarah dan visi-misi ditampilkan dengan tipografi teks berukuran besar dan mudah dibaca.
* Kutipan nilai budaya klinik menggunakan warna teks *Primary Teal* untuk aksen.

### Layanan (Services) & Tim Kami (Team)



* **Layanan:** Menggunakan layout *Card* katalog yang rapi, dengan *thumbnail* gambar di atas dan deskripsi di bawah.
* **Tim Kami:** Menampilkan foto profil dokter (rasio 1:1, *crop* otomatis sesuai aturan CMS) dalam bingkai melingkar (`rounded-full`), lengkap dengan *badge* indikator ketersediaan status secara *real-time*.



### Artikel (Articles)



* Layout difokuskan pada *clean reading experience*.
* Lebar maksimal teks pembacaan (kolom tunggal, sekitar `max-w-3xl` di Tailwind) di tengah layar.
* Tipografi diatur dengan spasi antar baris (*line-height*) yang lega untuk kemudahan membaca di perangkat seluler (*Mobile-First*).



## 6. Spesifikasi Aset Gambar & Ikon

* **Ikon:** Menggunakan *Heroicons* atau *Feather Icons* (gaya garis/outline) dengan warna dominan *Primary Teal*.
* **Gambar:** CMS mengatur kompresi otomatis dan rasio untuk menjaga konsistensi. Foto dokter wajib berlatar belakang seragam (misalnya abu-abu terang atau putih). Logo *partner* medis (BPJS/Asuransi) wajib berformat transparan (PNG/SVG) untuk menyatu rapi dengan latar belakang.

## 7. Keputusan Desain (Audit Anti-Slop #001, November 2026)

Dicatat sesuai aturan anti-slop R-31: setiap keputusan punya alasan satu baris. Pemilik memilih "ubah" untuk tiga konflik audit (warna teks tombol WhatsApp, pill di semua elemen, bayangan di semua kartu).

**Design Read:** website profil klinik pratama untuk warga Cengkareng dan sekitarnya, bahasa visual "Modern, Terpercaya, Menenangkan" (§1), dial **ENERGY 1 / RHYTHM 2 / MOTION 1**.

| Keputusan | Alasan |
|---|---|
| Hijau tua `#065A3C` untuk footer dan latar hero tanpa foto | Warna logo "Pondok"; aman untuk teks putih (8,28:1) sehingga tidak pernah ada teks pucat di atas gradien. |
| Teal gelap `#006A69` untuk aksi; teal logo `#32B3B2` tidak dipakai untuk teks/ikon | Teal logo terlalu terang untuk teks; teal gelap tetap terasa satu keluarga. |
| Tidak ada warna oranye/ketiga di halaman publik | Palet dibatasi 2 warna inti + hijau WhatsApp sebagai satu aksen. |
| Tombol WhatsApp hijau dengan teks gelap | Hijau WhatsApp dikenali pasien; teks gelap membuatnya terbaca. |
| Pill hanya untuk tombol aksi utama | Bentuk pill menandai "ini tindakan utama"; elemen lain memakai sudut lebih kecil supaya hierarki terlihat. |
| Bayangan hanya untuk header sticky, kartu info hero, menu, pop-up, dan tombol WhatsApp mengambang | Bayangan berarti "melayang di atas halaman", bukan dekorasi setiap kartu. |
| Satu layanan ditonjolkan (Poli Umum / Pemeriksaan Anak & Dewasa) | Pintu masuk utama pasien; layanan lain ditampilkan sebagai daftar ringkas. |
| Judul section rata kiri dengan tautan di kanan, tanpa label kapital di atas judul | Mengurangi pola "judul tengah + subjudul + grid" yang berulang; label kapital hanya mengulang judul. |
| Tidak ada ikon hiasan di atas judul hero | Ikon tidak membawa informasi; fokus hero adalah judul dan tombol daftar. |
| Tanpa animasi scroll atau transisi halaman (MOTION 1) | Konten klinik harus langsung terbaca; gerakan hanya untuk hover, menu, slide hero, dan daftar Rekan Medis. Semua gerakan berhenti jika perangkat diset "kurangi gerakan". |
| Daftar Rekan Medis berjalan pelan (komponen `LogoMarquee`), diminta pemilik pada November 2026 | Menghemat ruang untuk daftar nama yang panjang. Syarat aksesibilitas tetap dipenuhi: berhenti saat disorot/disentuh/fokus, ada tombol jeda (gerakan > 5 detik), dan diam serta bisa digulir jika "kurangi gerakan" aktif. |
| Area sentuh minimal 44 px | Banyak pasien membuka dari HP; link footer dan tombol kecil sebelumnya hanya 20–40 px. |
| Montserrat untuk judul, Inter untuk teks | Montserrat geometris seperti huruf logo; Inter mudah dibaca di layar kecil (§3). |
| Ikon Material (react-icons/md), garis tebal | Sudah dipakai di seluruh situs; dipilih per makna (jam, lokasi, telepon), tidak sekadar hiasan. |
