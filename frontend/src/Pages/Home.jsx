import React, { useEffect, useState } from 'react';
import { MdSchedule, MdLocationOn, MdCall, MdFamilyRestroom, MdMedicalServices, MdAir, MdHomeWork, MdArrowForward } from 'react-icons/md';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DoctorCard from '../Components/DoctorCard';
import Layout from '../Components/Layout';
import HeroSliderBackground from '../Components/HeroSliderBackground';
import FacilitiesSection from '../Components/Home/FacilitiesSection';
import ArticleHighlightSection from '../Components/Home/ArticleHighlightSection';
import { doctorsData, calculateStatus } from '../data/doctors';
import { useSiteSettings } from '../Contexts/SiteSettingsContext';
import { localArea, openingDaysText, hoursText, whatsappLink } from '../seo/meta';

// Nama institusi mitra. Belum diverifikasi (temuan audit #5), ditampilkan apa adanya.
const partners = [
  'Puskesmas Cengkareng',
  'Klinik laboratorium bioprima',
  'Rajak hospital',
  'Permata Indah medical center cengkareng',
  'Laboratorium klinik bio medika',
  'Ciputra Hospital Citra Garden City',
  'PT Impian Profesi Internasional',
  'Pt Arah environmental indonesia',
  'Pt Mitra bestari teknologi',
];

// Layanan pendukung di Beranda (temuan audit #6: perlu konfirmasi ketersediaan).
const otherServices = [
  { icon: MdMedicalServices, title: 'Bedah Minor', text: 'Tindakan bedah kecil yang dilakukan dengan aman, steril, dan pemulihan cepat.' },
  { icon: MdAir, title: 'Nebulizer', text: 'Layanan uap untuk membantu pernapasan pada pasien dengan gangguan respirasi.' },
  { icon: MdHomeWork, title: 'Home Visit', text: 'Kunjungan medis ke rumah Anda untuk kenyamanan ekstra dalam perawatan kesehatan.' },
];

const Home = () => {
  const settings = useSiteSettings();
  const [doctors, setDoctors] = useState([]);
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    const updateStatuses = () => {
      setDoctors(doctorsData.map((doc) => ({ ...doc, status: calculateStatus(doc.scheduleDetails) })));
    };
    updateStatuses();
    const intervalId = setInterval(updateStatuses, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_BASE_URL + '/api/sliders/home')
      .then((res) => {
        if (res.data?.length) setHeroImages(res.data.map((s) => import.meta.env.VITE_API_BASE_URL + s.image_path));
      })
      .catch(() => {});
  }, []);

  const waBooking = whatsappLink(settings, `Halo ${settings.clinic_name}, saya ingin mendaftar untuk berobat.`);

  return (
    <Layout>
      {/* Hero: satu fokus, yaitu mendaftar via WhatsApp */}
      <section className="relative md:min-h-[600px] md:flex md:items-center pt-12 md:pt-16 pb-10 md:pb-40">
        <HeroSliderBackground images={heroImages} overlayClassName="hero-overlay" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-gutter">
          <div className="max-w-2xl space-y-6 text-white">
            <h1 className="font-headline-xl-mobile text-headline-xl-mobile md:font-headline-xl md:text-headline-xl text-white">
              Klinik keluarga di {localArea(settings)}
            </h1>
            <p className="font-body-lg text-body-lg text-white">
              Dokter umum, dokter gigi, dan layanan kesehatan ibu &amp; anak di {settings.kelurahan ? `${settings.kelurahan}, ` : ''}Kecamatan {settings.kecamatan}.
              Daftar lewat WhatsApp, lalu datang sesuai jadwal praktik.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                id="hero-cta"
                href={waBooking}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 min-h-[48px] bg-whatsapp-green text-on-whatsapp font-bold px-6 rounded-full hover:brightness-95 active:brightness-90 transition"
              >
                Daftar berobat via WhatsApp
              </a>
              <a href="#dokter" className="inline-flex items-center min-h-[48px] px-2 font-bold text-white underline underline-offset-4 hover:no-underline">
                Lihat jadwal dokter
              </a>
            </div>
          </div>
        </div>

        {/* Info praktis: satu-satunya kartu melayang, menyambung hero ke konten */}
        <div className="relative mt-10 md:mt-0 md:absolute md:bottom-0 md:left-1/2 md:-translate-x-1/2 md:translate-y-1/2 w-full max-w-container-max mx-auto px-gutter z-20">
          <div className="bg-white rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant overflow-hidden">
            <div className="py-6 px-6 md:py-8 flex items-start gap-4">
              <MdSchedule className="text-primary text-2xl mt-1 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-label-md text-label-md text-primary mb-1">Jam buka</p>
                <p className="font-headline-md text-headline-md text-on-surface">{hoursText(settings)}</p>
                <p className="font-body-md text-body-md text-text-muted">{openingDaysText(settings)}</p>
              </div>
            </div>
            <a href={settings.maps_url} target="_blank" rel="noreferrer" className="py-6 px-6 md:py-8 flex items-start gap-4 hover:bg-surface-container-low transition-colors">
              <MdLocationOn className="text-primary text-2xl mt-1 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-label-md text-label-md text-primary mb-1">Lokasi</p>
                <p className="font-headline-md text-headline-md text-on-surface">{settings.clinic_name}</p>
                <p className="font-body-md text-body-md text-text-muted">{[settings.kelurahan, settings.kecamatan, settings.city].filter(Boolean).join(', ')}</p>
              </div>
            </a>
            <a href={waBooking} target="_blank" rel="noreferrer" className="py-6 px-6 md:py-8 flex items-start gap-4 hover:bg-surface-container-low transition-colors">
              <MdCall className="text-primary text-2xl mt-1 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-label-md text-label-md text-primary mb-1">WhatsApp &amp; telepon</p>
                <p className="font-headline-md text-headline-md text-on-surface">{settings.phone}</p>
                <p className="font-body-md text-body-md text-text-muted">Pendaftaran &amp; pertanyaan</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Layanan: satu layanan utama ditonjolkan, sisanya daftar ringkas */}
      <section className="mt-14 md:mt-40 mb-section-gap w-full max-w-container-max mx-auto px-gutter">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Layanan Unggulan Kami</h2>
            <p className="font-body-lg text-body-lg text-text-muted mt-3">Pilih layanan untuk melihat alur pemeriksaan dan cara mendaftar.</p>
          </div>
          <Link to="/layanan" className="inline-flex items-center gap-2 min-h-[44px] font-bold text-primary hover:underline">
            Semua layanan klinik <MdArrowForward aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Link to="/layanan/poli-umum" className="lg:col-span-2 group bg-primary text-white rounded-xl p-8 flex flex-col hover:bg-primary/90 transition-colors">
            <MdFamilyRestroom className="text-5xl mb-6 text-white" aria-hidden="true" />
            <h3 className="font-headline-lg text-headline-lg text-white mb-3">Pemeriksaan Anak &amp; Dewasa</h3>
            <p className="font-body-lg text-body-lg text-white/90 mb-8">Konsultasi medis menyeluruh untuk segala usia dengan pendekatan yang personal.</p>
            <span className="mt-auto inline-flex items-center gap-2 font-bold underline underline-offset-4 group-hover:no-underline">
              Lihat alur Poli Umum <MdArrowForward aria-hidden="true" />
            </span>
          </Link>
          <ul className="lg:col-span-3 divide-y divide-outline-variant/60 border-y border-outline-variant/60">
            {otherServices.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-5 py-6">
                <Icon className="text-3xl text-primary shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{title}</h3>
                  <p className="font-body-md text-body-md text-text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Dokter */}
      <section id="dokter" className="bg-surface-container-low py-section-gap scroll-mt-20">
        <div className="w-full max-w-container-max mx-auto px-gutter">
          <div className="max-w-2xl mb-12">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Bertemu dengan Dokter Spesialis Kami</h2>
            <p className="font-body-lg text-body-lg text-text-muted mt-3">Status praktik diperbarui otomatis sesuai jam WIB. Cek jadwal sebelum datang.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {doctors.map((doc) => (
              <DoctorCard key={doc.name} doctor={doc} />
            ))}
          </div>
        </div>
      </section>

      <FacilitiesSection />

      {/* Mitra: daftar statis, tanpa animasi berjalan */}
      <section className="py-14 bg-white border-y border-outline-variant/40">
        <div className="w-full max-w-container-max mx-auto px-gutter grid lg:grid-cols-4 gap-6 items-start">
          <h2 className="font-headline-md text-headline-md text-on-surface">Rekan Medis &amp; Institusi Kami</h2>
          <ul className="lg:col-span-3 flex flex-wrap gap-x-8 gap-y-3 text-on-surface-variant font-body-md">
            {partners.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </div>
      </section>

      <ArticleHighlightSection />
    </Layout>
  );
};

export default Home;
