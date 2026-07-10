import React, { useEffect, useRef, useState } from 'react';
import { MdLocalHospital, MdSchedule, MdLocationOn, MdCall, MdFamilyRestroom, MdMedicalServices, MdAir, MdHomeWork } from 'react-icons/md';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DoctorCard from '../Components/DoctorCard';
import Layout from '../Components/Layout';
import HeroSliderBackground from '../Components/HeroSliderBackground';
import { doctorsData, calculateStatus } from '../data/doctors';

const defaultHeroImages = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop"
];

const Home = () => {
  const observerRef = useRef(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Scroll Animation Observer
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8', 'animate-in');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observerRef.current.observe(el));

    // Dynamic Doctors Status
    const updateStatuses = () => {
      const updatedDoctors = doctorsData.map(doc => ({
        ...doc,
        status: calculateStatus(doc.scheduleDetails)
      }));
      setDoctors(updatedDoctors);
    };

    updateStatuses();
    const intervalId = setInterval(updateStatuses, 60000);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  const [heroImages, setHeroImages] = useState(defaultHeroImages);
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_BASE_URL + '/api/sliders/home');
        if (res.data && res.data.length > 0) {
          setHeroImages(res.data.map(s => import.meta.env.VITE_API_BASE_URL + s.image_path));
        }
      } catch (e) {
        console.error('Failed to fetch home sliders', e);
      }
    };
    fetchSliders();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center transition-all duration-1000 opacity-0 translate-y-8 animate-in animate-on-scroll">
        <HeroSliderBackground images={heroImages} overlayClassName="hero-overlay" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-gutter grid lg:grid-cols-2 gap-12">
          <div className="space-y-6 text-white animate-fade-in-up">
            <MdLocalHospital className="text-white/70 text-6xl drop-shadow-md" />
            <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl leading-tight text-white drop-shadow-md">
              Pelayanan Medis Profesional &amp; Terpercaya untuk Keluarga Anda
            </h1>
            <p className="font-body-lg text-body-lg text-white/90 max-w-xl">
              Klinik Pondok Medika hadir dengan tenaga medis kompeten dan fasilitas modern untuk memastikan kesehatan Anda dan keluarga selalu terjaga dengan standar terbaik.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-container-max px-gutter z-20">
          <div className="bg-white rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant overflow-hidden w-full">
            <div className="py-10 px-8 flex items-start gap-4">
              <div className="bg-primary-container/20 p-3 rounded-full text-primary">
                <MdSchedule />
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-primary uppercase tracking-wider mb-1">Jam Operasional</p>
                <p className="font-headline-md text-headline-md text-on-surface">13.00 - 21.00</p>
                <p className="font-body-md text-body-md text-text-muted">Setiap Hari Senin - Sabtu</p>
              </div>
            </div>
            <div className="py-10 px-8 flex items-start gap-4">
              <a href="https://maps.app.goo.gl/WGtwVHvWx3nsRLeR8" target="_blank" rel="noreferrer" className="flex items-start gap-4 w-full h-full">
                <div className="bg-secondary-container/20 p-3 rounded-full text-secondary">
                  <MdLocationOn />
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Lokasi</p>
                  <p className="font-headline-md text-headline-md text-on-surface">Klinik Pondok Medika</p>
                  <p className="font-body-md text-body-md text-text-muted">Jakarta Selatan, Indonesia</p>
                </div>
              </a>
            </div>
            <div className="py-10 px-8 flex items-start gap-4">
              <div className="bg-tertiary-container/20 p-3 rounded-full text-tertiary">
                <MdCall />
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider mb-1">Hubungi Kami</p>
                <p className="font-headline-md text-headline-md text-on-surface">0812-3416-3128</p>
                <p className="font-body-md text-body-md text-text-muted">WhatsApp &amp; Telepon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Unggulan Section */}
      <section className="mt-40 md:mt-48 mb-section-gap w-full max-w-container-max mx-auto px-gutter transition-all duration-1000 opacity-0 translate-y-8 animate-in animate-on-scroll">
        <div className="text-center mb-16 space-y-4">
          <span className="font-label-md text-label-md text-primary bg-primary/10 px-4 py-1 rounded-full uppercase tracking-widest">Solusi Kesehatan</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Layanan Unggulan Kami</h2>
          <p className="font-body-lg text-body-lg text-text-muted max-w-2xl mx-auto">Kami menyediakan berbagai layanan medis berkualitas tinggi yang didukung oleh tenaga profesional dan teknologi medis terkini.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center">
            <div className="bg-primary-container text-on-primary-container w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6">
              <MdFamilyRestroom className="text-[32px]" />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Pemeriksaan Anak &amp; Dewasa</h3>
            <p className="font-body-md text-body-md text-text-muted">Konsultasi medis menyeluruh untuk segala usia dengan pendekatan yang personal.</p>
          </div>
          <div className="group bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center">
            <div className="bg-secondary-container text-on-secondary-container w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6">
              <MdMedicalServices className="text-[32px]" />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Bedah Minor</h3>
            <p className="font-body-md text-body-md text-text-muted">Tindakan bedah kecil yang dilakukan dengan aman, steril, dan pemulihan cepat.</p>
          </div>
          <div className="group bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center">
            <div className="bg-tertiary-container text-on-tertiary-container w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6">
              <MdAir className="text-[32px]" />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Nebulizer</h3>
            <p className="font-body-md text-body-md text-text-muted">Layanan uap untuk membantu pernapasan pada pasien dengan gangguan respirasi.</p>
          </div>
          <div className="group bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center">
            <div className="bg-surface-container-highest text-on-surface-variant w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6">
              <MdHomeWork className="text-[32px]" />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Home Visit</h3>
            <p className="font-body-md text-body-md text-text-muted">Kunjungan medis ke rumah Anda untuk kenyamanan ekstra dalam perawatan kesehatan.</p>
          </div>
        </div>
      </section>

      {/* Seksi Dokter Kami */}
      <section className="bg-surface-container-low py-section-gap transition-all duration-1000 opacity-0 translate-y-8 animate-in animate-on-scroll">
        <div className="w-full max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl space-y-4">
              <span className="font-label-md text-label-md text-secondary bg-secondary/10 px-4 py-1 rounded-full uppercase tracking-widest">Tenaga Ahli</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Bertemu dengan Dokter Spesialis Kami</h2>
              <p className="font-body-lg text-body-lg text-text-muted">Dipandu oleh dokter-dokter berpengalaman yang berdedikasi tinggi terhadap kesehatan pasien.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {doctors.map((doc, idx) => (
              <DoctorCard key={idx} doctor={doc} />
            ))}
          </div>
        </div>
      </section>

      {/* Seksi Partner Kami */}
      <section className="py-24 bg-white overflow-hidden transition-all duration-1000 opacity-0 translate-y-8 animate-in animate-on-scroll">
        <div className="w-full max-w-container-max mx-auto px-gutter text-center mb-12">
          <h2 className="font-headline-md text-headline-md text-text-muted opacity-70">Rekan Medis &amp; Institusi Kami</h2>
        </div>
        <div className="flex whitespace-nowrap gap-16 items-center px-gutter py-8 animate-scroll grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Puskesmas Cengkareng</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Klinik laboratorium bioprima</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Rajak hospital</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Permata Indah medical center cengkareng</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Laboratorium klinik bio medika</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Ciputra Hospital Citra Garden City</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">PT Impian Profesi Internasional</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Pt Arah environmental indonesia</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Pt Mitra bestari teknologi</div>
          {/* Duplicate for seamless scroll */}
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Puskesmas Cengkareng</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Klinik laboratorium bioprima</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Rajak hospital</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Permata Indah medical center cengkareng</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Laboratorium klinik bio medika</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Ciputra Hospital Citra Garden City</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">PT Impian Profesi Internasional</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Pt Arah environmental indonesia</div>
          <div className="flex-none text-2xl font-bold text-on-surface-variant font-headline-md">Pt Mitra bestari teknologi</div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
