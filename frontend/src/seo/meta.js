// Fungsi SEO murni (tanpa React/JSX) agar bisa dipakai di browser maupun script prerender Node.
import { SITE_URL } from './siteDefaults.js';
import { services, serviceContents } from '../data/services.js';

const DAY_NAMES = { Mo: 'Senin', Tu: 'Selasa', We: 'Rabu', Th: 'Kamis', Fr: 'Jumat', Sa: 'Sabtu', Su: 'Minggu' };
const DAY_SCHEMA = { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' };
const ORDER = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const days = (s) => (s.opening_days || '').split(',').map((d) => d.trim()).filter((d) => DAY_NAMES[d]);

/** "Senin – Sabtu" atau "Senin, Rabu, Jumat" */
export function openingDaysText(s) {
  const d = days(s).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  if (!d.length) return '';
  const idx = d.map((x) => ORDER.indexOf(x));
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (d.length > 2 && contiguous) return `${DAY_NAMES[d[0]]} – ${DAY_NAMES[d[d.length - 1]]}`;
  return d.map((x) => DAY_NAMES[x]).join(', ');
}

export const hoursText = (s) =>
  s.opening_time && s.closing_time ? `${s.opening_time.replace(':', '.')} – ${s.closing_time.replace(':', '.')}` : '';

/** "Jl. ..., Kel. Cengkareng Barat, Kec. Cengkareng, Jakarta Barat, DKI Jakarta 11730" */
export function fullAddress(s) {
  return [
    s.address_street,
    s.kelurahan && `Kel. ${s.kelurahan}`,
    s.kecamatan && `Kec. ${s.kecamatan}`,
    s.city,
    [s.province, s.postal_code].filter(Boolean).join(' '),
  ].filter(Boolean).join(', ');
}

/** "Cengkareng, Jakarta Barat" */
export const localArea = (s) => [s.kecamatan, s.city].filter(Boolean).join(', ');

export const telE164 = (s) => (s.whatsapp ? `+${s.whatsapp}` : '');

export const whatsappLink = (s, text) =>
  `https://wa.me/${s.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const absoluteUrl = (path = '/') => SITE_URL + (path === '/' ? '/' : path.replace(/\/$/, ''));

export const truncate = (text, n = 160) => {
  const t = (text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : t;
};

/**
 * Judul & deskripsi per halaman. Kata kunci lokal (kecamatan + kota) disisipkan
 * secara alami agar relevan untuk pencarian seperti "klinik cengkareng".
 */
export function pageMeta(path, s) {
  const name = s.clinic_name;
  const area = localArea(s);
  const hours = [openingDaysText(s), hoursText(s)].filter(Boolean).join(' ');

  if (path === '/') {
    return {
      title: s.seo_home_title || `${name} – Klinik Umum, Gigi & KIA di ${area}`,
      description:
        s.seo_home_description ||
        truncate(`${name}, klinik keluarga di ${s.kelurahan ? `${s.kelurahan}, ` : ''}${area}. Dokter umum, dokter gigi, KIA, laboratorium & apotek. Buka ${hours}. Daftar via WhatsApp ${s.phone}.`),
    };
  }
  if (path === '/tentang-kami') {
    return {
      title: `Tentang Kami – ${name} ${s.kecamatan || ''}`.trim(),
      description: truncate(`Profil ${name}: klinik keluarga di ${fullAddress(s)}. Jam buka ${hours}. Lokasi, kontak & jadwal praktik.`),
    };
  }
  if (path === '/layanan') {
    return {
      title: `Layanan Klinik di ${area} – ${name}`,
      description: truncate(`Layanan ${name} di ${area}: ${services.map((x) => x.title).join(', ')}. Konsultasi & pendaftaran via WhatsApp.`),
    };
  }
  if (path === '/artikel') {
    return {
      title: `Artikel & Edukasi Kesehatan – ${name}`,
      description: truncate(`Artikel edukasi kesehatan dari tim dokter ${name}, ${area}. Tips kesehatan keluarga, ibu & anak, gigi, dan pencegahan penyakit.`),
    };
  }
  const m = path.match(/^\/layanan\/([^/]+)$/);
  if (m) {
    const svc = services.find((x) => x.slug === m[1]);
    if (svc) {
      return {
        title: `${svc.title} di ${area} – ${name}`,
        description: truncate(`${svc.title} ${name}, ${area}. ${svc.description}`),
      };
    }
  }
  return null;
}

/** Schema.org MedicalClinic: kunci utama SEO lokal (alamat, jam, geo, area layanan). */
export function clinicJsonLd(s) {
  const d = days(s);
  const sameAs = [s.instagram_url, s.facebook_url, s.tiktok_url, s.youtube_url, s.maps_url].filter(Boolean);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': `${SITE_URL}/#klinik`,
    name: s.clinic_name,
    description: s.tagline,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/images/logo-wide.png`,
    image: `${SITE_URL}/images/logo-wide.png`,
    telephone: telE164(s),
    email: s.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: [s.address_street, s.kelurahan && `Kel. ${s.kelurahan}`, s.kecamatan && `Kec. ${s.kecamatan}`].filter(Boolean).join(', '),
      addressLocality: s.city,
      addressRegion: s.province,
      postalCode: s.postal_code,
      addressCountry: 'ID',
    },
    hasMap: s.maps_url || undefined,
    areaServed: (s.service_area || '').split(',').map((a) => a.trim()).filter(Boolean)
      .map((a) => ({ '@type': 'AdministrativeArea', name: a })),
    medicalSpecialty: ['PrimaryCare', 'Dentistry', 'Pediatric', 'Obstetric'],
    availableService: services.map((x) => ({
      '@type': 'MedicalProcedure',
      name: x.title,
      url: `${SITE_URL}/layanan/${x.slug}`,
    })),
    isAcceptingNewPatients: true,
    sameAs: sameAs.length ? sameAs : undefined,
  };
  if (s.latitude && s.longitude) {
    data.geo = { '@type': 'GeoCoordinates', latitude: Number(s.latitude), longitude: Number(s.longitude) };
  }
  if (d.length && s.opening_time && s.closing_time) {
    data.openingHoursSpecification = [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: d.map((x) => DAY_SCHEMA[x]),
      opens: s.opening_time,
      closes: s.closing_time,
    }];
  }
  return JSON.parse(JSON.stringify(data)); // buang field undefined
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

/** Breadcrumb otomatis untuk halaman statis. */
export function breadcrumbFor(path) {
  const home = { name: 'Beranda', path: '/' };
  if (path === '/tentang-kami') return [home, { name: 'Tentang Kami', path }];
  if (path === '/layanan') return [home, { name: 'Layanan', path }];
  if (path === '/artikel') return [home, { name: 'Artikel', path }];
  const m = path.match(/^\/layanan\/([^/]+)$/);
  if (m && serviceContents[m[1]]) {
    return [home, { name: 'Layanan', path: '/layanan' }, { name: serviceContents[m[1]].title, path }];
  }
  return null;
}

export const STATIC_PATHS = ['/', '/tentang-kami', '/layanan', '/artikel', ...services.map((x) => `/layanan/${x.slug}`)];
