import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useParams, Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import NotFound from './NotFound';
import { services, serviceContents } from '../data/services';
import { useSiteSettings } from '../Contexts/SiteSettingsContext';
import { localArea, whatsappLink, absoluteUrl } from '../seo/meta';

const ServiceDetail = () => {
  const { slug } = useParams();

  const settings = useSiteSettings();
  const serviceData = serviceContents[slug];

  if (!serviceData) {
    return <NotFound title="Layanan Tidak Ditemukan" message="Layanan yang Anda cari tidak tersedia. Silakan lihat daftar layanan kami." />;
  }
  
  // Memformat slug menjadi judul jika tidak ada data spesifik
  const title = serviceData?.title || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Helper untuk default konten jika belum didefinisikan (fallback)
  const defaultText = "Informasi mendalam mengenai layanan sedang dalam penyesuaian sistem.";

  return (
    <Layout seo={{
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        name: `${title} – ${settings.clinic_name}`,
        url: absoluteUrl(`/layanan/${slug}`),
        about: { '@type': 'MedicalProcedure', name: title, description: serviceData.explanation },
        provider: { '@id': absoluteUrl('/') + '#klinik' },
      },
    }}>
      <section className="bg-primary py-16 px-gutter">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
          <Link to="/layanan" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <MdArrowBack className="text-sm" />
            Kembali ke Daftar Layanan
          </Link>
          <h1 className="font-headline-xl text-headline-xl text-white mb-4">{title} di {localArea(settings)}</h1>
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
                <p className="text-on-surface-variant leading-relaxed text-justify text-lg font-medium italic">
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
                    {serviceData.location}{'\n'}Telp/WhatsApp: {settings.phone}
                  </p>
                </div>
                <a href={whatsappLink(settings, `Halo ${settings.clinic_name}, saya ingin bertanya tentang layanan ${title}.`)} target="_blank" rel="noreferrer" className="bg-primary text-white font-bold py-3 px-6 rounded-full whitespace-nowrap shadow-md hover:bg-primary-container hover:text-on-primary-container transition-colors">
                  Hubungi Sekarang
                </a>
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
                {services.map(srv => (
                  <Link 
                    key={srv.slug}
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
