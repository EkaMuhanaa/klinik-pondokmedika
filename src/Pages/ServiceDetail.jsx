import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useParams, Link } from 'react-router-dom';
import Layout from '../Components/Layout';

const serviceList = [
  { id: 1, title: "Poli Umum", slug: "poli-umum" },
  { id: 2, title: "Poli Gigi & Mulut", slug: "poli-gigi-mulut" },
  { id: 3, title: "Poli KIA", slug: "poli-kia" },
  { id: 4, title: "Laboratorium", slug: "laboratorium" },
  { id: 5, title: "Apotek 24 Jam", slug: "apotek-24-jam" },
  { id: 6, title: "Unit Gawat Darurat (UGD)", slug: "unit-gawat-darurat" }
];

const serviceContents = {
  "poli-umum": {
    title: "Poli Umum",
    background: "Pelayanan kesehatan tingkat pertama (primer) merupakan garda terdepan dalam sistem kesehatan. Banyak keluhan penyakit ringan hingga kronis tahap awal yang sebenarnya dapat ditangani secara tuntas di fasilitas primer sebelum membutuhkan rujukan.",
    explanation: "Poli Umum Klinik Pondok Medika hadir sebagai pusat penanganan masalah kesehatan umum sehari-hari. Kami menyediakan diagnosis awal yang akurat, pengobatan komprehensif, serta edukasi kesehatan yang berpusat pada pencegahan penyakit. Pendekatan medis kami didasarkan pada prinsip kedokteran keluarga yang memandang pasien secara utuh.",
    conditions: "Pasien dengan keluhan demam, batuk, pilek, flu, nyeri sendi/otot, gangguan pencernaan (diare, maag), sakit kepala, infeksi ringan, serta pasien yang membutuhkan skrining awal atau pemantauan penyakit kronis seperti hipertensi dan diabetes mellitus terkontrol.",
    stages: "1. Anamnesis (wawancara riwayat kesehatan) mendalam.\n2. Pemeriksaan fisik komprehensif (tanda vital dan pemeriksaan spesifik).\n3. Penegakan diagnosis dan peresepan obat.\n4. Edukasi gaya hidup dan pencegahan penyakit.\n5. Surat rujukan ke dokter spesialis jika ditemukan indikasi kedaruratan atau penyakit kompleks.",
    location: "Klinik Pondok Medika - Lantai 1, Gedung Utama\nTelp: (021) 555-0123 ext. 101"
  },
  "poli-gigi-mulut": {
    title: "Poli Gigi & Mulut",
    background: "Kesehatan rongga mulut memiliki dampak langsung terhadap kesehatan tubuh secara keseluruhan. Infeksi pada gigi dan gusi yang tidak ditangani dapat menyebar melalui peredaran darah dan memengaruhi organ vital lainnya.",
    explanation: "Poli Gigi dan Mulut Klinik Pondok Medika menyediakan perawatan preventif, kuratif, dan rehabilitatif untuk menjaga kesehatan rongga mulut, gigi, dan gusi. Kami menggunakan peralatan sterilisasi berstandar tinggi untuk memastikan kenyamanan dan keamanan pasien terbebas dari infeksi silang.",
    conditions: "Pasien yang mengalami sakit gigi, gigi berlubang (karies), radang gusi (gingivitis), penumpukan karang gigi, gigi sensitif, gigi impaksi, keluhan bau mulut (halitosis), atau pasien yang sekadar ingin melakukan pemeriksaan kebersihan gigi rutin.",
    stages: "1. Pemeriksaan awal kondisi rongga mulut dan gigi (Diagnostik).\n2. Pembersihan karang gigi (Scaling) jika diperlukan.\n3. Tindakan medis sesuai indikasi (penambalan, pencabutan, atau perawatan saluran akar).\n4. Resep obat pereda nyeri atau antibiotik jika ditemukan infeksi bakteri.\n5. Edukasi pemeliharaan kebersihan mulut mandiri di rumah (Dental Health Education).",
    location: "Klinik Pondok Medika - Lantai 1, Sayap Kanan\nTelp: (021) 555-0123 ext. 102"
  },
  "poli-kia": {
    title: "Poli KIA",
    background: "Kesehatan seorang ibu dan anak yang sedang tumbuh kembang merupakan pondasi utama dari masyarakat yang sehat. Memantau kehamilan dan pertumbuhan anak secara rutin sangat krusial untuk mencegah komplikasi kehamilan dan masalah pertumbuhan anak (stunting).",
    explanation: "Poli Kesehatan Ibu dan Anak (KIA) didedikasikan khusus untuk mendampingi setiap fase penting kehidupan wanita dan balita. Layanan ini dirancang dengan pendekatan yang hangat, empatik, dan mengutamakan kenyamanan psikologis ibu dan anak saat berkonsultasi maupun menjalani tindakan.",
    conditions: "Ibu hamil yang membutuhkan pemeriksaan rutin kehamilan (Antenatal Care), ibu pasca melahirkan (Postnatal Care), wanita usia subur yang membutuhkan layanan Keluarga Berencana (KB), serta bayi dan balita untuk pemantauan tumbuh kembang dan imunisasi.",
    stages: "1. Pendaftaran dan pengukuran dasar (berat badan, tekanan darah, ukur lingkar perut untuk ibu hamil).\n2. Pemeriksaan medis oleh dokter umum atau bidan terlatih.\n3. Sesi konseling laktasi, gizi kehamilan, atau pemilihan metode kontrasepsi jangka panjang/pendek.\n4. Pemberian suplemen vitamin atau injeksi vaksin imunisasi dasar untuk bayi/balita.\n5. Penjadwalan jadwal kontrol atau imunisasi bulan berikutnya.",
    location: "Klinik Pondok Medika - Lantai 1, Area Khusus KIA (Bebas Asap Rokok & Ramah Anak)\nTelp: (021) 555-0123 ext. 103"
  },
  "laboratorium": {
    title: "Laboratorium",
    background: "Sebagian besar penegakan diagnosis penyakit tidak dapat dipastikan hanya melalui pemeriksaan fisik (anamnesis) semata. Pengujian sampel cairan tubuh secara ilmiah di laboratorium sangat dibutuhkan oleh tenaga kesehatan untuk melihat bukti nyata kondisi abnormalitas di dalam tubuh pasien.",
    explanation: "Fasilitas Laboratorium Klinik Pondok Medika menyediakan pengujian diagnostik in-vitro yang cepat dan presisi tinggi. Kami secara disiplin menjalankan prosedur kontrol kualitas internal yang ketat (patient safety) agar hasil tes dapat menjadi rujukan ilmiah yang akurat bagi para dokter dalam menentukan peta terapi pengobatan.",
    conditions: "Pasien yang mendapatkan rujukan dari dokter pemeriksa untuk uji laboratorium spesifik, pasien yang melakukan pendaftaran medical check-up rutin, penderita penyakit kronis yang butuh pemantauan berkala (seperti cek HbA1c atau profil lipid), serta individu yang curiga terinfeksi virus/bakteri.",
    stages: "1. Verifikasi formulir rujukan dokter atau permintaan tes mandiri pasien.\n2. Proses pengambilan spesimen (darah, urine, sputum, atau feses) dengan teknik aseptik yang higienis dan minim nyeri.\n3. Pemrosesan sampel uji menggunakan instrumen penganalisis otomatis termutakhir.\n4. Validasi mikroskopis dan elektronis hasil uji laboratorium oleh penanggung jawab analis medis.\n5. Penyerahan hasil akhir berupa cetak laporan atau dikirim otomatis ke sistem rekam medis dokter perujuk.",
    location: "Klinik Pondok Medika - Lantai 1, Berdekatan dengan Ruang UGD\nTelp: (021) 555-0123 ext. 105"
  },
  "apotek-24-jam": {
    title: "Apotek 24 Jam",
    background: "Risiko munculnya gejala penyakit dan kondisi darurat medis tidak pernah mengenal waktu, sehingga ketersediaan obat-obatan yang cepat, terjamin, dan aman mutlak menjadi kebutuhan absolut masyarakat setiap saat, baik siang hari maupun larut malam.",
    explanation: "Layanan Apotek 24 Jam Klinik Pondok Medika terus bersiaga tanpa henti untuk menjamin kemudahan akses pasien terhadap perbekalan kesehatan primer. Kami menerapkan standar ketat praktik farmasi klinis yang menjamin keaslian obat (tanpa obat palsu/kedaluwarsa), penyimpanan obat pada suhu ruang yang spesifik, serta pelayanan informasi yang edukatif bagi pasien.",
    conditions: "Pasien pasca pemeriksaan dokter yang perlu menebus resep medis (obat etikal), masyarakat umum yang mencari obat bebas atau obat bebas terbatas (OTC), pembelian suplemen/vitamin harian, kebutuhan alat medis/P3K dasar, atau pasien yang membutuhkan sesi konsultasi ringan mengenai tata cara penggunaan obat.",
    stages: "1. Penerimaan lembar resep dan skrining farmakologis awal oleh asisten apoteker/apoteker jaga.\n2. Penyiapan, penimbangan, dan peracikan sediaan obat (puyer/kapsul/salep) sesuai resep medis dokter.\n3. Pengecekan silang akhir (cross-check) terkait kesesuaian jenis obat, jumlah dosis, dan nama pasien.\n4. Penyerahan obat kepada pasien yang disertai dengan Pelayanan Informasi Obat (PIO) interaktif mengenai pantangan, aturan pakai, dan antisipasi efek samping ringan.\n5. Transaksi pembayaran obat di loket kasir farmasi.",
    location: "Klinik Pondok Medika - Lantai 1, Sayap Depan Lobi Utama (Mudah Diakses dari Jalan Raya)\nTelp: (021) 555-0123 ext. 107"
  },
  "unit-gawat-darurat": {
    title: "Unit Gawat Darurat (UGD)",
    background: "Terkadang kondisi kecelakaan dan serangan penyakit akut yang sangat fatal bisa menyerang secara mendadak. Penanganan medis yang amat cepat dan tepat dalam hitungan menit pertama pasca kejadian (golden period) sangat krusial dan secara langsung menentukan nasib hidup keselamatan maupun prognosis kesembuhan pasien secara signifikan.",
    explanation: "Unit Gawat Darurat (UGD) Klinik Pondok Medika adalah layanan fasilitas medis kedaruratan lini pertama yang selalu bersiaga penuh 24 jam sehari, tiada henti dalam seminggu. Kami disokong oleh dokter dan perawat triase khusus yang terlatih untuk menangani segala bentuk kasus kedaruratan (life-saving) dengan respon responsif yang sangat berpacu melawan waktu.",
    conditions: "Pasien dengan keluhan kondisi akut, kritis, hingga mengancam stabilitas jiwa atau berisiko cacat tubuh, contohnya seperti trauma berat pasca kecelakaan, luka robekan fisik parah, pendarahan tak terkendali, kejang, serangan asma akut parah, keluhan nyeri dada mendadak menyebar, dehidrasi hebat (diare akut), luka bakar, ataupun kondisi medis memburuk secara mendadak lainnya.",
    stages: "1. Penerimaan pasien dari ambulans/pengantar dan evaluasi tanda vital awal secara seketika (instan).\n2. Penerapan sistem Triase (pemilahan prioritas urutan penanganan berdasarkan kategori keparahan kondisi: label Merah, Kuning, atau Hijau).\n3. Pelaksanaan tindakan resusitasi, injeksi darurat, dan stabilisasi tahap awal untuk menyelamatkan nyawa pasien (life-saving).\n4. Observasi parameter fungsi organ/tanda vital lanjutan serta pelaksanaan tes lab ringkas apabila dibutuhkan dokter.\n5. Keputusan tindakan medis selanjutnya (disposisi): observasi pulang ke rumah, dirujuk pindah ke fasilitas rawat inap klinik, atau dirujuk segera memakai ambulans darurat ke rumah sakit rujukan tingkat lanjut dengan kelengkapan lebih memadai.",
    location: "Klinik Pondok Medika - Gedung Utama, Pintu Akses Terpisah Bagian Samping (Khusus Drop-off Ambulans/Pasien)\nTelp: (021) 555-0118 (Nomor Direct Line UGD Bebas Beban 24 Jam)"
  }
};

const ServiceDetail = () => {
  const { slug } = useParams();

  const serviceData = serviceContents[slug];
  
  // Memformat slug menjadi judul jika tidak ada data spesifik
  const title = serviceData?.title || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Helper untuk default konten jika belum didefinisikan (fallback)
  const defaultText = "Informasi mendalam mengenai layanan sedang dalam penyesuaian sistem.";

  return (
    <Layout>
      <section className="bg-primary py-16 px-gutter">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
          <Link to="/layanan" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <MdArrowBack className="text-sm" />
            Kembali ke Daftar Layanan
          </Link>
          <h1 className="font-headline-xl text-headline-xl text-white mb-4">{title}</h1>
          <p className="font-body-lg text-white/80 max-w-2xl">
            Informasi lengkap mengenai prosedur, fasilitas pelayanan, serta pendekatan medis klinik kami untuk kebutuhan {title} Anda.
          </p>
        </div>
      </section>

      <section className="py-12 px-gutter bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-3 animate-fade-in-up">
            <h2 className="font-headline-md text-3xl font-bold text-primary mb-10 border-b border-outline-variant/30 pb-4">
              Informasi Pelayanan {title}
            </h2>
            
            <div className="space-y-12">
              <div>
                <h3 className="font-bold text-xl text-on-surface mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                  Latar Belakang
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-justify text-lg">
                  {serviceData?.background || defaultText}
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-xl text-on-surface mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                  Penjelasan Layanan di Klinik Kami
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-justify text-lg">
                  {serviceData?.explanation || defaultText}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xl text-on-surface mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                  Kondisi Medis Pasien yang Cocok
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-justify text-lg bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
                  {serviceData?.conditions || defaultText}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xl text-on-surface mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                  Layanan & Tahapan Pengobatan
                </h3>
                <ul className="list-none space-y-4 text-on-surface-variant leading-relaxed text-lg">
                  {(serviceData?.stages || defaultText).split('\n').map((stage, idx) => {
                    // Extract number if it starts with number and dot
                    const match = stage.match(/^(\d+\.)\s*(.*)/);
                    if (match) {
                      return (
                        <li key={idx} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-outline-variant/20">
                          <span className="font-bold text-primary flex-shrink-0">{match[1]}</span>
                          <span>{match[2]}</span>
                        </li>
                      );
                    }
                    return <li key={idx}>{stage}</li>;
                  })}
                </ul>
              </div>

              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="font-bold text-xl text-primary mb-3">Lokasi Pelayanan & Kontak Darurat</h3>
                  <p className="text-on-surface-variant leading-relaxed whitespace-pre-line text-lg font-medium">
                    {serviceData?.location || "Klinik Pondok Medika - Alamat Pusat"}
                  </p>
                </div>
                <div className="bg-primary text-white font-bold py-3 px-6 rounded-full whitespace-nowrap shadow-md">
                  Hubungi Sekarang
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <aside className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden sticky top-24 shadow-sm">
              <div className="p-5 border-b border-outline-variant/30 bg-surface-container-lowest">
                <h3 className="font-bold text-lg text-primary">Layanan Lainnya</h3>
              </div>
              <div className="flex flex-col">
                {serviceList.map(srv => (
                  <Link 
                    key={srv.id}
                    to={`/layanan/${srv.slug}`}
                    className={`p-4 border-b border-outline-variant/20 last:border-0 hover:bg-primary/5 transition-colors text-sm font-medium ${srv.slug === slug ? 'bg-primary/10 text-primary border-l-4 border-l-primary font-bold' : 'text-on-surface-variant border-l-4 border-l-transparent hover:text-primary'}`}
                  >
                    {srv.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
