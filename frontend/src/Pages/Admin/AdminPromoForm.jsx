import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdArrowBack, MdSave, MdImage, MdOutlineRefresh } from 'react-icons/md';

const inputClass = 'w-full px-4 py-3 rounded-xl bg-surface-container border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none';

// ISO (UTC) dari server <-> nilai input datetime-local (waktu lokal browser)
const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const toIso = (local) => (local ? new Date(local).toISOString() : '');

const Field = ({ label, hint, error, children }) => (
  <div>
    <label className='block text-sm font-bold text-on-surface mb-2'>{label}</label>
    {children}
    {hint && <p className='text-xs text-on-surface-variant mt-1'>{hint}</p>}
    {error && <p className='text-xs text-error mt-1 font-bold'>{error}</p>}
  </div>
);

const AdminPromoForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: '', description: '', button_text: '', button_url: '', is_active: true, starts_at: '', ends_at: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    axios.get(`/admin/promos/${id}`)
      .then(({ data }) => {
        setForm({
          title: data.title || '',
          description: data.description || '',
          button_text: data.button_text || '',
          button_url: data.button_url || '',
          is_active: Boolean(data.is_active),
          starts_at: toLocalInput(data.starts_at),
          ends_at: toLocalInput(data.ends_at),
        });
        if (data.image_path) setPreview(import.meta.env.VITE_API_BASE_URL + data.image_path);
      })
      .catch(() => navigate('/admin/promos'))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setRemoveImage(false);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const data = new FormData();
    ['title', 'description', 'button_text', 'button_url'].forEach((k) => data.append(k, form[k]));
    data.append('is_active', form.is_active ? '1' : '0');
    data.append('starts_at', toIso(form.starts_at));
    data.append('ends_at', toIso(form.ends_at));
    if (image) data.append('image', image);
    if (removeImage) data.append('remove_image', '1');
    try {
      await axios.post(isEdit ? `/admin/promos/${id}` : '/admin/promos', data);
      navigate('/admin/promos');
    } catch (err) {
      const errs = err.response?.data?.errors || {};
      setErrors(Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v[0]])));
      if (!Object.keys(errs).length) alert('Gagal menyimpan promo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className='p-8 text-center text-on-surface-variant font-bold animate-pulse'>Memuat data...</div>;
  }

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto'>
      <div className='flex items-center gap-4 mb-8'>
        <Link to='/admin/promos' aria-label='Kembali' className='w-12 h-12 bg-surface rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors shadow-sm'>
          <MdArrowBack className='text-2xl' />
        </Link>
        <h1 className='text-3xl font-headline-md font-bold text-on-surface'>{isEdit ? 'Edit Promo' : 'Tambah Promo'}</h1>
      </div>

      <form onSubmit={handleSubmit} className='bg-surface rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/30 space-y-6'>
        <Field label='Judul Promo' error={errors.title}>
          <input type='text' required maxLength={255} value={form.title} onChange={set('title')} className={inputClass} placeholder='Contoh: Cek Gula Darah Gratis Bulan Ini' />
        </Field>

        <Field label='Keterangan (opsional)' error={errors.description}>
          <textarea rows='3' maxLength={1000} value={form.description} onChange={set('description')} className={`${inputClass} resize-none`} placeholder='Syarat, periode, atau detail singkat promo' />
        </Field>

        <Field label='Gambar Promo (opsional)' hint='Disarankan rasio 1:1 atau 4:5, maksimal 2 MB.' error={errors.image}>
          <div className='flex flex-col sm:flex-row gap-4 items-start'>
            <button type='button' onClick={() => fileRef.current?.click()} className='w-48 aspect-square rounded-xl border-2 border-dashed border-outline-variant/60 hover:border-primary overflow-hidden flex items-center justify-center bg-surface-container'>
              {preview ? <img src={preview} alt='Pratinjau promo' className='w-full h-full object-cover' /> : (
                <span className='text-center text-on-surface-variant'><MdImage className='text-4xl mx-auto mb-1' /><span className='text-sm font-bold'>Pilih Gambar</span></span>
              )}
            </button>
            <input type='file' ref={fileRef} accept='image/*' onChange={onImage} className='hidden' />
            {preview && (
              <button type='button' onClick={() => { setPreview(null); setImage(null); setRemoveImage(true); }} className='text-sm font-bold text-error hover:underline'>
                Hapus gambar
              </button>
            )}
          </div>
        </Field>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <Field label='Teks Tombol (opsional)' error={errors.button_text}>
            <input type='text' maxLength={60} value={form.button_text} onChange={set('button_text')} className={inputClass} placeholder='Daftar via WhatsApp' />
          </Field>
          <Field label='Link Tombol (opsional)' hint='https://wa.me/62..., atau halaman website seperti /layanan/poli-gigi-mulut' error={errors.button_url}>
            <input type='text' maxLength={500} value={form.button_url} onChange={set('button_url')} className={inputClass} placeholder='https://wa.me/6281234163128' />
          </Field>
          <Field label='Mulai Tayang (opsional)' hint='Kosongkan untuk langsung tayang' error={errors.starts_at}>
            <input type='datetime-local' value={form.starts_at} onChange={set('starts_at')} className={inputClass} />
          </Field>
          <Field label='Selesai Tayang (opsional)' hint='Kosongkan jika tanpa batas' error={errors.ends_at}>
            <input type='datetime-local' value={form.ends_at} onChange={set('ends_at')} className={inputClass} />
          </Field>
        </div>

        <label className='flex items-center gap-3 cursor-pointer select-none'>
          <input type='checkbox' checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className='w-5 h-5 accent-primary' />
          <span className='font-bold text-on-surface'>Aktifkan promo</span>
        </label>

        <div className='pt-6 border-t border-outline-variant/30 flex justify-end'>
          <button type='submit' disabled={saving} className='bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-md disabled:opacity-70'>
            {saving ? <MdOutlineRefresh className='text-xl animate-spin' /> : <MdSave className='text-xl' />}
            {saving ? 'Menyimpan...' : 'Simpan Promo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPromoForm;
