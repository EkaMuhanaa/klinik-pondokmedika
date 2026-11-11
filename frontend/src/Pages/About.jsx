import React, { useEffect, useState } from 'react';
import { MdGroups, MdVerified, MdLocationOn, MdSchedule, MdPhoneInTalk } from 'react-icons/md';
import axios from 'axios';
import Layout from '../Components/Layout';
import HeroSliderBackground from '../Components/HeroSliderBackground';
import { useSiteSettings } from '../Contexts/SiteSettingsContext';
import { fullAddress, openingDaysText, hoursText, whatsappLink } from '../seo/meta';

const missions = [
  { title: 'SDM Berkualitas', text: 'Meningkatkan kualitas Sumber Daya Manusia secara berkesinambungan melalui pelatihan dan pengembangan profesional.' },
  { title: 'Pelayanan Paripurna', text: 'Memberikan pelayanan kesehatan yang menyeluruh, terintegrasi, dan tetap terjangkau bagi masyarakat.' },
  { title: 'Sarana Standar', text: 'Melengkapi sarana dan prasarana medis sesuai standar kesehatan nasional untuk menjamin akurasi dan keselamatan pasien.' },
];

const About = () => {
  const settings = useSiteSettings();
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_BASE_URL + '/api/sliders/about')
      .then((res) => {
        if (res.data?.length) setHeroImages(res.data.map((s) => import.meta.env.VITE_API_BASE_URL + s.image_path));
      })
      .catch(() => {});
  }, []);

  return (
    <Layout>
      <section className="relative min-h-[360px] md:min-h-[440px] flex items-end">
        <HeroSliderBackground images={heroImages} overlayClassName="hero-overlay" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-gutter py-12">
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile md:font-headline-xl md:text-headline-xl text-white mb-3">Tentang Kami</h1>
          <p className="font-body-lg text-body-lg text-white max-w-2xl">
            {settings.clinic_name}, klinik pratama di {fullAddress(settings)}.
          </p>
        </div>
      </section>

      {/* Sejarah singkat */}
      <section className="py-section-gap px-gutter max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="aspect-square rounded-xl overflow-hidden bg-white border border-outline-variant/40">
          {heroImages.length > 0 ? (
            <img alt={`Gedung ${settings.clinic_name}`} width="640" height="640" loading="lazy" className="w-full h-full object-cover" src={heroImages[0]} />
          ) : (
            <img alt={`Logo ${settings.clinic_name}`} width="640" height="640" loading="lazy" className="w-full h-full object-contain p-10" src="/images/logo-header.png" />
          )}
        </div>
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Sejarah Singkat</h2>
          <div className="space-y-4 text-on-surface-variant font-body-md text-body-md leading-relaxed">
            <p>{settings.clinic_name} didirikan untuk menghadirkan layanan kesehatan yang dapat diakses oleh seluruh lapisan masyarakat di sekitar {settings.kecamatan}.</p>
            <p>Kami melayani pemeriksaan umum, kesehatan gigi, serta kesehatan ibu dan anak bagi warga sekitar, dengan mengutamakan kenyamanan dan keselamatan setiap pasien.</p>
          </div>
          <ul className="mt-8 flex flex-wrap gap-4">
            <li className="bg-surface-container p-4 rounded-lg flex items-center gap-4">
              <MdVerified className="text-primary text-3xl" aria-hidden="true" />
              <div>
                <h3 className="font-bold">Terakreditasi</h3>
                <p className="text-sm text-on-surface-variant">Standar Pelayanan Nasional</p>
              </div>
            </li>
            <li className="bg-surface-container p-4 rounded-lg flex items-center gap-4">
              <MdGroups className="text-primary text-3xl" aria-hidden="true" />
              <div>
                <h3 className="font-bold">Tim Ahli</h3>
                <p className="text-sm text-on-surface-variant">Dokter Berpengalaman</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Visi & misi: visi sebagai pernyataan besar, misi sebagai daftar bernomor */}
      <section className="bg-surface-container-low py-section-gap">
        <div className="px-gutter max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Visi &amp; Misi</h2>
            <blockquote className="font-heading text-2xl md:text-3xl leading-snug text-on-surface">
              Mewujudkan Klinik Pratama Pondok Medika sebagai fasilitas pelayanan kesehatan yang profesional dan bermutu.
            </blockquote>
          </div>
          <ol className="lg:col-span-3 space-y-8">
            {missions.map((m, i) => (
              <li key={m.title} className="grid grid-cols-[3rem_1fr] gap-4">
                <span className="font-heading text-3xl font-bold text-primary" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{m.title}</h3>
                  <p className="text-on-surface-variant text-body-md">{m.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Lokasi */}
      <section className="py-section-gap px-gutter max-w-container-max mx-auto flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Lokasi Kami</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <MdLocationOn className="text-primary text-2xl shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-lg">{settings.clinic_name}</h3>
                <a href={settings.maps_url} target="_blank" rel="noreferrer" className="text-on-surface-variant underline underline-offset-2 hover:text-primary">{fullAddress(settings)}</a>
              </div>
            </div>
            <div className="flex gap-4">
              <MdSchedule className="text-primary text-2xl shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-lg">Jam Operasional</h3>
                <p className="text-on-surface-variant">{openingDaysText(settings)}: {hoursText(settings)}</p>
                {settings.hours_note && <p className="text-on-surface-variant">{settings.hours_note}</p>}
              </div>
            </div>
            <div className="flex gap-4">
              <MdPhoneInTalk className="text-primary text-2xl shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-lg">Kontak</h3>
                <p className="text-on-surface-variant">{settings.phone} (WhatsApp)</p>
              </div>
            </div>
          </div>
          <a
            href={whatsappLink(settings, `Halo ${settings.clinic_name}, saya ingin bertanya.`)}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center justify-center gap-2 min-h-[48px] w-full md:w-auto bg-whatsapp-green text-on-whatsapp px-8 rounded-full font-bold hover:brightness-95 active:brightness-90 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 fill-current" aria-hidden="true"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.6-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.4-11.3 2.5-2.4 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.5-9.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
            Tanya via WhatsApp
          </a>
        </div>
        <div className="md:w-2/3">
          <div className="w-full h-[360px] md:h-[450px] rounded-xl overflow-hidden bg-surface-dim">
            <iframe
              title={`Peta Lokasi ${settings.clinic_name}`}
              src={`https://maps.google.com/maps?q=${settings.latitude},${settings.longitude}&t=m&z=16&ie=UTF8&iwloc=&output=embed`}
              width="800"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
