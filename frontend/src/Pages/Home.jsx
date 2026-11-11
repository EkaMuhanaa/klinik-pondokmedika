import React, { useCallback, useEffect, useState } from 'react';
import { MdSchedule, MdLocationOn, MdCall, MdArrowForward } from 'react-icons/md';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DoctorCard from '../Components/DoctorCard';
import Layout from '../Components/Layout';
import HeroSliderBackground from '../Components/HeroSliderBackground';
import FacilitiesSection from '../Components/Home/FacilitiesSection';
import ArticleHighlightSection from '../Components/Home/ArticleHighlightSection';
import ServiceIcon from '../Components/ServiceIcon';
import { calculateStatus } from '../data/doctorStatus';
import { mediaUrl, useServices, useSiteSettings } from '../Contexts/SiteSettingsContext';
import { localArea, openingDaysText, hoursText, whatsappLink } from '../seo/meta';

const lines = (text) => (text || '').split('\n').map((x) => x.trim()).filter(Boolean);

const Home = () => {
  const settings = useSiteSettings();
  const { services } = useServices();
  const [doctorRows, setDoctorRows] = useState([]);
  const [doctorStatus, setDoctorStatus] = useState('loading'); // loading | error | ready
  const [now, setNow] = useState(Date.now());
  const [heroImages, setHeroImages] = useState([]);

  const loadDoctors = useCallback(() => {
    setDoctorStatus('loading');
    axios.get('/doctors')
      .then((res) => { setDoctorRows(res.data); setDoctorStatus('ready'); })
      .catch(() => setDoctorStatus('error'));
  }, []);

  useEffect(() => {
    loadDoctors();
    // Status praktik dihitung ulang tiap menit
    const intervalId = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(intervalId);
  }, [loadDoctors]);

  const doctors = doctorRows.map((doc) => ({
    ...doc,
    image: doc.photo_path ? mediaUrl(doc.photo_path) : '/images/placeholder-dokter.svg',
    photoPending: !doc.photo_path,
    scheduleDetails: doc.schedule || [],
    status: calculateStatus(doc.schedule || [], now),
  }));

  // Layanan Beranda diatur di CMS (centang "Tampil di Beranda" dan "Tonjolkan")
  const homeServices = services.filter((x) => x.show_on_home);
  const featured = homeServices.find((x) => x.is_featured) || homeServices[0];
  const otherServices = homeServices.filter((x) => x !== featured);
  const partners = lines(settings.partners);

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
          {featured && (
            <Link to={featured.is_active ? `/layanan/${featured.slug}` : '/layanan'} className="lg:col-span-2 group bg-primary text-white rounded-xl p-8 flex flex-col hover:bg-primary/90 transition-colors">
              <ServiceIcon name={featured.icon} className="text-5xl mb-6 text-white" />
              <h3 className="font-headline-lg text-headline-lg text-white mb-3">{featured.title}</h3>
              {featured.summary && <p className="font-body-lg text-body-lg text-white/90 mb-8">{featured.summary}</p>}
              <span className="mt-auto inline-flex items-center gap-2 font-bold underline underline-offset-4 group-hover:no-underline">
                {featured.is_active ? `Lihat alur ${featured.title}` : 'Lihat semua layanan'} <MdArrowForward aria-hidden="true" />
              </span>
            </Link>
          )}
          <ul className="lg:col-span-3 divide-y divide-outline-variant/60 border-y border-outline-variant/60">
            {otherServices.map((svc) => (
              <li key={svc.slug} className="flex gap-5 py-6">
                <ServiceIcon name={svc.icon} className="text-3xl text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-1">
                    {svc.is_active ? <Link to={`/layanan/${svc.slug}`} className="inline-flex items-center min-h-[44px] hover:text-primary hover:underline underline-offset-4">{svc.title}</Link> : svc.title}
                  </h3>
                  {svc.summary && <p className="font-body-md text-body-md text-text-muted">{svc.summary}</p>}
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
            <h2 className="font-headline-lg text-headline-lg text-on-surface">{settings.doctors_heading}</h2>
            {settings.doctors_intro && <p className="font-body-lg text-body-lg text-text-muted mt-3">{settings.doctors_intro}</p>}
          </div>
          {doctorStatus === 'loading' && <p className="text-on-surface-variant" role="status">Memuat jadwal dokter…</p>}
          {doctorStatus === 'error' && (
            <div className="bg-white rounded-xl p-6 max-w-2xl" role="alert">
              <p className="text-on-surface font-medium mb-4">Jadwal dokter gagal dimuat. Periksa koneksi internet Anda, lalu coba lagi.</p>
              <button type="button" onClick={loadDoctors} className="min-h-[44px] px-5 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary/90">Muat ulang jadwal</button>
            </div>
          )}
          {doctorStatus === 'ready' && doctors.length === 0 && (
            <p className="text-on-surface-variant">Jadwal dokter sedang diperbarui. Hubungi kami via WhatsApp untuk informasi praktik.</p>
          )}
          {doctors.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {doctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          )}
        </div>
      </section>

      <FacilitiesSection />

      {/* Mitra: daftar statis dari CMS, tanpa animasi berjalan */}
      {partners.length > 0 && <section className="py-14 bg-white border-y border-outline-variant/40">
        <div className="w-full max-w-container-max mx-auto px-gutter grid lg:grid-cols-4 gap-6 items-start">
          <h2 className="font-headline-md text-headline-md text-on-surface">Rekan Medis &amp; Institusi Kami</h2>
          <ul className="lg:col-span-3 flex flex-wrap gap-x-8 gap-y-3 text-on-surface-variant font-body-md">
            {partners.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </div>
      </section>}

      <ArticleHighlightSection />
    </Layout>
  );
};

export default Home;
