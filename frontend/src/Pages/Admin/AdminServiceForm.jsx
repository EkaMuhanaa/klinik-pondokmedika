import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdArrowBack } from 'react-icons/md';
import ServiceIcon, { SERVICE_ICONS } from '../../Components/ServiceIcon';
import { useServices } from '../../Contexts/SiteSettingsContext';
import { Check, Field, SaveButton, firstErrors, inputClass } from '../../Components/Admin/FormBits';

const empty = {
  title: '', slug: '', summary: '', background: '', explanation: '', conditions: '', stages: '', location_note: '',
  icon: 'umum', is_active: true, show_on_home: false, is_featured: false, sort_order: '',
};

const AdminServiceForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { reload: reloadPublicServices } = useServices();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    axios.get(`/admin/services/${id}`)
      .then(({ data }) => setForm({ ...empty, ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ''])) }))
      .catch(() => navigate('/admin/services'))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const area = (key, rows = 4, props = {}) => (
    <textarea id={key} rows={rows} value={form[key]} onChange={set(key)} className={`${inputClass} resize-y`} {...props} />
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = { ...form, sort_order: form.sort_order === '' ? null : Number(form.sort_order) };
      if (isEdit) await axios.put(`/admin/services/${id}`, payload);
      else await axios.post('/admin/services', payload);
      reloadPublicServices?.();
      navigate('/admin/services');
    } catch (err) {
      const errs = firstErrors(err);
      setErrors(errs);
      if (!Object.keys(errs).length) alert('Gagal menyimpan layanan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-on-surface-variant" role="status">Memuat data…</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/services" aria-label="Kembali ke daftar layanan" className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 shadow-sm">
          <MdArrowBack className="text-2xl" aria-hidden="true" />
        </Link>
        <h1 className="text-3xl font-headline-md font-bold text-on-surface">{isEdit ? 'Edit Layanan' : 'Tambah Layanan'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface rounded-xl p-6 md:p-8 border border-outline-variant/40 space-y-5">
          <h2 className="text-xl font-bold text-on-surface">Dasar</h2>
          <Field label="Nama Layanan" htmlFor="title" error={errors.title}>
            <input id="title" type="text" required maxLength={120} value={form.title} onChange={set('title')} className={inputClass} placeholder="Contoh: Poli Gigi & Mulut" />
          </Field>
          <Field label="Alamat Halaman (opsional)" htmlFor="slug" hint="Bagian akhir URL, contoh: poli-gigi-mulut. Kosongkan agar dibuat otomatis dari nama. Mengubahnya akan mengubah link halaman." error={errors.slug}>
            <input id="slug" type="text" maxLength={120} value={form.slug} onChange={set('slug')} className={inputClass} placeholder="dibuat otomatis" />
          </Field>
          <Field label="Ringkasan" htmlFor="summary" hint="1–2 kalimat. Tampil di kartu layanan, Beranda, dan hasil pencarian Google." error={errors.summary}>
            {area('summary', 3, { maxLength: 500 })}
          </Field>
          <Field label="Ikon" error={errors.icon}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Ikon layanan">
              {Object.entries(SERVICE_ICONS).map(([key, { label }]) => (
                <button
                  type="button"
                  key={key}
                  role="radio"
                  aria-checked={form.icon === key}
                  onClick={() => setForm({ ...form, icon: key })}
                  className={`flex items-center gap-2 min-h-[44px] px-3 rounded-lg border text-sm text-left ${form.icon === key ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-outline-variant text-on-surface hover:border-primary'}`}
                >
                  <ServiceIcon name={key} className="text-2xl shrink-0" /> {label}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="bg-surface rounded-xl p-6 md:p-8 border border-outline-variant/40 space-y-5">
          <h2 className="text-xl font-bold text-on-surface">Isi Halaman Layanan</h2>
          <p className="text-sm text-on-surface-variant -mt-3">Bagian yang dikosongkan tidak ditampilkan. Tulis hanya informasi yang benar dan bisa dipertanggungjawabkan.</p>
          <Field label="Latar Belakang" htmlFor="background" error={errors.background}>{area('background')}</Field>
          <Field label="Penjelasan Layanan di Klinik" htmlFor="explanation" error={errors.explanation}>{area('explanation')}</Field>
          <Field label="Kondisi Pasien yang Cocok" htmlFor="conditions" error={errors.conditions}>{area('conditions')}</Field>
          <Field label="Tahapan Pemeriksaan" htmlFor="stages" hint="Satu tahap per baris. Nomor dibuat otomatis." error={errors.stages}>{area('stages', 6)}</Field>
          <Field label="Lokasi Ruangan" htmlFor="location_note" hint="Contoh: Lantai 1, sebelah ruang tunggu. Nomor telepon ditambahkan otomatis." error={errors.location_note}>
            <input id="location_note" type="text" maxLength={500} value={form.location_note} onChange={set('location_note')} className={inputClass} />
          </Field>
        </div>

        <div className="bg-surface rounded-xl p-6 md:p-8 border border-outline-variant/40 space-y-2">
          <h2 className="text-xl font-bold text-on-surface mb-2">Tampilan di Website</h2>
          <Check checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Punya halaman sendiri" hint="Tampil di menu Layanan, footer, dan sitemap Google." />
          <Check checked={form.show_on_home} onChange={(v) => setForm({ ...form, show_on_home: v })} label="Tampil di Beranda" hint="Masuk bagian “Layanan Unggulan” di Beranda." />
          <Check checked={form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} label="Tonjolkan" hint="Tampil paling besar di Beranda dan paling atas di halaman Layanan. Hanya satu layanan." />
          <div className="max-w-[200px] pt-2">
            <Field label="Urutan" htmlFor="sort_order" hint="Angka kecil tampil lebih dulu. Kosongkan untuk menaruh di urutan terakhir." error={errors.sort_order}>
              <input id="sort_order" type="number" min="0" value={form.sort_order} onChange={set('sort_order')} className={inputClass} placeholder="otomatis" />
            </Field>
          </div>
        </div>

        <div className="flex justify-end">
          <SaveButton saving={saving} label="Simpan Layanan" />
        </div>
      </form>
    </div>
  );
};

export default AdminServiceForm;
