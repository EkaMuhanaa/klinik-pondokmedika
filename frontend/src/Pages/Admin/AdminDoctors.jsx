import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { mediaUrl } from '../../Contexts/SiteSettingsContext';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(() => {
    axios.get('/admin/doctors')
      .then((r) => { setDoctors(r.data); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleDelete = async (doc) => {
    if (!window.confirm(`Hapus ${doc.name} dari website?`)) return;
    try {
      await axios.delete(`/admin/doctors/${doc.id}`);
      load();
    } catch {
      alert('Gagal menghapus dokter');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline-md font-bold text-on-surface">Kelola Dokter</h1>
          <p className="text-on-surface-variant mt-2">Foto, nama, spesialisasi, dan jadwal praktik yang tampil di Beranda.</p>
        </div>
        <Link to="/admin/doctors/new" className="bg-primary text-on-primary px-6 min-h-[48px] rounded-full font-bold hover:bg-primary/90 flex items-center gap-2 shadow-md self-start">
          <MdAdd className="text-xl" aria-hidden="true" /> Tambah Dokter
        </Link>
      </div>

      {status === 'loading' && <p className="text-on-surface-variant" role="status">Memuat dokter…</p>}
      {status === 'error' && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg" role="alert">
          Data dokter gagal dimuat. <button type="button" onClick={load} className="underline font-bold min-h-[44px]">Coba lagi</button>
        </div>
      )}
      {status === 'ready' && doctors.length === 0 && <p className="text-on-surface-variant">Belum ada dokter. Tambahkan dokter pertama.</p>}

      {doctors.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <li key={doc.id} className="bg-surface rounded-xl border border-outline-variant/40 overflow-hidden flex">
              <img
                src={doc.photo_path ? mediaUrl(doc.photo_path) : '/images/placeholder-dokter.svg'}
                alt=""
                width="120"
                height="150"
                className="w-28 object-cover bg-surface-container"
              />
              <div className="p-4 flex flex-col flex-1 min-w-0">
                <p className="font-bold text-on-surface truncate">{doc.name}</p>
                <p className="text-sm text-on-surface-variant">{doc.specialty || 'Tanpa spesialisasi'}</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {(doc.schedule || []).map((s) => s.day).join(', ') || 'Belum ada jadwal'}
                </p>
                {!doc.is_active && <p className="text-xs font-bold text-error mt-1">Disembunyikan</p>}
                {!doc.photo_path && <p className="text-xs font-bold text-[#92400e] mt-1">Belum ada foto</p>}
                <div className="mt-auto pt-3 flex gap-1">
                  <Link to={`/admin/doctors/edit/${doc.id}`} aria-label={`Edit ${doc.name}`} className="w-11 h-11 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10"><MdEdit className="text-xl" aria-hidden="true" /></Link>
                  <button type="button" onClick={() => handleDelete(doc)} aria-label={`Hapus ${doc.name}`} className="w-11 h-11 flex items-center justify-center rounded-lg text-error hover:bg-error/10"><MdDelete className="text-xl" aria-hidden="true" /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDoctors;
