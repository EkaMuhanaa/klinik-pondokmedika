import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdArrowBack } from 'react-icons/md';
import { mediaUrl } from '../../Contexts/SiteSettingsContext';
import { Check, Field, SaveButton, firstErrors, inputClass } from '../../Components/Admin/FormBits';

const AdminPartnerForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({ name: '', url: '', is_active: true, sort_order: '' });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    axios.get(`/admin/partners/${id}`)
      .then(({ data }) => {
        setForm({ name: data.name || '', url: data.url || '', is_active: Boolean(data.is_active), sort_order: data.sort_order ?? '' });
        if (data.logo_path) setPreview(mediaUrl(data.logo_path));
      })
      .catch(() => navigate('/admin/partners'))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(file);
    setRemoveLogo(false);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const data = new FormData();
    data.append('name', form.name);
    data.append('url', form.url);
    data.append('is_active', form.is_active ? '1' : '0');
    if (form.sort_order !== '') data.append('sort_order', String(Number(form.sort_order)));
    if (logo) data.append('logo', logo);
    if (removeLogo) data.append('remove_logo', '1');
    try {
      await axios.post(isEdit ? `/admin/partners/${id}` : '/admin/partners', data);
      navigate('/admin/partners');
    } catch (err) {
      const errs = firstErrors(err);
      setErrors(errs);
      if (!Object.keys(errs).length) alert('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-on-surface-variant" role="status">Memuat data…</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/partners" aria-label="Kembali ke daftar rekan medis" className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 shadow-sm">
          <MdArrowBack className="text-2xl" aria-hidden="true" />
        </Link>
        <h1 className="text-3xl font-headline-md font-bold text-on-surface">{isEdit ? 'Edit Mitra' : 'Tambah Mitra'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-5 md:p-8 border border-outline-variant/40 space-y-5">
        <Field label="Nama Institusi" htmlFor="name" hint="Tetap diisi walau ada logo: dibaca pembaca layar dan tampil jika logo gagal dimuat." error={errors.name}>
          <input id="name" type="text" required maxLength={150} value={form.name} onChange={set('name')} className={inputClass} placeholder="Contoh: Puskesmas Cengkareng" />
        </Field>

        <Field label="Logo (opsional)" hint="PNG transparan atau JPG/WebP, maksimal 1 MB. Logo memanjang (landscape) tampil paling rapi. Pastikan Anda berhak memakai logo mitra." error={errors.logo}>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <button type="button" onClick={() => fileRef.current?.click()} className="w-48 h-20 rounded-lg border-2 border-dashed border-outline-variant hover:border-primary bg-white flex items-center justify-center overflow-hidden">
              {preview
                ? <img src={preview} alt="Pratinjau logo" width="176" height="64" className="max-h-16 w-auto max-w-[176px] object-contain" />
                : <span className="text-sm font-bold text-on-surface-variant">Pilih logo</span>}
            </button>
            <input type="file" ref={fileRef} accept="image/png,image/jpeg,image/webp" onChange={onLogo} className="hidden" aria-label="Pilih file logo" />
            {preview && (
              <button type="button" onClick={() => { setPreview(null); setLogo(null); setRemoveLogo(true); }} className="min-h-[44px] text-sm font-bold text-error hover:underline">
                Hapus logo (tampilkan nama saja)
              </button>
            )}
          </div>
        </Field>

        <Field label="Link Website Mitra (opsional)" htmlFor="url" hint="Contoh: https://www.rs-contoh.co.id" error={errors.url}>
          <input id="url" type="url" maxLength={500} value={form.url} onChange={set('url')} className={inputClass} />
        </Field>

        <Check checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Tampilkan di website" />

        <div className="max-w-[200px]">
          <Field label="Urutan" htmlFor="sort_order" hint="Angka kecil tampil lebih dulu. Kosongkan untuk urutan terakhir." error={errors.sort_order}>
            <input id="sort_order" type="number" min="0" value={form.sort_order} onChange={set('sort_order')} className={inputClass} placeholder="otomatis" />
          </Field>
        </div>

        <div className="pt-4 border-t border-outline-variant/30 flex justify-end">
          <SaveButton saving={saving} label="Simpan Mitra" />
        </div>
      </form>
    </div>
  );
};

export default AdminPartnerForm;
