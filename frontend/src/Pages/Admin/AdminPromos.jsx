import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdAdd, MdEdit, MdDelete, MdCampaign } from 'react-icons/md';

const fmt = (d) => (d ? new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : null);

const promoStatus = (p) => {
  const now = new Date();
  if (!p.is_active) return { label: 'Nonaktif', cls: 'bg-surface-container text-on-surface-variant' };
  if (p.starts_at && new Date(p.starts_at) > now) return { label: 'Terjadwal', cls: 'bg-tertiary-fixed text-on-tertiary-fixed' };
  if (p.ends_at && new Date(p.ends_at) < now) return { label: 'Berakhir', cls: 'bg-error-container text-on-error-container' };
  return { label: 'Tayang', cls: 'bg-secondary-container text-on-secondary-container' };
};

const AdminPromos = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => axios.get('/admin/promos').then((r) => setPromos(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus promo ini?')) return;
    try {
      await axios.delete(`/admin/promos/${id}`);
      load();
    } catch {
      alert('Gagal menghapus promo');
    }
  };

  const toggle = async (p) => {
    const data = new FormData();
    data.append('is_active', p.is_active ? '0' : '1');
    await axios.post(`/admin/promos/${p.id}`, data);
    load();
  };

  if (loading) {
    return <div className='p-8 text-center text-on-surface-variant font-bold animate-pulse'>Memuat promo...</div>;
  }

  const live = promos.filter((p) => promoStatus(p).label === 'Tayang');

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-headline-md font-bold text-on-surface'>Pop-Up Promo</h1>
          <p className='text-on-surface-variant mt-2'>Promo tampil sebagai pop-up di website, sekali per kunjungan, beberapa detik setelah halaman dibuka.</p>
        </div>
        <Link to='/admin/promos/new' className='bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-md self-start'>
          <MdAdd className='text-xl' /> Tambah Promo
        </Link>
      </div>

      {live.length > 1 && (
        <div className='mb-6 p-4 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed text-sm font-bold'>
          Ada {live.length} promo yang sedang tayang. Website hanya menampilkan satu: yang terakhir diubah ({live[0]?.title}).
        </div>
      )}

      {promos.length === 0 ? (
        <div className='bg-surface rounded-3xl p-12 text-center border border-outline-variant/30 shadow-sm'>
          <MdCampaign className='text-6xl text-on-surface-variant/30 mx-auto mb-4' />
          <h3 className='text-xl font-bold text-on-surface mb-2'>Belum Ada Promo</h3>
          <p className='text-on-surface-variant'>Tambahkan promo pertama, misalnya cek kesehatan gratis atau diskon layanan.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {promos.map((p) => {
            const st = promoStatus(p);
            return (
              <div key={p.id} className='bg-surface rounded-3xl overflow-hidden border border-outline-variant/30 shadow-sm flex flex-col'>
                <div className='aspect-video bg-surface-container flex items-center justify-center overflow-hidden'>
                  {p.image_path ? (
                    <img src={import.meta.env.VITE_API_BASE_URL + p.image_path} alt={p.title} className='w-full h-full object-cover' />
                  ) : (
                    <MdCampaign className='text-5xl text-on-surface-variant/30' />
                  )}
                </div>
                <div className='p-5 flex flex-col flex-1'>
                  <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-3 ${st.cls}`}>{st.label}</span>
                  <h3 className='font-bold text-lg text-on-surface mb-1'>{p.title}</h3>
                  <p className='text-xs text-on-surface-variant mb-4'>
                    {p.starts_at || p.ends_at ? `${fmt(p.starts_at) || 'Sekarang'} – ${fmt(p.ends_at) || 'tanpa batas'}` : 'Tanpa batas waktu'}
                  </p>
                  <div className='mt-auto flex items-center gap-2'>
                    <button onClick={() => toggle(p)} className='flex-1 text-sm font-bold px-3 py-2 rounded-full bg-surface-container hover:bg-surface-container-highest'>
                      {p.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <Link to={`/admin/promos/edit/${p.id}`} aria-label='Edit' className='p-2 rounded-full text-primary hover:bg-primary/10'><MdEdit className='text-xl' /></Link>
                    <button onClick={() => handleDelete(p.id)} aria-label='Hapus' className='p-2 rounded-full text-error hover:bg-error/10'><MdDelete className='text-xl' /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminPromos;
