import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import HeroSliderBackground from '../Components/HeroSliderBackground';

const defaultHeroImages = [
  "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop"
];

const services = [
  {
    title: "Poli Umum",
    slug: "poli-umum",
    description: "Layanan pemeriksaan kesehatan umum, konsultasi medis, dan penanganan penyakit akut maupun kronis oleh dokter umum profesional.",
    icon: "stethoscope"
  },
  {
    title: "Poli Gigi & Mulut",
    slug: "poli-gigi-mulut",
    description: "Perawatan kesehatan gigi menyeluruh, mulai dari pembersihan karang gigi, pencabutan, hingga perawatan saluran akar.",
    icon: "dentistry"
  },
  {
    title: "Poli KIA (Kesehatan Ibu & Anak)",
    slug: "poli-kia",
    description: "Pemeriksaan kehamilan, imunisasi dasar, tumbuh kembang anak, dan konsultasi laktasi untuk kesehatan optimal ibu dan buah hati.",
    icon: "child_care"
  },
  {
    title: "Laboratorium",
    slug: "laboratorium",
    description: "Fasilitas pemeriksaan penunjang diagnostik lengkap dengan peralatan modern untuk hasil yang cepat dan akurat.",
    icon: "science"
  },
  {
    title: "Apotek 24 Jam",
    slug: "apotek-24-jam",
    description: "Ketersediaan obat-obatan berkualitas dan alat kesehatan yang lengkap, siap melayani resep dokter setiap saat.",
    icon: "local_pharmacy"
  },
  {
    title: "Unit Gawat Darurat",
    slug: "unit-gawat-darurat",
    description: "Penanganan pertama kasus kegawatdaruratan medis dengan tim yang sigap dan peralatan resusitasi standar.",
    icon: "emergency"
  }
];

const Services = () => {
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
          <span className="material-symbols-outlined text-white/70 text-6xl drop-shadow-md mb-4">medical_services</span>
          <h1 className="font-headline-xl text-headline-xl text-white mb-4 md:font-headline-xl md:text-headline-xl sm:font-headline-xl-mobile sm:text-headline-xl-mobile">Layanan &amp; Fasilitas</h1>
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
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group border border-outline-variant/30 hover:border-primary/30 flex flex-col h-full animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{service.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-on-surface-variant text-body-md flex-grow leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-6 pt-6 border-t border-outline-variant/50">
                  <Link to={`/layanan/${service.slug}`} className="text-primary font-label-md font-bold flex items-center gap-2 hover:gap-3 transition-all inline-flex">
                    Selengkapnya <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
