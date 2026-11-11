// Data layanan klinik. Dipakai halaman Layanan, detail layanan, footer, SEO (judul/JSON-LD),
// dan script prerender. Jika menambah layanan, tambahkan juga path-nya di
// backend/config/clinic.php (static_paths) agar masuk sitemap.xml.

export const services = [
  { slug: "poli-umum", title: "Poli Umum", description: "Layanan pemeriksaan kesehatan umum, konsultasi medis, dan penanganan penyakit akut maupun kronis oleh dokter umum profesional." },
  { slug: "poli-gigi-mulut", title: "Poli Gigi & Mulut", description: "Perawatan kesehatan gigi menyeluruh, mulai dari pembersihan karang gigi, pencabutan, hingga perawatan saluran akar." },
  { slug: "poli-kia", title: "Poli KIA (Kesehatan Ibu & Anak)", description: "Pemeriksaan kehamilan, imunisasi dasar, tumbuh kembang anak, dan konsultasi laktasi untuk kesehatan optimal ibu dan buah hati." },
  { slug: "laboratorium", title: "Laboratorium", description: "Fasilitas pemeriksaan penunjang diagnostik lengkap dengan peralatan modern untuk hasil yang cepat dan akurat." },
  { slug: "apotek-24-jam", title: "Apotek 24 Jam", description: "Ketersediaan obat-obatan berkualitas dan alat kesehatan yang lengkap, siap melayani resep dokter setiap saat." },
  { slug: "unit-gawat-darurat", title: "Unit Gawat Darurat", description: "Penanganan pertama kasus kegawatdaruratan medis dengan tim yang sigap dan peralatan resusitasi standar." }
];

export const serviceContents = {
  "poli-umum": {
    title: "Poli Umum",
    background: "Pelayanan kesehatan tingkat pertama (primer) merupakan garda terdepan dalam sistem kesehatan. Banyak keluhan penyakit ringan hingga kronis tahap awal yang sebenarnya dapat ditangani secara tuntas di fasilitas primer sebelum membutuhkan rujukan.",
    explanation: "Poli Umum Klinik Pondok Medika hadir sebagai pusat penanganan masalah kesehatan umum sehari-hari. Kami menyediakan diagnosis awal yang akurat, pengobatan komprehensif, serta edukasi kesehatan yang berpusat pada pencegahan penyakit. Pendekatan medis kami didasarkan pada prinsip kedokteran keluarga yang memandang pasien secara utuh.",
    conditions: "Pasien dengan keluhan demam, batuk, pilek, flu, nyeri sendi/otot, gangguan pencernaan (diare, maag), sakit kepala, infeksi ringan, serta pasien yang membutuhkan skrining awal atau pemantauan penyakit kronis seperti hipertensi dan diabetes mellitus terkontrol.",
    stages: "1. Anamnesis (wawancara riwayat kesehatan) mendalam.\n2. Pemeriksaan fisik komprehensif (tanda vital dan pemeriksaan spesifik).\n3. Penegakan diagnosis dan peresepan obat.\n4. Edukasi gaya hidup dan pencegahan penyakit.\n5. Surat rujukan ke dokter spesialis jika ditemukan indikasi kedaruratan atau penyakit kompleks.",
    location: "Klinik Pondok Medika - Lantai 1, Gedung Utama"
  },
  "poli-gigi-mulut": {
    title: "Poli Gigi & Mulut",
    background: "Kesehatan rongga mulut memiliki dampak langsung terhadap kesehatan tubuh secara keseluruhan. Infeksi pada gigi dan gusi yang tidak ditangani dapat menyebar melalui peredaran darah dan memengaruhi organ vital lainnya.",
    explanation: "Poli Gigi dan Mulut Klinik Pondok Medika menyediakan perawatan preventif, kuratif, dan rehabilitatif untuk menjaga kesehatan rongga mulut, gigi, dan gusi. Kami menggunakan peralatan sterilisasi berstandar tinggi untuk memastikan kenyamanan dan keamanan pasien terbebas dari infeksi silang.",
    conditions: "Pasien yang mengalami sakit gigi, gigi berlubang (karies), radang gusi (gingivitis), penumpukan karang gigi, gigi sensitif, gigi impaksi, keluhan bau mulut (halitosis), atau pasien yang sekadar ingin melakukan pemeriksaan kebersihan gigi rutin.",
    stages: "1. Pemeriksaan awal kondisi rongga mulut dan gigi (Diagnostik).\n2. Pembersihan karang gigi (Scaling) jika diperlukan.\n3. Tindakan medis sesuai indikasi (penambalan, pencabutan, atau perawatan saluran akar).\n4. Resep obat pereda nyeri atau antibiotik jika ditemukan infeksi bakteri.\n5. Edukasi pemeliharaan kebersihan mulut mandiri di rumah (Dental Health Education).",
    location: "Klinik Pondok Medika - Lantai 1, Sayap Kanan"
  },
  "poli-kia": {
    title: "Poli KIA",
    background: "Kesehatan seorang ibu dan anak yang sedang tumbuh kembang merupakan pondasi utama dari masyarakat yang sehat. Memantau kehamilan dan pertumbuhan anak secara rutin sangat krusial untuk mencegah komplikasi kehamilan dan masalah pertumbuhan anak (stunting).",
    explanation: "Poli Kesehatan Ibu dan Anak (KIA) didedikasikan khusus untuk mendampingi setiap fase penting kehidupan wanita dan balita. Layanan ini dirancang dengan pendekatan yang hangat, empatik, dan mengutamakan kenyamanan psikologis ibu dan anak saat berkonsultasi maupun menjalani tindakan.",
    conditions: "Ibu hamil yang membutuhkan pemeriksaan rutin kehamilan (Antenatal Care), ibu pasca melahirkan (Postnatal Care), wanita usia subur yang membutuhkan layanan Keluarga Berencana (KB), serta bayi dan balita untuk pemantauan tumbuh kembang dan imunisasi.",
    stages: "1. Pendaftaran dan pengukuran dasar (berat badan, tekanan darah, ukur lingkar perut untuk ibu hamil).\n2. Pemeriksaan medis oleh dokter umum atau bidan terlatih.\n3. Sesi konseling laktasi, gizi kehamilan, atau pemilihan metode kontrasepsi jangka panjang/pendek.\n4. Pemberian suplemen vitamin atau injeksi vaksin imunisasi dasar untuk bayi/balita.\n5. Penjadwalan jadwal kontrol atau imunisasi bulan berikutnya.",
    location: "Klinik Pondok Medika - Lantai 1, Area Khusus KIA (Bebas Asap Rokok & Ramah Anak)"
  },
  "laboratorium": {
    title: "Laboratorium",
    background: "Sebagian besar penegakan diagnosis penyakit tidak dapat dipastikan hanya melalui pemeriksaan fisik (anamnesis) semata. Pengujian sampel cairan tubuh secara ilmiah di laboratorium sangat dibutuhkan oleh tenaga kesehatan untuk melihat bukti nyata kondisi abnormalitas di dalam tubuh pasien.",
    explanation: "Fasilitas Laboratorium Klinik Pondok Medika menyediakan pengujian diagnostik in-vitro yang cepat dan presisi tinggi. Kami secara disiplin menjalankan prosedur kontrol kualitas internal yang ketat (patient safety) agar hasil tes dapat menjadi rujukan ilmiah yang akurat bagi para dokter dalam menentukan peta terapi pengobatan.",
    conditions: "Pasien yang mendapatkan rujukan dari dokter pemeriksa untuk uji laboratorium spesifik, pasien yang melakukan pendaftaran medical check-up rutin, penderita penyakit kronis yang butuh pemantauan berkala (seperti cek HbA1c atau profil lipid), serta individu yang curiga terinfeksi virus/bakteri.",
    stages: "1. Verifikasi formulir rujukan dokter atau permintaan tes mandiri pasien.\n2. Proses pengambilan spesimen (darah, urine, sputum, atau feses) dengan teknik aseptik yang higienis dan minim nyeri.\n3. Pemrosesan sampel uji menggunakan instrumen penganalisis otomatis termutakhir.\n4. Validasi mikroskopis dan elektronis hasil uji laboratorium oleh penanggung jawab analis medis.\n5. Penyerahan hasil akhir berupa cetak laporan atau dikirim otomatis ke sistem rekam medis dokter perujuk.",
    location: "Klinik Pondok Medika - Lantai 1, Berdekatan dengan Ruang UGD"
  },
  "apotek-24-jam": {
    title: "Apotek 24 Jam",
    background: "Risiko munculnya gejala penyakit dan kondisi darurat medis tidak pernah mengenal waktu, sehingga ketersediaan obat-obatan yang cepat, terjamin, dan aman mutlak menjadi kebutuhan absolut masyarakat setiap saat, baik siang hari maupun larut malam.",
    explanation: "Layanan Apotek 24 Jam Klinik Pondok Medika terus bersiaga tanpa henti untuk menjamin kemudahan akses pasien terhadap perbekalan kesehatan primer. Kami menerapkan standar ketat praktik farmasi klinis yang menjamin keaslian obat (tanpa obat palsu/kedaluwarsa), penyimpanan obat pada suhu ruang yang spesifik, serta pelayanan informasi yang edukatif bagi pasien.",
    conditions: "Pasien pasca pemeriksaan dokter yang perlu menebus resep medis (obat etikal), masyarakat umum yang mencari obat bebas atau obat bebas terbatas (OTC), pembelian suplemen/vitamin harian, kebutuhan alat medis/P3K dasar, atau pasien yang membutuhkan sesi konsultasi ringan mengenai tata cara penggunaan obat.",
    stages: "1. Penerimaan lembar resep dan skrining farmakologis awal oleh asisten apoteker/apoteker jaga.\n2. Penyiapan, penimbangan, dan peracikan sediaan obat (puyer/kapsul/salep) sesuai resep medis dokter.\n3. Pengecekan silang akhir (cross-check) terkait kesesuaian jenis obat, jumlah dosis, dan nama pasien.\n4. Penyerahan obat kepada pasien yang disertai dengan Pelayanan Informasi Obat (PIO) interaktif mengenai pantangan, aturan pakai, dan antisipasi efek samping ringan.\n5. Transaksi pembayaran obat di loket kasir farmasi.",
    location: "Klinik Pondok Medika - Lantai 1, Sayap Depan Lobi Utama (Mudah Diakses dari Jalan Raya)"
  },
  "unit-gawat-darurat": {
    title: "Unit Gawat Darurat (UGD)",
    background: "Terkadang kondisi kecelakaan dan serangan penyakit akut yang sangat fatal bisa menyerang secara mendadak. Penanganan medis yang amat cepat dan tepat dalam hitungan menit pertama pasca kejadian (golden period) sangat krusial dan secara langsung menentukan nasib hidup keselamatan maupun prognosis kesembuhan pasien secara signifikan.",
    explanation: "Unit Gawat Darurat (UGD) Klinik Pondok Medika adalah layanan fasilitas medis kedaruratan lini pertama yang selalu bersiaga penuh 24 jam sehari, tiada henti dalam seminggu. Kami disokong oleh dokter dan perawat triase khusus yang terlatih untuk menangani segala bentuk kasus kedaruratan (life-saving) dengan respon responsif yang sangat berpacu melawan waktu.",
    conditions: "Pasien dengan keluhan kondisi akut, kritis, hingga mengancam stabilitas jiwa atau berisiko cacat tubuh, contohnya seperti trauma berat pasca kecelakaan, luka robekan fisik parah, pendarahan tak terkendali, kejang, serangan asma akut parah, keluhan nyeri dada mendadak menyebar, dehidrasi hebat (diare akut), luka bakar, ataupun kondisi medis memburuk secara mendadak lainnya.",
    stages: "1. Penerimaan pasien dari ambulans/pengantar dan evaluasi tanda vital awal secara seketika (instan).\n2. Penerapan sistem Triase (pemilahan prioritas urutan penanganan berdasarkan kategori keparahan kondisi: label Merah, Kuning, atau Hijau).\n3. Pelaksanaan tindakan resusitasi, injeksi darurat, dan stabilisasi tahap awal untuk menyelamatkan nyawa pasien (life-saving).\n4. Observasi parameter fungsi organ/tanda vital lanjutan serta pelaksanaan tes lab ringkas apabila dibutuhkan dokter.\n5. Keputusan tindakan medis selanjutnya (disposisi): observasi pulang ke rumah, dirujuk pindah ke fasilitas rawat inap klinik, atau dirujuk segera memakai ambulans darurat ke rumah sakit rujukan tingkat lanjut dengan kelengkapan lebih memadai.",
    location: "Klinik Pondok Medika - Gedung Utama, Pintu Akses Terpisah Bagian Samping (Khusus Drop-off Ambulans/Pasien)"
  }
};
