// Nilai cadangan data klinik, dipakai sebelum/jika API /api/site-settings tidak bisa diakses.
// Nilai sebenarnya diatur admin di CMS → Pengaturan Klinik. Samakan dengan backend/config/clinic.php.
export const SITE_URL = 'https://klinikpondokmedika.id';

export const siteDefaults = {
  clinic_name: 'Klinik Pondok Medika',
  tagline: 'Klinik keluarga terpercaya di Cengkareng, Jakarta Barat',
  address_street: 'Jl. Cendrawasih Raya',
  kelurahan: 'Cengkareng Barat',
  kecamatan: 'Cengkareng',
  city: 'Jakarta Barat',
  province: 'DKI Jakarta',
  postal_code: '11730',
  latitude: '-6.1438498',
  longitude: '106.722549',
  maps_url: 'https://maps.app.goo.gl/GMcezqSdHjVpFzjp7',
  phone: '0812-3416-3128',
  whatsapp: '6281234163128',
  email: 'info@pondokmedika.com',
  opening_days: 'Mo,Tu,We,Th,Fr,Sa',
  opening_time: '13:00',
  closing_time: '21:00',
  hours_note: 'Minggu & hari libur nasional tutup',
  service_area: 'Cengkareng, Cengkareng Barat, Cengkareng Timur, Kapuk, Duri Kosambi, Rawa Buaya, Kedaung Kali Angke, Kalideres, Kembangan, Jakarta Barat',
  instagram_url: '',
  facebook_url: '',
  tiktok_url: '',
  youtube_url: '',
  seo_home_title: '',
  seo_home_description: '',
};
