import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useParams, Link } from 'react-router-dom';
import Layout from '../Components/Layout';

const serviceContents = {
  "poli-umum": {
    title: "Poli Umum",
    description: "Poli Umum Klinik Pondok Medika hadir sebagai ujung tombak pelayanan kesehatan primer bagi masyarakat. Layanan ini difokuskan pada diagnosis, penanganan awal, dan pengelolaan berbagai masalah kesehatan umum yang sering dijumpai sehari-hari. Mulai dari pemeriksaan kesehatan rutin, penanganan penyakit akut seperti demam, batuk, dan flu, hingga pemantauan kondisi kronis seperti hipertensi dan diabetes ringan. Pendekatan medis yang kami terapkan mengutamakan komunikasi dua arah yang komprehensif agar setiap pasien memahami kondisi kesehatannya secara utuh dan mendapatkan edukasi pencegahan penyakit yang tepat sasaran."
  },
  "poli-gigi-mulut": {
    title: "Poli Gigi & Mulut",
    description: "Poli Gigi dan Mulut Klinik Pondok Medika menyediakan perawatan komprehensif untuk menjaga kesehatan rongga mulut, gigi, dan gusi Anda. Layanan kami mencakup tindakan preventif, kuratif, dan rehabilitatif. Mulai dari pembersihan karang gigi (scaling), penambalan gigi berlubang, pencabutan, perawatan saluran akar, hingga pembuatan gigi palsu. Kami mengutamakan kenyamanan pasien dalam setiap prosedur klinis, menggunakan peralatan medis sterilisasi tinggi untuk mencegah infeksi silang, serta memberikan edukasi menyeluruh tentang cara pemeliharaan kebersihan mulut mandiri di rumah guna mencegah masalah gigi di masa depan."
  },
  "poli-kia": {
    title: "Poli KIA",
    description: "Poli Kesehatan Ibu dan Anak (KIA) secara khusus didedikasikan untuk mengawal fase-fase penting dalam kehidupan wanita dan tumbuh kembang buah hati. Layanan ini mencakup pemeriksaan kehamilan (antenatal care) secara berkala untuk memantau kesehatan janin dan ibu, pelayanan keluarga berencana (KB), penanganan masalah kesehatan reproduksi dasar, serta pemantauan tumbuh kembang bayi dan balita yang terintegrasi dengan program imunisasi dasar. Kami memahami bahwa kesehatan ibu adalah kunci dari generasi yang kuat, sehingga pelayanan diberikan dengan pendekatan yang hangat, penuh empati, serta dukungan konseling gizi dan laktasi."
  },
  "laboratorium": {
    title: "Laboratorium",
    description: "Fasilitas Laboratorium Klinik Pondok Medika berperan vital dalam mendukung penegakan diagnosis penyakit secara cepat dan akurat. Kami melayani berbagai macam tes diagnostik in-vitro, mulai dari pemeriksaan darah rutin, kimia darah (seperti profil lipid, fungsi hati, fungsi ginjal, dan gula darah), pemeriksaan urine, hingga tes imunologi dan serologi dasar. Semua prosedur pengambilan spesimen dilakukan dengan standar keselamatan pasien yang ketat (patient safety) dan prosedur kontrol kualitas internal yang rutin. Hasil pengujian yang presisi ini sangat krusial bagi tenaga medis kami dalam merumuskan rencana pengobatan yang paling sesuai dan efektif untuk setiap kondisi klinis pasien."
  },
  "apotek-24-jam": {
    title: "Apotek 24 Jam",
    description: "Layanan Apotek 24 Jam kami dirancang untuk memastikan bahwa ketersediaan obat-obatan dan perbekalan kesehatan Anda selalu terpenuhi tanpa batasan waktu. Kami menyediakan obat-obatan etikal (dengan resep dokter), obat bebas, suplemen, serta alat kesehatan dasar dengan jaminan keaslian dan kualitas produk. Lebih dari sekadar tempat menebus resep, layanan apotek kami mengedepankan praktik farmasi klinis di mana setiap penyerahan obat selalu disertai dengan Pelayanan Informasi Obat (PIO) yang detail, mencakup dosis, cara penggunaan, hingga antisipasi efek samping dan interaksi obat, untuk memastikan terapi yang aman dan efektif."
  },
  "unit-gawat-darurat": {
    title: "Unit Gawat Darurat (UGD)",
    description: "Unit Gawat Darurat (UGD) Klinik Pondok Medika adalah fasilitas pelayanan medis lini pertama yang bersiaga penuh selama 24 jam sehari, 7 hari seminggu. Kami siap memberikan penanganan medis segera (life-saving) untuk kasus-kasus kedaruratan seperti trauma akibat kecelakaan, serangan asma akut, kejang, luka bakar, hingga kondisi medis mendadak lainnya yang mengancam jiwa atau berisiko menimbulkan kecacatan. Sistem triase diterapkan secara ketat untuk memprioritaskan penanganan berdasarkan tingkat kegawatan pasien. Dengan respon yang cepat dan penatalaksanaan medis yang terukur, kami berkomitmen untuk menstabilkan kondisi pasien secara optimal sebelum dilakukan observasi lanjutan atau rujukan ke fasilitas kesehatan tingkat lanjut jika diperlukan."
  }
};

const ServiceDetail = () => {
  const { slug } = useParams();

  const serviceData = serviceContents[slug];
  
  // Memformat slug menjadi judul jika tidak ada data spesifik
  const title = serviceData?.title || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const description = serviceData?.description || "Deskripsi layanan sedang dalam pembaruan. Silakan hubungi kami untuk informasi lebih lanjut mengenai layanan ini.";

  return (
    <Layout>
      <section className="bg-primary py-16 px-gutter">
        <div className="max-w-container-max mx-auto animate-fade-in-up">
          <Link to="/layanan" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <MdArrowBack className="text-sm" />
            Kembali ke Daftar Layanan
          </Link>
          <h1 className="font-headline-xl text-headline-xl text-white mb-4">{title}</h1>
          <p className="font-body-lg text-white/80 max-w-2xl">
            Informasi lengkap mengenai layanan medis kami untuk kebutuhan {title} Anda.
          </p>
        </div>
      </section>

      <section className="py-section-gap px-gutter bg-surface min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Tentang Layanan {title}</h2>
            <div className="prose prose-lg prose-slate max-w-none text-on-surface-variant leading-relaxed text-justify">
              <p>{description}</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
