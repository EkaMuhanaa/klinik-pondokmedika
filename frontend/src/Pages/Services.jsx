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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <HeroSliderBackground images={heroImages} overlayClassName="bg-primary/20 backdrop-brightness-75" />
        <div className="relative z-10 text-center px-gutter max-w-4xl transition-all duration-700 opacity-100 translate-y-0 animate-fade-in-up">
          <MdMedicalServices className="text-white/70 text-6xl drop-shadow-md mx-auto mb-4" />
          <h1 className="font-headline-xl text-headline-xl text-white mb-4 md:font-headline-xl md:text-headline-xl sm:font-headline-xl-mobile sm:text-headline-xl-mobile">Layanan Klinik di {localArea(settings)}</h1>
          <p className="font-body-lg text-body-lg text-white/90">Katalog komprehensif seluruh poli, tindakan medis, dan fasilitas penunjang untuk kesehatan Anda.</p>
        </div>
      </section>

      {/* Services Catalog */}
      <section className="py-section-gap px-gutter bg-surface-container-low min-h-screen">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-primary">Layanan Unggulan Kami</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto mt-2">Klinik Pondok Medika menghadirkan berbagai layanan kesehatan terpadu dalam satu atap untuk kenyamanan maksimal pasien.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={service.slug} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group border border-outline-variant/30 hover:border-primary/30 flex flex-col h-full animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {serviceIcons[service.slug] || <MdMedicalServices className="text-4xl" />}
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-on-surface-variant text-body-md flex-grow leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-6 pt-6 border-t border-outline-variant/50">
                  <Link to={`/layanan/${service.slug}`} className="text-primary font-label-md font-bold flex items-center gap-2 hover:gap-3 transition-all inline-flex">
                    Selengkapnya <MdArrowForward className="text-sm" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
