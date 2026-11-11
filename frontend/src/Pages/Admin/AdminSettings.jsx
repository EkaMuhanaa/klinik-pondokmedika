import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { MdSave, MdOutlineRefresh, MdInfoOutline } from 'react-icons/md';
import { useSiteSettings } from '../../Contexts/SiteSettingsContext';
import { siteDefaults } from '../../seo/siteDefaults';
import { fullAddress, pageMeta } from '../../seo/meta';

const DAYS = [
  ['Mo', 'Senin'], ['Tu', 'Selasa'], ['We', 'Rabu'], ['Th', 'Kamis'], ['Fr', 'Jumat'], ['Sa', 'Sabtu'], ['Su', 'Minggu'],
];

const inputClass = 'w-full px-4 py-3 rounded-xl bg-surface-container border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none';

const Field = ({ label, hint, error, children }) => (
  <div>
    <label className='block text-sm font-bold text-on-surface mb-2'>{label}</label>
    {children}
    {hint && <p className='text-xs text-on-surface-variant mt-1'>{hint}</p>}
    {error && <p className='text-xs text-error mt-1 font-bold'>{error}</p>}
  </div>
);

const Section = ({ title, desc, children }) => (
  <div className='bg-surface rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/30'>
    <h2 className='text-xl font-bold text-on-surface'>{title}</h2>
    {desc && <p className='text-sm text-on-surface-variant mt-1 mb-6'>{desc}</p>}
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>{children}</div>
  </div>
);

const AdminSettings = () => {
  const { setSettings: setPublicSettings } = useSiteSettings();
  const [form, setForm] = useState(siteDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const topRef = useRef(null);

  useEffect(() => {
    axios.get('/site-settings')
      .then((res) => setForm({ ...siteDefaults, ...res.data }))
      .finally(() => setLoading(false));
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const input = (key, props = {}) => (
    <input type='text' value={form[key] ?? ''} onChange={set(key)} className={inputClass} {...props} />
  );

  const selectedDays = (form.opening_days || '').split(',').filter(Boolean);
  const toggleDay = (code) => {
    const next = selectedDays.includes(code) ? selectedDays.filter((d) => d !== code) : [...selectedDays, code];
    setForm({ ...form, opening_days: DAYS.map(([c]) => c).filter((c) => next.includes(c)).join(',') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage(null);
    try {
      const res = await axios.put('/admin/site-settings', form);
      setForm({ ...siteDefaults, ...res.data });
      setPublicSettings?.({ ...siteDefaults, ...res.data });
      setMessage({ ok: true, text: 'Pengaturan tersimpan dan langsung tampil di website.' });
    } catch (err) {
      const errs = err.response?.data?.errors || {};
      setErrors(Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v[0]])));
      setMessage({ ok: false, text: 'Gagal menyimpan. Periksa isian yang ditandai merah.' });
    } finally {
      setSaving(false);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return <div className='p-8 text-center text-on-surface-variant font-bold animate-pulse'>Memuat pengaturan...</div>;
  }

  const preview = pageMeta('/', form);

  return (
    <div ref={topRef} className='animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl scroll-mt-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-headline-md font-bold text-on-surface'>Pengaturan Klinik</h1>
        <p className='text-on-surface-variant mt-2'>Alamat, kontak, jam buka, dan media sosial. Data ini dipakai di seluruh website dan untuk SEO Google.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl font-bold ${message.ok ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
          {message.text}
        </div>
      )}

      <div className='mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm text-on-surface flex gap-3'>
        <MdInfoOutline className='text-xl text-primary shrink-0 mt-0.5' />
        <p>
          <strong>Penting untuk Google:</strong> nama klinik, alamat, dan nomor telepon harus <strong>sama persis</strong> dengan
          profil Google Maps (Google Business Profile) klinik. Perbedaan kecil (mis. singkatan jalan atau nomor) bisa menurunkan peringkat pencarian lokal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <Section title='Identitas'>
          <Field label='Nama Klinik' error={errors.clinic_name}>{input('clinic_name', { required: true })}</Field>
          <Field label='Slogan / Deskripsi Singkat' error={errors.tagline}>{input('tagline')}</Field>
        </Section>

        <Section title='Alamat' desc='Ditampilkan di footer, halaman Tentang Kami, dan data terstruktur Google.'>
          <Field label='Jalan & Nomor' hint='Contoh: Jl. Cendrawasih Raya No. 12, RT 01/RW 06' error={errors.address_street}>{input('address_street', { required: true })}</Field>
          <Field label='Kelurahan' error={errors.kelurahan}>{input('kelurahan')}</Field>
          <Field label='Kecamatan' error={errors.kecamatan}>{input('kecamatan', { required: true })}</Field>
          <Field label='Kota / Kabupaten' error={errors.city}>{input('city', { required: true })}</Field>
          <Field label='Provinsi' error={errors.province}>{input('province')}</Field>
          <Field label='Kode Pos' error={errors.postal_code}>{input('postal_code')}</Field>
          <Field label='Latitude' hint='Dari Google Maps: klik kanan titik klinik → salin angka pertama' error={errors.latitude}>{input('latitude')}</Field>
          <Field label='Longitude' hint='Angka kedua dari Google Maps' error={errors.longitude}>{input('longitude')}</Field>
          <div className='md:col-span-2'>
            <Field label='Link Google Maps' hint='Link "Bagikan" dari profil Google Maps klinik' error={errors.maps_url}>{input('maps_url', { type: 'url' })}</Field>
          </div>
          <p className='md:col-span-2 text-sm text-on-surface-variant'>Tampilan alamat: <strong>{fullAddress(form)}</strong></p>
        </Section>

        <Section title='Kontak'>
          <Field label='Nomor Telepon (tampilan)' hint='Contoh: 0812-3416-3128' error={errors.phone}>{input('phone', { required: true })}</Field>
          <Field label='Nomor WhatsApp' hint='Format internasional tanpa + dan spasi, contoh: 6281234163128' error={errors.whatsapp}>{input('whatsapp', { inputMode: 'numeric', required: true })}</Field>
          <Field label='Email' error={errors.email}>{input('email', { type: 'email' })}</Field>
        </Section>

        <Section title='Jam Operasional'>
          <div className='md:col-span-2'>
            <Field label='Hari Buka' error={errors.opening_days}>
              <div className='flex flex-wrap gap-2'>
                {DAYS.map(([code, name]) => (
                  <button
                    type='button'
                    key={code}
                    onClick={() => toggleDay(code)}
                    aria-pressed={selectedDays.includes(code)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${selectedDays.includes(code) ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container text-on-surface-variant border-transparent'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <Field label='Jam Buka' error={errors.opening_time}>{input('opening_time', { type: 'time' })}</Field>
          <Field label='Jam Tutup' error={errors.closing_time}>{input('closing_time', { type: 'time' })}</Field>
          <div className='md:col-span-2'>
            <Field label='Catatan Jam Buka' hint='Contoh: Minggu & hari libur nasional tutup' error={errors.hours_note}>{input('hours_note')}</Field>
          </div>
        </Section>

        <Section title='Wilayah Layanan (SEO Lokal)' desc='Kelurahan/kecamatan sekitar klinik, dipisah koma. Ditampilkan di footer dan dibaca Google sebagai area layanan.'>
          <div className='md:col-span-2'>
            <Field label='Wilayah' error={errors.service_area}>
              <textarea rows='3' value={form.service_area} onChange={set('service_area')} className={`${inputClass} resize-none`} />
            </Field>
          </div>
        </Section>

        <Section title='Media Sosial' desc='Kosongkan jika tidak punya. Hanya yang diisi yang tampil di website.'>
          <Field label='Instagram' error={errors.instagram_url}>{input('instagram_url', { type: 'url', placeholder: 'https://instagram.com/...' })}</Field>
          <Field label='Facebook' error={errors.facebook_url}>{input('facebook_url', { type: 'url', placeholder: 'https://facebook.com/...' })}</Field>
          <Field label='TikTok' error={errors.tiktok_url}>{input('tiktok_url', { type: 'url', placeholder: 'https://tiktok.com/@...' })}</Field>
          <Field label='YouTube' error={errors.youtube_url}>{input('youtube_url', { type: 'url', placeholder: 'https://youtube.com/@...' })}</Field>
        </Section>

        <Section title='SEO Beranda' desc='Opsional. Kosongkan agar judul & deskripsi dibuat otomatis dari nama klinik dan lokasi.'>
          <div className='md:col-span-2 space-y-5'>
            <Field label={`Judul Halaman (${(form.seo_home_title || '').length}/60)`} error={errors.seo_home_title}>{input('seo_home_title', { maxLength: 70 })}</Field>
            <Field label={`Deskripsi (${(form.seo_home_description || '').length}/160)`} error={errors.seo_home_description}>
              <textarea rows='3' maxLength={200} value={form.seo_home_description} onChange={set('seo_home_description')} className={`${inputClass} resize-none`} />
            </Field>
            <div className='p-4 rounded-xl bg-white border border-outline-variant/40'>
              <p className='text-xs text-on-surface-variant mb-2'>Pratinjau di Google:</p>
              <p className='text-[#1a0dab] text-lg leading-snug'>{preview.title}</p>
              <p className='text-[#006621] text-sm'>klinikpondokmedika.id</p>
              <p className='text-sm text-[#545454]'>{preview.description}</p>
            </div>
          </div>
        </Section>

        <div className='flex justify-end sticky bottom-4'>
          <button
            type='submit'
            disabled={saving}
            className='bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg disabled:opacity-70 disabled:hover:scale-100'
          >
            {saving ? <MdOutlineRefresh className='text-xl animate-spin' /> : <MdSave className='text-xl' />}
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
