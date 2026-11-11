import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import Layout from '../Components/Layout';
import HeroSliderBackground from '../Components/HeroSliderBackground';
import ServiceIcon from '../Components/ServiceIcon';
import { useServices, useSiteSettings } from '../Contexts/SiteSettingsContext';
import { localArea, pageServices } from '../seo/meta';

const Services = () => {
  const settings = useSiteSettings();
  const { services, status, reload } = useServices();
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_BASE_URL + '/api/sliders/services')
      .then((res) => {
        if (res.data?.length) setHeroImages(res.data.map((s) => import.meta.env.VITE_API_BASE_URL + s.image_path));
      })
      .catch(() => {});
  }, []);

  // Layanan yang ditonjolkan di CMS tampil paling atas; sisanya sesuai urutan CMS
  const list = pageServices(services);
  const featured = list.find((x) => x.is_featured) || list[0];
  const others = list.filter((x) => x !== featured);

  return (
    <Layout>
      <section className="relative min-h-[360px] md:min-h-[440px] flex items-end">
        <HeroSliderBackground images={heroImages} overlayClassName="hero-overlay" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-gutter py-12">
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile md:font-headline-xl md:text-headline-xl text-white mb-3">Layanan Klinik di {localArea(settings)}</h1>
          <p className="font-body-lg text-body-lg text-white max-w-2xl">Poli, pemeriksaan penunjang, dan apotek di {settings.clinic_name}. Pilih layanan untuk melihat alur pemeriksaannya.</p>
        </div>
      </section>

      <section className="py-section-gap px-gutter bg-surface-container-low">
        <div className="max-w-container-max mx-auto space-y-6">
          {status === 'error' && (
            <div className="bg-white rounded-xl p-6 flex flex-wrap items-center gap-4" role="alert">
              <p className="text-on-surface flex-1 min-w-[200px]">Daftar layanan terbaru gagal dimuat, yang tampil mungkin belum diperbarui.</p>
              <button type="button" onClick={reload} className="min-h-[44px] px-5 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary/90">Muat ulang layanan</button>
            </div>
          )}

          {list.length === 0 && status !== 'loading' && (
            <p className="text-on-surface-variant">Belum ada layanan yang ditampilkan.</p>
          )}

          {featured && (
            <Link to={`/layanan/${featured.slug}`} className="group grid md:grid-cols-[auto_1fr_auto] items-center gap-6 bg-primary text-white rounded-xl p-8 hover:bg-primary/90 transition-colors">
              <span className="text-white"><ServiceIcon name={featured.icon} className="text-5xl" /></span>
              <div>
                <h2 className="font-headline-lg text-headline-lg text-white mb-2">{featured.title}</h2>
                {featured.summary && <p className="font-body-lg text-body-lg text-white/90 max-w-2xl">{featured.summary}</p>}
              </div>
              <span className="inline-flex items-center gap-2 font-bold underline underline-offset-4 group-hover:no-underline">
                Lihat alur {featured.title} <MdArrowForward aria-hidden="true" />
              </span>
            </Link>
          )}

          {others.length > 0 && (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((service) => (
                <li key={service.slug}>
                  <Link to={`/layanan/${service.slug}`} className="group h-full flex flex-col bg-white rounded-xl p-6 border border-outline-variant/40 hover:border-primary transition-colors">
                    <span className="text-primary mb-4"><ServiceIcon name={service.icon} /></span>
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary">{service.title}</h2>
                    {service.summary && <p className="text-on-surface-variant text-body-md flex-grow">{service.summary}</p>}
                    <span className="mt-5 inline-flex items-center gap-2 font-bold text-primary">
                      Lihat alur layanan <MdArrowForward aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
