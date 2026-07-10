import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../Components/Layout';

const ServiceDetail = () => {
  const { slug } = useParams();

  // Memformat slug menjadi judul yang ramah pengguna
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <Layout>
      <section className="bg-primary py-16 px-gutter">
        <div className="max-w-container-max mx-auto animate-fade-in-up">
          <Link to="/layanan" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Daftar Layanan
          </Link>
          <h1 className="font-headline-xl text-headline-xl text-white mb-4">{title}</h1>
          <p className="font-body-lg text-white/80 max-w-2xl">
            Informasi lengkap mengenai layanan, fasilitas, dan tenaga medis profesional kami untuk kebutuhan {title} Anda.
          </p>
        </div>
      </section>

      <section className="py-section-gap px-gutter bg-surface min-h-screen">
        <div className="max-w-container-max mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant/30 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Tentang Layanan Ini</h2>
            <p className="text-on-surface-variant text-body-md leading-relaxed mb-6">
              Halaman ini adalah prototipe dari halaman detail layanan <strong>{title}</strong>. Pada versi sistem yang sudah terhubung dengan panel admin (CMS), halaman ini akan menampilkan deskripsi lengkap secara dinamis dari database, termasuk:
            </p>
            <ul className="list-disc list-inside space-y-3 text-on-surface-variant text-body-md ml-4">
              <li>Penjelasan mendalam tentang prosedur medis yang tersedia.</li>
              <li>Daftar dokter spesialis yang menangani poli ini beserta jadwal praktiknya.</li>
              <li>Informasi fasilitas pendukung seperti jenis alat medis modern yang digunakan.</li>
              <li>Estimasi biaya pelayanan dasar (jika diperlukan).</li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
