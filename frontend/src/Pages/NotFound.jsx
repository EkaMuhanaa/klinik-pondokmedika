import React from 'react';
import { Link } from 'react-router-dom';
import { MdSearchOff } from 'react-icons/md';
import Layout from '../Components/Layout';

const NotFound = ({ title = 'Halaman Tidak Ditemukan', message = 'Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.' }) => (
  <Layout seo={{ title: `${title} – Klinik Pondok Medika`, description: message, noindex: true }}>
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-gutter py-section-gap">
      <MdSearchOff className="text-7xl text-primary mb-6" aria-hidden="true" />
      <p className="font-label-md text-primary mb-2">Kode 404</p>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">{title}</h1>
      <p className="text-on-surface-variant max-w-md mb-8">{message}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="inline-flex items-center min-h-[48px] bg-primary text-on-primary font-bold px-6 rounded-full hover:bg-primary/90 transition-colors">Kembali ke beranda</Link>
        <Link to="/layanan" className="inline-flex items-center min-h-[48px] border border-primary text-primary font-bold px-6 rounded-lg hover:bg-primary/10 transition-colors">Lihat layanan klinik</Link>
      </div>
    </section>
  </Layout>
);

export default NotFound;
