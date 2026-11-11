import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { mediaUrl } from '../../Contexts/SiteSettingsContext';

const AdminPartners = () => {
  const [partners, setPartners] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(() => {
    axios.get('/admin/partners')
      .then((r) => { setPartners(r.data); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleDelete = async (p) => {
    if (!window.confirm(`Hapus "${p.name}" dari daftar rekan medis?`)) return;
    try {
      await axios.delete(`/admin/partners/${p.id}`);
      load();
    } catch {
      alert('Gagal menghapus');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline-md font-bold text-on-surface">Kelola Rekan Medis</h1>
          <p className="text-on-surface-variant mt-2">Nama dan logo institusi mitra yang berjalan di Beranda.</p>
        </div>
        <Link to="/admin/partners/new" className="bg-primary text-on-primary px-6 min-h-[48px] rounded-full font-bold hover:bg-primary/90 flex items-center gap-2 shadow-md self-start">
          <MdAdd className="text-xl" aria-hidden="true" /> Tambah Mitra
        </Link>
      </div>

      {status === 'loading' && <p className="text-on-surface-variant" role="status">Memuat data…</p>}
      {status === 'error' && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg" role="alert">
          Data gagal dimuat. <button type="button" onClick={load} className="underline font-bold min-h-[44px]">Coba lagi</button>
        </div>
      )}
      {status === 'ready' && partners.length === 0 && (
        <p className="text-on-surface-variant">Belum ada mitra. Jika kosong, bagian Rekan Medis tidak ditampilkan di Beranda.</p>
      )}

      {partners.length > 0 && (
        <ul className="bg-surface rounded-xl border border-outline-variant/40 divide-y divide-outline-variant/40">
          {partners.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="w-32 h-12 rounded-md bg-white border border-outline-variant/40 flex items-center justify-center overflow-hidden shrink-0">
                {p.logo_path
                  ? <img src={mediaUrl(p.logo_path)} alt="" width="120" height="40" className="max-h-10 w-auto max-w-[120px] object-contain" />
                  : <span className="text-xs text-on-surface-variant">Tanpa logo</span>}
              </div>
              <div className="flex-1 min-w-[180px]">
                <p className="font-bold text-on-surface">{p.name}</p>
                <p className="text-xs text-on-surface-variant">urutan {p.sort_order}{p.url ? ` · ${p.url}` : ''}</p>
                {!p.is_active && <p className="text-xs font-bold text-error">Disembunyikan</p>}
              </div>
              <div className="flex gap-1">
                <Link to={`/admin/partners/edit/${p.id}`} aria-label={`Edit ${p.name}`} className="w-11 h-11 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10"><MdEdit className="text-xl" aria-hidden="true" /></Link>
                <button type="button" onClick={() => handleDelete(p)} aria-label={`Hapus ${p.name}`} className="w-11 h-11 flex items-center justify-center rounded-lg text-error hover:bg-error/10"><MdDelete className="text-xl" aria-hidden="true" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPartners;
