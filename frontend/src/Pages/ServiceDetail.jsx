import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useParams, Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import NotFound from './NotFound';
import { useServices, useSiteSettings } from '../Contexts/SiteSettingsContext';
import { localArea, whatsappLink, absoluteUrl, pageServices } from '../seo/meta';

const Section = ({ title, children }) => (
  <div>
    <h3 className="font-heading font-semibold text-xl text-on-surface mb-4">{title}</h3>
    {children}
  </div>
);

const ServiceDetail = () => {
  const { slug } = useParams();
  const settings = useSiteSettings();
  const { services, status } = useServices();

  const list = pageServices(services);
  const service = list.find((x) => x.slug === slug);

  if (!service) {
    if (status === 'loading') {
      return (
        <Layout seo={{ noindex: true }}>
          <p className="min-h-[60vh] max-w-container-max mx-auto px-gutter py-section-gap text-on-surface-variant" role="status">Memuat layanan…</p>
        </Layout>
      );
    }
    return <NotFound title="Layanan Tidak Ditemukan" message="Layanan yang Anda cari tidak tersedia. Silakan lihat daftar layanan kami." />;
  }

  const { title } = service;
  const steps = (service.stages || '').split('\n').map((x) => x.trim()).filter(Boolean);
  const hasDetails = service.background || service.explanation || service.conditions || steps.length > 0;

  return (
    <Layout seo={{
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        name: `${title} – ${settings.clinic_name}`,
        url: absoluteUrl(`/layanan/${slug}`),
        about: { '@type': 'MedicalProcedure', name: title, description: service.explanation || service.summary || undefined },
        provider: { '@id': absoluteUrl('/') + '#klinik' },
      },
    }}>
      <section className="bg-primary py-16 px-gutter">
        <div className="max-w-7xl mx-auto">
          <Link to="/layanan" className="inline-flex items-center gap-2 min-h-[44px] text-white hover:underline mb-4">
            <MdArrowBack className="text-sm" aria-hidden="true" />
            Kembali ke Daftar Layanan
          </Link>
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile md:font-headline-xl md:text-headline-xl text-white mb-4">{title} di {localArea(settings)}</h1>
          <p className="font-body-lg text-white max-w-2xl">
            {service.summary || `Informasi layanan ${title} di ${settings.clinic_name}.`}
          </p>
        </div>
      </section>

      <section className="py-12 px-gutter bg-surface min-h-[60vh]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-10 border-b border-outline-variant/30 pb-4">
              Informasi Pelayanan {title}
            </h2>

            <div className="space-y-12">
              {!hasDetails && (
                <p className="text-on-surface-variant text-lg">Informasi lengkap layanan ini sedang disiapkan. Silakan tanyakan langsung lewat WhatsApp.</p>
              )}

              {service.background && (
                <p className="text-on-surface-variant leading-relaxed text-lg font-medium italic whitespace-pre-line">{service.background}</p>
              )}

              {service.explanation && (
                <Section title="Penjelasan Layanan di Klinik Kami">
                  <p className="text-on-surface-variant leading-relaxed text-lg whitespace-pre-line">{service.explanation}</p>
                </Section>
              )}

              {service.conditions && (
                <Section title="Kondisi Medis Pasien yang Cocok">
                  <p className="text-on-surface-variant leading-relaxed text-lg bg-surface-container-low p-6 rounded-xl border border-outline-variant/20 whitespace-pre-line">{service.conditions}</p>
                </Section>
              )}

              {steps.length > 0 && (
                <Section title="Layanan & Tahapan Pengobatan">
                  <ol className="space-y-4 text-on-surface-variant leading-relaxed text-lg">
                    {steps.map((step, idx) => (
                      <li key={idx} className="flex gap-4 p-4 bg-white rounded-lg border border-outline-variant/20">
                        <span className="font-bold text-primary flex-shrink-0">{idx + 1}.</span>
                        <span>{step.replace(/^\d+\.\s*/, '')}</span>
                      </li>
                    ))}
                  </ol>
                </Section>
              )}

              <div className="bg-primary/5 p-8 rounded-xl border border-primary/20 flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                  <h3 className="font-bold text-xl text-primary mb-3">Lokasi Pelayanan & Kontak</h3>
                  <p className="text-on-surface-variant leading-relaxed whitespace-pre-line text-lg font-medium">
                    {service.location_note || settings.clinic_name}{'\n'}Telp/WhatsApp: {settings.phone}
                  </p>
                </div>
                <a
                  href={whatsappLink(settings, `Halo ${settings.clinic_name}, saya ingin bertanya tentang layanan ${title}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center min-h-[48px] bg-whatsapp-green text-on-whatsapp font-bold px-6 rounded-full text-center hover:brightness-95 active:brightness-90 transition"
                >
                  Tanya {title} via WhatsApp
                </a>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-outline-variant/40 overflow-hidden sticky top-24">
              <div className="p-5 border-b border-outline-variant/30 bg-surface-container-lowest">
                <h2 className="font-bold text-lg text-primary">Layanan Lainnya</h2>
              </div>
              <nav aria-label="Layanan lainnya" className="flex flex-col">
                {list.map((srv) => (
                  <Link
                    key={srv.slug}
                    to={`/layanan/${srv.slug}`}
                    aria-current={srv.slug === slug ? 'page' : undefined}
                    className={`p-4 border-b border-outline-variant/20 last:border-0 hover:bg-primary/5 transition-colors text-sm font-medium ${srv.slug === slug ? 'bg-primary/10 text-primary border-l-4 border-l-primary font-bold' : 'text-on-surface-variant border-l-4 border-l-transparent hover:text-primary'}`}
                  >
                    {srv.title}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
