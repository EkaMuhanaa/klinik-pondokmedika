import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop, startSmoothScroll, stopSmoothScroll } from '../lib/smoothScroll';

/** Ke atas saat pindah halaman, dan nyalakan smooth scroll hanya di halaman publik. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) stopSmoothScroll();
    else startSmoothScroll();
  }, [isAdmin]);

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
