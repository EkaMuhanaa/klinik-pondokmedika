<?php

/*
|--------------------------------------------------------------------------
| Data Klinik
|--------------------------------------------------------------------------
|
| Nilai default identitas klinik. Semua nilai di 'settings' bisa diubah admin
| lewat CMS (menu "Pengaturan Klinik") dan disimpan di tabel `settings`.
| Hanya kunci yang terdaftar di sini yang boleh diubah lewat API.
|
| PENTING untuk SEO lokal: nama, alamat, dan nomor telepon (NAP) harus sama
| persis dengan Google Business Profile klinik.
|
*/

return [

    // URL website publik (frontend), dipakai untuk sitemap.xml
    'frontend_url' => rtrim(env('FRONTEND_URL', 'https://klinikpondokmedika.id'), '/'),

    'settings' => [
        // Identitas
        'clinic_name' => 'Klinik Pondok Medika',
        'tagline' => 'Klinik keluarga terpercaya di Cengkareng, Jakarta Barat',

        // Alamat (NAP)
        'address_street' => 'Jl. Cendrawasih Raya',
        'kelurahan' => 'Cengkareng Barat',
        'kecamatan' => 'Cengkareng',
        'city' => 'Jakarta Barat',
        'province' => 'DKI Jakarta',
        'postal_code' => '11730',
        'latitude' => '-6.1438498',
        'longitude' => '106.722549',
        'maps_url' => 'https://maps.app.goo.gl/GMcezqSdHjVpFzjp7',

        // Kontak
        'phone' => '0812-3416-3128',
        'whatsapp' => '6281234163128',
        'email' => 'info@pondokmedika.com',

        // Jam operasional
        'opening_days' => 'Mo,Tu,We,Th,Fr,Sa',
        'opening_time' => '13:00',
        'closing_time' => '21:00',
        'hours_note' => 'Minggu & hari libur nasional tutup',

        // Wilayah layanan (dipisah koma) untuk SEO lokal
        'service_area' => 'Cengkareng, Cengkareng Barat, Cengkareng Timur, Kapuk, Duri Kosambi, Rawa Buaya, Kedaung Kali Angke, Kalideres, Kembangan, Jakarta Barat',

        // Media sosial (kosongkan jika tidak ada)
        'instagram_url' => '',
        'facebook_url' => '',
        'tiktok_url' => '',
        'youtube_url' => '',

        // SEO beranda (kosongkan untuk memakai judul/deskripsi otomatis)
        'seo_home_title' => '',
        'seo_home_description' => '',
    ],

    // Halaman statis untuk sitemap.xml. Samakan dengan frontend/src/data/services.js
    'static_paths' => [
        '/' => 1.0,
        '/tentang-kami' => 0.8,
        '/layanan' => 0.9,
        '/layanan/poli-umum' => 0.8,
        '/layanan/poli-gigi-mulut' => 0.8,
        '/layanan/poli-kia' => 0.8,
        '/layanan/laboratorium' => 0.8,
        '/layanan/apotek-24-jam' => 0.7,
        '/layanan/unit-gawat-darurat' => 0.7,
        '/artikel' => 0.8,
    ],
];
