// Smooth scroll halaman publik dengan Lenis. Tidak aktif di panel admin dan
// tidak aktif jika perangkat memakai "kurangi gerakan".
import Lenis from 'lenis';

let lenis = null;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return;
  lenis = new Lenis({
    autoRaf: true,
    duration: 1.0,
    anchors: { offset: -80 }, // link #id (mis. #dokter) ikut halus, memperhitungkan tinggi navbar
  });
}

export function stopSmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

/** Kunci/lepas scroll halaman (mis. saat pop-up atau menu HP terbuka). */
export function lockScroll(locked) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}
