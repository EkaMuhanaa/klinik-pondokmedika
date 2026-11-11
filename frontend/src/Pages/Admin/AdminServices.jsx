import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import ServiceIcon from '../../Components/ServiceIcon';

const Badge = ({ on, children }) => (
  <span className={`text-xs font-bold px-2 py-1 rounded-md ${on ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant line-through'}`}>{children}</span>
);

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(() => {
    axios.get('/admin/services')
      .then((r) => { setServices(r.data); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleDelete = async (svc) => {
    if (!window.confirm(`Hapus layanan "${svc.title}"? Halamannya akan hilang dari website.`)) return;
    try {
      await axios.delete(`/admin/services/${svc.id}`);
      load();
    } catch {
      alert('Gagal menghapus layanan');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline-md font-bold text-on-surface">Kelola Layanan</h1>
          <p className="text-on-surface-variant mt-2">Halaman layanan, daftar layanan di Beranda, dan urutannya.</p>
        </div>
        <Link to="/admin/services/new" className="bg-primary text-on-primary px-6 min-h-[48px] rounded-full font-bold hover:bg-primary/90 flex items-center gap-2 shadow-md self-start">
          <MdAdd className="text-xl" aria-hidden="true" /> Tambah Layanan
        </Link>
      </div>

      {status === 'loading' && <p className="text-on-surface-variant" role="status">Memuat layanan…</p>}
      {status === 'error' && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg" role="alert">
          Data layanan gagal dimuat. <button type="button" onClick={load} className="underline font-bold min-h-[44px]">Coba lagi</button>
        </div>
      )}
      {status === 'ready' && services.length === 0 && <p className="text-on-surface-variant">Belum ada layanan. Tambahkan layanan pertama.</p>}

      {services.length > 0 && (
        <ul className="bg-surface rounded-xl border border-outline-variant/40 divide-y divide-outline-variant/40">
          {services.map((svc) => (
            <li key={svc.id} className="flex flex-wrap items-center gap-4 p-4">
              <span className="text-primary"><ServiceIcon name={svc.icon} className="text-3xl" /></span>
              <div className="flex-1 min-w-[200px]">
                <p className="font-bold text-on-surface">{svc.title} {svc.is_featured && <span className="text-xs font-bold text-primary ml-2">Ditonjolkan</span>}</p>
                <p className="text-xs text-on-surface-variant">/layanan/{svc.slug} · urutan {svc.sort_order}</p>
              </div>
              <div className="flex gap-2">
                <Badge on={svc.is_active}>Halaman</Badge>
                <Badge on={svc.show_on_home}>Beranda</Badge>
              </div>
              <div className="flex gap-1">
                <Link to={`/admin/services/edit/${svc.id}`} aria-label={`Edit ${svc.title}`} className="w-11 h-11 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10"><MdEdit className="text-xl" aria-hidden="true" /></Link>
                <button type="button" onClick={() => handleDelete(svc)} aria-label={`Hapus ${svc.title}`} className="w-11 h-11 flex items-center justify-center rounded-lg text-error hover:bg-error/10"><MdDelete className="text-xl" aria-hidden="true" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminServices;
