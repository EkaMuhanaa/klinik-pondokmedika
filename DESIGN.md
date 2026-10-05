# Sistem Desain & Panduan Visual (design.md)

**Proyek:** Website Company Profile Multipage Klinik Pondok Medika
**Versi:** 1.0

## 1. Tema & Nuansa Visual (Visual Nuance)

Berdasarkan logo Klinik Pondok Medika, desain antarmuka (UI) akan mengusung tema **"Modern, Terpercaya, dan Menenangkan"**.

* **Profesional & Kredibel:** Ditunjukkan melalui penggunaan warna hijau tua (Dark Green) yang tegas, mewakili stabilitas dan keahlian medis.
* **Ramah & Menenangkan:** Diwakili oleh warna biru kehijauan (Teal/Cyan) yang cerah, memberikan kesan bersih, higienis, dan pelayanan yang mengutamakan kenyamanan pasien.
* **Bentuk Visual (Shape):** Logo menggunakan elemen melingkar (lingkaran stetoskop) dan sudut melengkung (rounded). Elemen UI seperti tombol, kartu (card), dan gambar harus menggunakan sudut melengkung (misalnya kelas `rounded-lg` atau `rounded-full` pada Tailwind) untuk menjaga konsistensi kelembutan visual.



## 2. Palet Warna (Color Palette)

Warna ini akan dikonfigurasi ke dalam file `tailwind.config.js`.

* **Primary Color (Teal / Cyan):** `#32B3B2` (Estimasi dari logo "Medika" dan garis stetoskop)
* *Fungsi:* Warna aksi utama, tombol utama, tautan aktif, ikon layanan, dan aksen visual.
* *Tailwind:* `bg-teal-500`, `text-teal-500`.


* **Secondary Color (Dark Green):** `#065A3C` (Estimasi dari logo "Pondok" dan teks "Klinik Pondok Medika")
* *Fungsi:* Warna teks utama (Heading), warna latar belakang untuk seksi (section) yang membutuhkan kontras tinggi (seperti Footer atau Banner).
* *Tailwind:* `bg-emerald-900`, `text-emerald-900`.


* **Accent & Utility Colors:**
* **WhatsApp Green:** `#25D366` (Khusus untuk tombol interaktif *Call to Action* WhatsApp).


* **Background Light:** `#F8FAFC` (Slate 50) untuk latar belakang halaman agar terlihat bersih dan luas.
* **Text Body:** `#475569` (Slate 600) untuk teks paragraf agar mudah dibaca dan tidak terlalu kontras seperti warna hitam pekat.
* **White:** `#FFFFFF` untuk latar belakang *Card* layanan dan profil dokter.





## 3. Tipografi (Typography)

Memilih font *sans-serif* yang bersih, geometris, dan modern untuk menyesuaikan dengan logo.

* **Heading Font:** **Poppins** atau **Montserrat**. Digunakan pada elemen H1-H6, meniru ketegasan teks pada logo. *Style: Bold / Semi-Bold.*
* **Body Font:** **Inter** atau **Roboto**. Digunakan untuk teks deskripsi, artikel edukasi kesehatan, dan informasi detail. *Style: Regular / Medium.*



## 4. Panduan Komponen Antarmuka (UI Components)

### 4.1. Tombol (Buttons)

* **Primary Button (Aksi Utama):** Latar belakang *Primary Teal*, teks putih, sudut melengkung penuh (`rounded-full`). Digunakan untuk tombol "Buat Janji Temu" atau "Lihat Layanan".


* **WhatsApp CTA Button:** Latar belakang *WhatsApp Green*, teks putih, dilengkapi ikon logo WhatsApp. Akan diletakkan secara mengambang (floating) atau menonjol di Hero Section.


* **Secondary/Outline Button:** Tanpa latar belakang, border tebal dengan warna *Secondary Dark Green*, teks *Secondary Dark Green*. Digunakan untuk filter pencarian dokter.



### 4.2. Kartu (Cards)

* Digunakan pada **Seksi Layanan Unggulan** dan **Dokter Kami**.


* *Desain:* Latar belakang putih (`bg-white`), bayangan lembut (`shadow-md`), sudut melengkung (`rounded-xl` atau `rounded-2xl`), dengan *hover effect* (bayangan membesar atau sedikit terangkat) untuk interaktivitas React.js.



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