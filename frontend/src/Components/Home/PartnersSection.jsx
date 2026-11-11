import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useReducedMotion } from 'motion/react';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import { LogoMarquee } from '@/Components/ui/logo-marquee';
import Reveal from '../Reveal';
import { mediaUrl } from '../../Contexts/SiteSettingsContext';

/**
 * Rekan Medis & Institusi: data dari CMS (menu Kelola Rekan Medis), boleh dengan logo.
 * Berjalan pelan, berhenti saat disorot/disentuh/fokus, dan punya tombol jeda (gerakan > 5 detik
 * wajib bisa dihentikan). Jika perangkat memakai "kurangi gerakan", daftar diam dan bisa digulir.
 */
const PartnersSection = () => {
  const [partners, setPartners] = useState([]);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion() === true;

  useEffect(() => {
    // Bagian ini pelengkap: jika gagal dimuat, cukup tidak ditampilkan
    axios.get('/partners').then((res) => setPartners(res.data)).catch(() => setPartners([]));
  }, []);

  if (!partners.length) return null;

  const items = partners.map((p) => ({
    id: String(p.id),
    label: p.name,
    href: p.url || undefined,
    mark: p.logo_path ? (
      <img
        src={mediaUrl(p.logo_path)}
        alt=""
        width="140"
        height="40"
        loading="lazy"
        className="h-10 w-auto max-w-[140px] object-contain"
      />
    ) : undefined,
  }));

  return (
    <Reveal as="section" className="py-14 bg-surface-container-low border-y border-outline-variant/40">
      <div className="w-full max-w-container-max mx-auto px-gutter">
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="font-headline-md text-headline-md text-on-surface">Rekan Medis &amp; Institusi Kami</h2>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? 'Putar daftar rekan medis' : 'Jeda daftar rekan medis'}
              aria-pressed={paused}
              className="w-11 h-11 shrink-0 flex items-center justify-center rounded-lg border border-outline-variant bg-white text-on-surface hover:border-primary hover:text-primary"
            >
              {paused ? <MdPlayArrow className="text-2xl" aria-hidden="true" /> : <MdPause className="text-2xl" aria-hidden="true" />}
            </button>
          )}
        </div>
        <LogoMarquee items={items} label="Rekan medis dan institusi" speed={32} gap={36} paused={paused} />
      </div>
    </Reveal>
  );
};

export default PartnersSection;
