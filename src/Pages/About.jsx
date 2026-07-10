import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';
import HeroSliderBackground from '../Components/HeroSliderBackground';

const defaultHeroImages = [
  "https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2000&auto=format&fit=crop"
];

const About = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
      el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
      observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const [heroImages, setHeroImages] = useState(defaultHeroImages);
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_BASE_URL + '/api/sliders/about');
        if (res.data && res.data.length > 0) {
          setHeroImages(res.data.map(s => import.meta.env.VITE_API_BASE_URL + s.image_path));
        }
      } catch (e) {
        console.error('Failed to fetch about sliders', e);
      }
    };
    fetchSliders();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <HeroSliderBackground images={heroImages} overlayClassName="bg-primary/20 backdrop-brightness-75" />
        <div className="relative z-10 text-center px-gutter max-w-4xl transition-all duration-700 opacity-100 translate-y-0">
          <span className="material-symbols-outlined text-white/70 text-6xl drop-shadow-md mb-4">groups</span>
          <h1 className="font-headline-xl text-headline-xl text-white mb-4 md:font-headline-xl md:text-headline-xl sm:font-headline-xl-mobile sm:text-headline-xl-mobile">Tentang Kami</h1>
          <p className="font-body-lg text-body-lg text-white/90">Berdedikasi untuk memberikan layanan kesehatan yang prima bagi keluarga Anda sejak hari pertama.</p>
        </div>
      </section>

      {/* Sejarah Singkat */}
      <section className="py-section-gap px-gutter max-w-container-max mx-auto">
        <div className="animate-on-scroll grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square rounded-xl overflow-hidden shadow-xl">
              <img 
                alt="Sejarah Klinik" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeWbNaMxuL6CSnqNKpslOKFneuZB-FAXBDPeVR12DsjhHTxkpIGLpFBxhdIevn8jP3YZJEnYrLXIHVUWC5RdGHDtNw5U2wXoYt1kD3Bg9nWEbaltA2cjtd9fJHZQcY_SICxLYY6r0NM7QdWLVPYR4gJ25GNf3kU1lQOXdj-8ZZjIz6kPnJ7hp__ziDDRHnqb_T6uq_pExCaojRx7pUhmQBG1YcpXKe1P1FRsu0yy8nhOb296w4Zqa4" 
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary-container text-on-primary-container p-8 rounded-xl shadow-lg hidden md:block max-w-xs">
              <span className="material-symbols-outlined text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
              <p className="font-label-md">Pelayanan berorientasi pasien dengan standar profesionalitas tinggi.</p>
            </div>
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Sejarah Singkat</h2>
            <div className="space-y-4 text-on-surface-variant font-body-md text-body-md leading-relaxed">
              <p>Klinik Pondok Medika didirikan dengan satu tujuan utama: menghadirkan layanan kesehatan berkualitas tinggi yang dapat diakses oleh seluruh lapisan masyarakat. Kami memahami bahwa kesehatan adalah aset paling berharga, itulah sebabnya kami berkomitmen untuk terus berinovasi.</p>
              <p>Dengan semangat profesionalitas dan dedikasi penuh, kami telah berkembang menjadi mitra kesehatan tepercaya bagi komunitas sekitar. Setiap langkah perjalanan kami didorong oleh keinginan untuk memberikan kenyamanan, ketenangan, dan kesembuhan bagi setiap pasien yang melangkah melewati pintu kami.</p>
            </div>
            <div className="mt-8 flex gap-4">
              <div className="bg-surface-container p-4 rounded-xl flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                <div>
                  <h4 className="font-bold">Terakreditasi</h4>
                  <p className="text-xs">Standar Pelayanan Nasional</p>
                </div>
              </div>
              <div className="bg-surface-container p-4 rounded-xl flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">groups</span>
                <div>
                  <h4 className="font-bold">Tim Ahli</h4>
                  <p className="text-xs">Dokter Berpengalaman</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi Bento Grid */}
      <section className="bg-surface-container-low py-section-gap">
        <div className="animate-on-scroll px-gutter max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-primary">Visi &amp; Misi</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto mt-2">Fondasi kami dalam melayani kesehatan masyarakat dengan sepenuh hati.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Vision Card (Large) */}
            <div className="md:col-span-12 lg:col-span-5 bg-primary text-on-primary p-10 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
              </div>
              <div className="relative z-10">
                <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">Visi Kami</span>
                <h3 className="font-headline-lg text-headline-lg mb-4">"Mewujudkan Klinik Pratama Pondok Medika sebagai fasilitas pelayanan kesehatan yang profesional dan bermutu."</h3>
              </div>
              <div className="relative z-10 pt-8 border-t border-white/20">
                <p className="font-body-md opacity-80 italic">Kami bercita-cita menjadi mercusuar kesehatan yang memberikan harapan dan kepastian bagi setiap individu.</p>
              </div>
            </div>
            {/* Mission Cards */}
            <div className="md:col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-secondary">
                <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-2 text-secondary">SDM Berkualitas</h4>
                <p className="text-on-surface-variant text-body-md">Meningkatkan kualitas Sumber Daya Manusia secara berkesinambungan melalui pelatihan dan pengembangan profesional.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-primary">
                <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">medical_services</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-2 text-primary">Pelayanan Paripurna</h4>
                <p className="text-on-surface-variant text-body-md">Memberikan pelayanan kesehatan yang menyeluruh, terintegrasi, dan tetap terjangkau bagi masyarakat.</p>
              </div>
              <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-tertiary">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-12 h-12 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">biotech</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md mb-2 text-tertiary">Sarana Standar</h4>
                    <p className="text-on-surface-variant text-body-md">Melengkapi sarana dan prasarana medis sesuai standar kesehatan nasional untuk menjamin akurasi dan keselamatan pasien.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lokasi Section */}
      <section className="py-section-gap px-gutter max-w-container-max mx-auto">
        <div className="animate-on-scroll flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Lokasi Kami</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <div>
                  <h3 className="font-bold text-lg">Klinik Pondok Medika</h3>
                  <p className="text-on-surface-variant">Jl. Raya Pondok Indah No. 123, Jakarta Selatan, 12310</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <div>
                  <h3 className="font-bold text-lg">Jam Operasional</h3>
                  <p className="text-on-surface-variant">Senin - Sabtu: 08.00 - 20.00</p>
                  <p className="text-on-surface-variant">Minggu: Tutup (Kecuali Gawat Darurat)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary">phone_in_talk</span>
                <div>
                  <h3 className="font-bold text-lg">Kontak</h3>
                  <p className="text-on-surface-variant">0812-3416-3128 (WhatsApp)</p>
                </div>
              </div>
            </div>
            <a href="https://wa.me/6281234163128" target="_blank" rel="noreferrer" className="mt-10 w-full md:w-auto bg-whatsapp-green text-white px-8 py-3 rounded-full flex items-center justify-center gap-2 font-bold hover:scale-105 transition-transform inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 fill-current"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.6-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.4-11.3 2.5-2.4 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.5-9.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg> Chat Sekarang
            </a>
          </div>
          <div className="md:w-2/3">
            <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-lg bg-surface-dim relative group">
              <iframe
                title="Peta Lokasi Klinik Pondok Medika"
                src="https://maps.google.com/maps?q=-6.1438498,106.722549&t=m&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
