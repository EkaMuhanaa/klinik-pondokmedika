import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { MdArrowBack } from 'react-icons/md';
import { mediaUrl } from '../../Contexts/SiteSettingsContext';
import { Check, Field, SaveButton, firstErrors, inputClass } from '../../Components/Admin/FormBits';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

// "13.00 - 21.00" <-> { start: "13:00", end: "21:00" } untuk input type="time"
const parseTime = (t) => {
  const [start = '', end = ''] = (t || '').split('-').map((x) => x.trim().replace('.', ':'));
  return { start, end };
};
const formatTime = (start, end) => `${start.replace(':', '.')} - ${end.replace(':', '.')}`;

const AdminDoctorForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({ name: '', specialty: '', description: '', is_active: true, sort_order: '' });
  const [schedule, setSchedule] = useState({}); // { Senin: {start, end} }
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    axios.get(`/admin/doctors/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name || '', specialty: data.specialty || '', description: data.description || '',
          is_active: Boolean(data.is_active), sort_order: data.sort_order ?? 0,
        });
        setSchedule(Object.fromEntries((data.schedule || []).map((s) => [s.day, parseTime(s.time)])));
        if (data.photo_path) setPreview(mediaUrl(data.photo_path));
      })
      .catch(() => navigate('/admin/doctors'))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const toggleDay = (day) => {
    const next = { ...schedule };
    if (next[day]) delete next[day];
    else next[day] = { start: '13:00', end: '21:00' };
    setSchedule(next);
  };
  const setDayTime = (day, key, value) => setSchedule({ ...schedule, [day]: { ...schedule[day], [key]: value } });

  const onPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setRemovePhoto(false);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const rows = DAYS.filter((d) => schedule[d]).map((d) => ({ day: d, time: formatTime(schedule[d].start, schedule[d].end) }));
    const data = new FormData();
    data.append('name', form.name);
    data.append('specialty', form.specialty);
    data.append('description', form.description);
    data.append('is_active', form.is_active ? '1' : '0');
    if (form.sort_order !== '') data.append('sort_order', String(Number(form.sort_order)));
    data.append('schedule', JSON.stringify(rows));
    if (photo) data.append('photo', photo);
    if (removePhoto) data.append('remove_photo', '1');
    try {
      await axios.post(isEdit ? `/admin/doctors/${id}` : '/admin/doctors', data);
      navigate('/admin/doctors');
    } catch (err) {
      const errs = firstErrors(err);
      setErrors(errs);
      if (!Object.keys(errs).length) alert('Gagal menyimpan data dokter');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-on-surface-variant" role="status">Memuat data…</p>;

  const scheduleError = Object.entries(errors).find(([k]) => k.startsWith('schedule'))?.[1];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/doctors" aria-label="Kembali ke daftar dokter" className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 shadow-sm">
          <MdArrowBack className="text-2xl" aria-hidden="true" />
        </Link>
        <h1 className="text-3xl font-headline-md font-bold text-on-surface">{isEdit ? 'Edit Dokter' : 'Tambah Dokter'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface rounded-xl p-6 md:p-8 border border-outline-variant/40 space-y-5">
          <Field label="Nama Lengkap & Gelar" htmlFor="name" error={errors.name}>
            <input id="name" type="text" required maxLength={120} value={form.name} onChange={set('name')} className={inputClass} placeholder="Contoh: dr. Arya Pratama" />
          </Field>
          <Field label="Spesialisasi / Peran" htmlFor="specialty" hint="Tulis sesuai gelar resmi. Contoh: Dokter Umum, Dokter Gigi, Sp.A (Dokter Anak)." error={errors.specialty}>
            <input id="specialty" type="text" maxLength={120} value={form.specialty} onChange={set('specialty')} className={inputClass} />
          </Field>
          <Field label="Deskripsi Singkat" htmlFor="description" error={errors.description}>
            <textarea id="description" rows="3" maxLength={1000} value={form.description} onChange={set('description')} className={`${inputClass} resize-y`} />
          </Field>
          <Field label="Foto" hint="Rasio 4:5 (potret), latar polos seragam untuk semua dokter, maksimal 2 MB." error={errors.photo}>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <button type="button" onClick={() => fileRef.current?.click()} className="w-36 aspect-[4/5] rounded-lg border-2 border-dashed border-outline-variant hover:border-primary overflow-hidden bg-surface-container">
                <img src={preview || '/images/placeholder-dokter.svg'} alt={preview ? 'Pratinjau foto dokter' : 'Pilih foto'} width="144" height="180" className="w-full h-full object-cover" />
              </button>
              <input type="file" ref={fileRef} accept="image/*" onChange={onPhoto} className="hidden" aria-label="Pilih foto dokter" />
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => fileRef.current?.click()} className="min-h-[44px] px-4 rounded-lg bg-surface-container hover:bg-surface-container-highest font-bold text-sm">Pilih foto</button>
                {preview && (
                  <button type="button" onClick={() => { setPreview(null); setPhoto(null); setRemovePhoto(true); }} className="min-h-[44px] text-sm font-bold text-error hover:underline text-left">
                    Hapus foto
                  </button>
                )}
              </div>
            </div>
          </Field>
        </div>

        <fieldset className="min-w-0 bg-surface rounded-xl p-5 md:p-8 border border-outline-variant/40">
          <legend className="text-xl font-bold text-on-surface px-1">Jadwal Praktik</legend>
          <p className="text-sm text-on-surface-variant mb-4">Centang hari praktik, lalu isi jam mulai dan selesai (WIB). Status “Aktif Praktik” di website dihitung otomatis dari jadwal ini.</p>
          <ul className="divide-y divide-outline-variant/40">
            {DAYS.map((day) => (
              <li key={day} className="flex flex-wrap items-center gap-4 py-2">
                <label className="flex items-center gap-3 min-h-[44px] w-28 cursor-pointer">
                  <input type="checkbox" checked={Boolean(schedule[day])} onChange={() => toggleDay(day)} className="w-5 h-5 accent-primary" />
                  <span className="font-bold">{day}</span>
                </label>
                {schedule[day] ? (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input type="time" required aria-label={`Jam mulai ${day}`} value={schedule[day].start} onChange={(e) => setDayTime(day, 'start', e.target.value)} className={`${inputClass} min-w-0 flex-1 max-w-[9rem] px-2`} />
                    <span aria-hidden="true">–</span>
                    <input type="time" required aria-label={`Jam selesai ${day}`} value={schedule[day].end} onChange={(e) => setDayTime(day, 'end', e.target.value)} className={`${inputClass} min-w-0 flex-1 max-w-[9rem] px-2`} />
                  </div>
                ) : (
                  <span className="text-sm text-on-surface-variant">Tidak praktik</span>
                )}
              </li>
            ))}
          </ul>
          {scheduleError && <p className="text-xs text-error mt-2 font-bold">{scheduleError}</p>}
        </fieldset>

        <div className="bg-surface rounded-xl p-6 md:p-8 border border-outline-variant/40">
          <Check checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="Tampilkan di website" hint="Hapus centang untuk menyembunyikan sementara (misalnya cuti panjang)." />
          <div className="max-w-[200px] pt-3">
            <Field label="Urutan" htmlFor="sort_order" hint="Angka kecil tampil lebih dulu. Kosongkan untuk menaruh di urutan terakhir." error={errors.sort_order}>
              <input id="sort_order" type="number" min="0" value={form.sort_order} onChange={set('sort_order')} className={inputClass} placeholder="otomatis" />
            </Field>
          </div>
        </div>

        <div className="flex justify-end">
          <SaveButton saving={saving} label="Simpan Dokter" />
        </div>
      </form>
    </div>
  );
};

export default AdminDoctorForm;
