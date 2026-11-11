import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdClose } from 'react-icons/md';
import { lockScroll } from '../lib/smoothScroll';

const SHOW_DELAY_MS = 4000; // jangan langsung menutupi konten (ramah SEO & pengguna)

const storageKey = (promo) => `promo_closed_${promo.id}_${promo.updated_at}`;

const wasClosed = (promo) => {
  try { return sessionStorage.getItem(storageKey(promo)) === '1'; } catch { return false; }
};

/** Pop-up promo dari CMS. Tampil sekali per sesi browser, setelah jeda beberapa detik. */
const PromoPopup = () => {
  const [promo, setPromo] = useState(null);
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    let timer;
    axios.get('/promos/active')
      .then((res) => {
        const p = res.data && res.data.id ? res.data : null;
        if (p && !wasClosed(p)) {
          setPromo(p);
          timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
        }
      })
      .catch(() => {});
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setOpen(false);
    try { sessionStorage.setItem(storageKey(promo), '1'); } catch { /* abaikan */ }
  };

  useEffect(() => {
    if (!open) return undefined;
    lockScroll(true);
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!promo || !open) return null;

  const url = promo.button_url;
  const internal = url && url.startsWith('/');
  const btnClass = 'flex items-center justify-center w-full min-h-[48px] text-center bg-primary text-on-primary font-bold px-6 rounded-full hover:bg-primary/90 transition-colors';

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="promo-title">
      <div className="absolute inset-0 bg-black/50" onClick={close} aria-hidden="true" />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-xl sm:rounded-xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <button
          ref={closeRef}
          onClick={close}
          aria-label="Tutup promo"
          className="absolute top-3 right-3 z-10 w-11 h-11 rounded-lg bg-white/95 border border-outline-variant flex items-center justify-center text-on-surface hover:bg-white"
        >
          <MdClose className="text-2xl" aria-hidden="true" />
        </button>
        {promo.image_path && (
          <img
            src={import.meta.env.VITE_API_BASE_URL + promo.image_path}
            alt={promo.title}
            width="800"
            height="1000"
            className="w-full h-auto max-h-[45vh] object-contain bg-surface-container"
          />
        )}
        <div className="p-6 overflow-y-auto">
          <h2 id="promo-title" className="font-headline-md text-headline-md text-on-surface mb-2 pr-8">{promo.title}</h2>
          {promo.description && (
            <p className="text-on-surface-variant whitespace-pre-line mb-5">{promo.description}</p>
          )}
          {url && (
            internal ? (
              <Link to={url} onClick={close} className={btnClass}>{promo.button_text || 'Lihat Detail'}</Link>
            ) : (
              <a href={url} target="_blank" rel="noopener noreferrer" onClick={close} className={btnClass}>{promo.button_text || 'Lihat Detail'}</a>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
