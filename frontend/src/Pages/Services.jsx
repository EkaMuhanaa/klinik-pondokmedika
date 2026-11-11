import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import HeroSliderBackground from '../Components/HeroSliderBackground';
import { services } from '../data/services';
import { useSiteSettings } from '../Contexts/SiteSettingsContext';
import { localArea } from '../seo/meta';
import { MdMedicalServices, MdArrowForward, MdLocalHospital, MdOutlineHealthAndSafety, MdChildCare, MdScience, MdLocalPharmacy, MdEmergency } from 'react-icons/md';

// Gambar hero diatur admin di CMS → Kelola Latar / Slider. Jika kosong, tampil latar warna brand.
const defaultHeroImages = [];

const serviceIcons = {
  'poli-umum': <MdLocalHospital className="text-4xl" />,
  'poli-gigi-mulut': <MdOutlineHealthAndSafety className="text-4xl" />,
  'poli-kia': <MdChildCare className="text-4xl" />,
  'laboratorium': <MdScience className="text-4xl" />,
  'apotek-24-jam': <MdLocalPharmacy className="text-4xl" />,
  'unit-gawat-darurat': <MdEmergency className="text-4xl" />,
};

const Services = () => {
  const settings = useSiteSettings();
  const [heroImages, setHeroImages] = useState(defaultHeroImages);
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_BASE_URL + '/api/sliders/services');
        if (res.data && res.data.length > 0) {
          setHeroImages(res.data.map(s => import.meta.env.VITE_API_BASE_URL + s.image_path));
        }
      } catch (e) {
        console.error('Failed to fetch services sliders', e);
      }
    };
    fetchSliders();
  }, []);

  const [featured, ...others] = services;

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
          {/* Poli Umum sebagai pintu masuk utama pasien, ditonjolkan */}
          <Link to={`/layanan/${featured.slug}`} className="group grid md:grid-cols-[auto_1fr_auto] items-center gap-6 bg-primary text-white rounded-xl p-8 hover:bg-primary/90 transition-colors">
            <span className="text-white" aria-hidden="true">{serviceIcons[featured.slug]}</span>
            <div>
              <h2 className="font-headline-lg text-headline-lg text-white mb-2">{featured.title}</h2>
              <p className="font-body-lg text-body-lg text-white/90 max-w-2xl">{featured.description}</p>
            </div>
            <span className="inline-flex items-center gap-2 font-bold underline underline-offset-4 group-hover:no-underline">
              Lihat alur {featured.title} <MdArrowForward aria-hidden="true" />
            </span>
          </Link>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((service) => (
              <li key={service.slug}>
                <Link to={`/layanan/${service.slug}`} className="group h-full flex flex-col bg-white rounded-xl p-6 border border-outline-variant/40 hover:border-primary transition-colors">
                  <span className="text-primary mb-4" aria-hidden="true">{serviceIcons[service.slug] || <MdMedicalServices className="text-4xl" />}</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary">{service.title}</h2>
                  <p className="text-on-surface-variant text-body-md flex-grow">{service.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-bold text-primary">
                    Lihat alur layanan <MdArrowForward aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
