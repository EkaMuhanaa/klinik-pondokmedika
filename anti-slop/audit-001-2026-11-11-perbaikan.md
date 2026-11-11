# Laporan Perbaikan Audit Anti-Slop #001

- **Tanggal:** 11 November 2026
- **Branch:** `claude/antislop-fixes` (dibangun di atas `claude/focused-gauss-fxjh6n` / PR #4)
- **Disetujui pemilik:** nomor 7–25. Untuk ketiga konflik `DESIGN.md`, semuanya **diubah**.
- **Tidak disentuh:** nomor 1–6 (isi klaim), karena menunggu konfirmasi klien. Contohnya judul "Dokter Spesialis", klaim "Terakreditasi", layanan 24 jam, daftar mitra, detail ruangan, dan layanan Bedah Minor/Nebulizer/Home Visit. Isinya dibiarkan apa adanya; hanya tampilannya yang dirapikan.
- **Design Read:** website profil klinik pratama untuk warga Cengkareng dan sekitarnya, bahasa visual "Modern, Terpercaya, Menenangkan", dial **ENERGY 1 / RHYTHM 2 / MOTION 1**. Alasan setiap keputusan dicatat di `DESIGN.md` §7.

## Status per nomor

| No | Aturan | Status | Yang dilakukan |
|---|---|---|---|
| 7 | R-25 | Selesai | Hero tanpa foto memakai hijau tua `#065A3C` (8,28:1). Lapisan gelap di atas foto dinaikkan (terburuk 5,97:1 di atas foto putih). |
| 8 | R-25 | Selesai | Semua tombol WhatsApp memakai teks/ikon gelap `#06331B` di atas hijau WhatsApp (7,07:1). |
| 9 | R-25 | Selesai | Nama mitra tanpa transparansi/grayscale, warna teks normal. |
| 10 | R-03 | Selesai | Semua link dan tombol minimal 44 px. Kontrol yang terlalu kecil turun dari 14–23 per halaman menjadi 0. |
| 11 | R-39 | Selesai | Teks berjalan diganti daftar statis. Animasi scroll dan transisi halaman dihapus. CSS global dan menu mobile menghormati "kurangi gerakan". Slide hero tiap 5 detik dengan tombol jeda/putar, dan tidak berjalan otomatis jika "kurangi gerakan" aktif. |
| 12 | R-39 | Selesai | Urutan heading diperbaiki di semua halaman (footer h2, kartu h2/h3, sidebar h2/h3). |
| 13 | R-40 | Selesai | Semua `<img>` diberi `width`/`height`. Slide hero pertama berupa `<img fetchpriority="high">` tanpa lazy; gambar lain memakai `loading="lazy"`. |
| 14 | R-27 | Selesai | Kondisi error terpisah dari kosong/tidak ditemukan, dengan tombol muat ulang, di Artikel, Detail Artikel, Beranda (artikel & fasilitas). Detail artikel membedakan 404 dan gangguan jaringan. |
| 15 | R-09, R-06 | Selesai | Label kapsul kapital di atas judul dihapus; label footer tidak lagi kapital. |
| 16 | R-04 | Selesai | Ikon hiasan di atas H1 hero (Beranda, Tentang Kami, Layanan, Artikel) dihapus. |
| 17 | R-14 | Selesai | Beranda: satu layanan utama ditonjolkan, sisanya daftar ringkas. Halaman Layanan: Poli Umum ditonjolkan, layanan lain dalam kartu bergaris tepi. |
| 18 | R-19 | Selesai | Fade-up saat scroll, transisi halaman, kartu terangkat, dan zoom gambar saat hover dihapus. Class `animate-fade-in-up` yang tidak terdefinisi dibersihkan. |
| 19 | R-12 | Selesai | Bayangan hanya untuk header sticky, kartu info hero, menu, pop-up, dan tombol mengambang. Kartu lain memakai garis tepi. |
| 20 | R-05 | Selesai | Judul section rata kiri dengan tautan di kanan; susunan berbeda per section (unggulan + daftar, galeri, daftar mitra, kartu artikel). Footer hijau tua dengan blok kontak utama dan dua daftar tautan. |
| 21 | R-15 | Selesai | Hero punya CTA utama "Daftar berobat via WhatsApp" dan tautan "Lihat jadwal dokter" ke `#dokter`. CTA spesifik: "Lihat alur Poli Umum", "Tanya {layanan} via WhatsApp", "Semua artikel kesehatan", "Muat ulang artikel". Tombol mengambang disembunyikan selama CTA hero terlihat supaya tidak menumpuk. |
| 22 | R-16 | Selesai | Kata promosi dihapus dari teks hero, layanan, fasilitas, artikel, dan Tentang Kami ("fasilitas modern", "standar terbaik", "teknologi terkini", "katalog komprehensif", "mercusuar kesehatan", "berkualitas tinggi"). Teks layanan di `data/services.js` tidak diubah karena termasuk nomor 4. |
| 23 | R-11 | Selesai | Pill hanya untuk tombol aksi utama dan tombol bulat (titik status, tombol WhatsApp mengambang). Kartu `rounded-xl`, chip/tombol sekunder/input `rounded-lg`/`rounded-md`. |
| 24 | R-29, R-20 | Selesai | Token `secondary` = `#065A3C` sesuai `DESIGN.md`. Oranye dihapus dari halaman publik. Teal logo tidak dipakai untuk teks/ikon karena kontrasnya kurang. Warna status dokter dibuat kontras (hijau/amber/abu tua). |
| 25 | R-20 | Sebagian | dr. Harfiyani: placeholder diberi label "Foto segera diperbarui" dan `alt` kosong. Foto dr. Arya berlatar merah masih perlu diganti foto baru dengan latar seragam (aset dari klinik). |

## Delivery Gate

Pengujian dilakukan dengan build production yang dijalankan di Apache + PHP lokal yang meniru susunan Hostinger, diisi contoh konten, lalu diperiksa dengan Playwright di iPhone SE, iPhone 13, iPad Mini, dan desktop 1366 px.

### Block 1: Hard Gate

- **R-02 PASS:** tidak ada em dash di teks website.
- **R-03 PASS:** overflow horizontal 0 dan kontrol di bawah 44 px berjumlah 0 di 7 halaman × 2 ukuran layar. Di HP, kartu info hero tidak lagi menutupi CTA (dicek di iPhone SE, iPhone 13, iPad Mini).
- **R-17, R-18 PASS:** tidak ada statistik atau testimoni.
- **R-23 PASS:** placeholder foto dokter diberi label jelas; tidak ada logo atau aset baru yang dibuat.
- **R-24, R-26 PASS:** semua link menu dan footer menuju halaman yang ada. "Lihat jadwal dokter" mengarah ke `#dokter` yang ada. Tombol jeda slide, filter kategori, salin tautan, bagikan, muat ulang, dan jadwal dokter semuanya berfungsi.
- **R-25 PASS:** tidak ada teks di bawah ambang kontras di 14 pengukuran. Teks hero dihitung manual untuk kondisi terburuk (5,97:1); tombol WhatsApp 7,07:1; footer 7,04:1.
- **R-27 PASS:** saat API dimatikan, muncul pesan error dan tombol muat ulang di Artikel, Detail Artikel, dan Beranda. Kondisi kosong dan loading juga ada.
- **R-28 PASS:** tidak ada FAQ.
- **R-32 PASS:** urutan Tab di Beranda: logo, menu, "Daftar berobat via WhatsApp", "Lihat jadwal dokter", kartu lokasi, kartu WhatsApp, tombol jadwal dokter. Semuanya dengan outline fokus yang terlihat. Pop-up ditutup dengan Esc.
- **R-33 PASS:** semua perubahan ditulis langsung di source.
- **R-34 N/A:** tidak ada pengalih tema.
- **R-35 PASS:** build dijalankan dan setiap kontrol diklik satu per satu:
  - login admin → panel admin;
  - simpan Pengaturan Klinik → pesan "tersimpan" terlihat, alamat dan Instagram muncul di footer dan JSON-LD;
  - nomor WhatsApp tidak valid → pesan validasi;
  - buat promo → status "Tayang";
  - pop-up muncul setelah 4 detik, tertutup dengan Esc, dan tidak muncul lagi dalam sesi yang sama;
  - `/layanan/tidak-ada` dan URL acak → halaman 404 `noindex`.

  Console: hanya ada respons 422 dari uji validasi WhatsApp yang memang disengaja.
- **R-36, R-38:** klaim nomor 1–6 masih ada dan **belum PASS**. Statusnya menunggu keputusan klien, sesuai pilihan pemilik untuk tidak menyentuhnya.
- **R-37 PASS:** `DESIGN.md` dipakai sebagai arah; ketiga konflik sudah diputuskan pemilik (ubah) dan dicatat di §7.
- **R-39 PASS:** semua tombol memakai `cursor: pointer` dan punya nama aksesibel; ikon `aria-hidden`; tidak ada heading yang terlewat; ada `prefers-reduced-motion`; slide punya tombol jeda; `lang`, `<title>`, dan landmark tersedia.
- **R-40 PASS:** semua `<img>` punya ukuran; slide hero pertama memakai `fetchpriority="high"`. Angka Core Web Vitals tidak diukur.

### Block 2: Purpose-Gate

R-01, R-04, R-06, R-09, R-12, R-14, R-19: PASS, dengan alasan tertulis di `DESIGN.md` §7. R-07, R-08, R-10, R-13, R-22: tidak ada pola tersebut.

### Block 3: Liveliness

Dial dideklarasikan (ENERGY 1 / RHYTHM 2 / MOTION 1) dan sesuai hasil:
- **Fokus:** satu fokus per layar, yaitu CTA daftar via WhatsApp di hero.
- **Aksen:** hijau WhatsApp dipakai khusus untuk aksi pendaftaran.
- **Motif identitas:** blok hijau tua/teal gelap pada hero, layanan utama, dan footer.

### Block 4: Craftsmanship & Quality Locks

R-05, R-11, R-15, R-16, R-20, R-29, R-31: PASS. Pengecualian:
- **R-20 (sebagian):** foto dr. Arya masih berlatar merah.
- **C-5:** menunggu nomor 1–6.

**Kesimpulan:** semua nomor yang disetujui (7–25) lolos, kecuali bagian foto di nomor 25 yang butuh aset baru. Nomor 1–6 belum lolos dan butuh keputusan klien sebelum website bisa dinyatakan bebas slop sepenuhnya.
