import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { MdDomain } from 'react-icons/md';

const FacilitiesSection = () => {
  const [facilities, setFacilities] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | error | ready

  const load = useCallback(() => {
    setStatus('loading');
    axios.get('/facilities')
      .then((res) => { setFacilities(res.data); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <section className="py-section-gap bg-surface">
      <div className="w-full max-w-container-max mx-auto px-gutter">
        <div className="max-w-2xl mb-10">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Fasilitas Kami</h2>
          <p className="font-body-lg text-body-lg text-text-muted mt-3">Ruangan dan sarana yang tersedia di klinik.</p>
        </div>

        {status === 'loading' && (
          <p className="text-on-surface-variant py-10" role="status">Memuat fasilitas…</p>
        )}

        {status === 'error' && (
          <div className="bg-surface-container rounded-xl p-8 max-w-2xl" role="alert">
            <p className="text-on-surface font-medium mb-4">Data fasilitas gagal dimuat. Periksa koneksi internet Anda, lalu coba lagi.</p>
            <button type="button" onClick={load} className="min-h-[44px] px-5 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary/90">
              Muat ulang fasilitas
            </button>
          </div>
        )}

        {status === 'ready' && facilities.length === 0 && (
          <div className="bg-surface-container rounded-xl p-8 max-w-2xl flex gap-4 items-start">
            <MdDomain className="text-4xl text-on-surface-variant shrink-0" aria-hidden="true" />
            <p className="text-on-surface-variant">Foto fasilitas klinik sedang disiapkan.</p>
          </div>
        )}

        {status === 'ready' && facilities.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <li key={facility.id}>
                <figure>
                  <div className="aspect-video bg-surface-container rounded-xl overflow-hidden">
                    {facility.image_path ? (
                      <img
                        src={import.meta.env.VITE_API_BASE_URL + facility.image_path}
                        alt={facility.title}
                        width="640"
                        height="360"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                        <MdDomain className="text-5xl" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <figcaption className="mt-3">
                    <h3 className="font-heading font-semibold text-lg text-on-surface">{facility.title}</h3>
                    {facility.description && <p className="text-on-surface-variant mt-1">{facility.description}</p>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default FacilitiesSection;
