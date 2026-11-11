import React, { useEffect, useState } from 'react';
import { MdPause, MdPlayArrow } from 'react-icons/md';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Latar hero dari slider CMS. Slide pertama dimuat sebagai <img> prioritas tinggi (LCP).
 * Tanpa gambar: latar hijau tua brand yang aman untuk teks putih.
 * Slide berganti otomatis kecuali pengguna memilih "kurangi gerakan", dan bisa dijeda.
 */
const HeroSliderBackground = ({ images, overlayClassName = '' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(prefersReducedMotion);

  useEffect(() => {
    if (images.length < 2 || paused) return undefined;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % images.length), 5000);
    return () => clearInterval(timer);
  }, [images.length, paused]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-secondary">
      {images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt=""
          width="1600"
          height="900"
          fetchpriority={idx === 0 ? 'high' : 'low'}
          loading={idx === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      {images.length > 0 && <div className={`absolute inset-0 ${overlayClassName}`}></div>}
      {images.length > 1 && (
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? 'Putar slide gambar' : 'Jeda slide gambar'}
          className="absolute bottom-4 right-4 z-20 w-11 h-11 rounded-lg bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
        >
          {paused ? <MdPlayArrow className="text-2xl" aria-hidden="true" /> : <MdPause className="text-2xl" aria-hidden="true" />}
        </button>
      )}
    </div>
  );
};

export default HeroSliderBackground;
