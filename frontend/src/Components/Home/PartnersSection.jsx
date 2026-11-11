import React, { useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import { LogoMarquee } from '@/Components/ui/logo-marquee';

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/**
 * Rekan Medis & Institusi: nama dari CMS (Pengaturan Klinik → Rekan Medis), satu per baris.
 * Berjalan pelan, berhenti saat disorot/disentuh/fokus, dan punya tombol jeda (gerakan > 5 detik
 * wajib bisa dihentikan). Jika perangkat memakai "kurangi gerakan", daftar diam dan bisa digulir.
 */
const PartnersSection = ({ partners }) => {
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion() === true;

  if (!partners.length) return null;

  const items = partners.map((name, i) => ({ id: `${slug(name)}-${i}`, label: name }));

  return (
    <section className="py-14 bg-surface-container-low border-y border-outline-variant/40">
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
    </section>
  );
};

export default PartnersSection;
