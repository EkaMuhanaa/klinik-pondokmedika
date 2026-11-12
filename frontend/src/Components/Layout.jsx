import React, { useEffect, useState } from 'react';
import { MdClose, MdCall, MdMail, MdMenu } from 'react-icons/md';
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import WhatsAppCTA from './WhatsAppCTA';
import PromoPopup from './PromoPopup';
import Seo from './Seo';
import { useServices, useSiteSettings } from '../Contexts/SiteSettingsContext';
import { fullAddress, localArea, openingDaysText, hoursText, whatsappLink, pageServices, socialHandle } from '../seo/meta';
import { lockScroll } from '../lib/smoothScroll';

/**
 * seo: props untuk <Seo> (title, description, image, type, noindex, jsonLd).
 * overlayHeader: navbar transparan di atas hero gelap, menjadi putih setelah digulir.
 */
const Layout = ({ children, seo, overlayHeader = false }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settings = useSiteSettings();
  const { services } = useServices();
  const socials = [
    { url: settings.instagram_url, label: 'Instagram', Icon: FaInstagram },
    { url: settings.facebook_url, label: 'Facebook', Icon: FaFacebook },
    { url: settings.tiktok_url, label: 'TikTok', Icon: FaTiktok },
    { url: settings.youtube_url, label: 'YouTube', Icon: FaYoutube },
  ].filter((x) => x.url);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!overlayHeader) return undefined;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlayHeader]);

  // Kunci scroll halaman saat menu HP terbuka
  useEffect(() => {
    lockScroll(isMobileMenuOpen);
    return () => lockScroll(false);
  }, [isMobileMenuOpen]);

  // Transparan hanya di atas hero gelap dan sebelum digulir
  const clear = overlayHeader && !scrolled && !isMobileMenuOpen;
  const linkBase = 'transition-colors inline-flex items-center min-h-[44px]';
  const navLink = (path) => (isActive(path)
    ? `${clear ? 'text-white border-white' : 'text-primary border-primary'} border-b-2 pb-1 font-bold ${linkBase}`
    : `${clear ? 'text-white hover:text-white/80' : 'text-on-surface-variant hover:text-primary'} ${linkBase}`);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <Seo {...(seo || {})} />
      <header
        className={`${overlayHeader ? 'fixed inset-x-0' : 'sticky'} top-0 z-50 w-full transition-[background-color,box-shadow] duration-300 ${clear ? 'bg-transparent' : 'bg-white shadow-sm'}`}
      >
        <nav className="flex justify-between items-center px-gutter py-4 w-full max-w-container-max mx-auto">
          <Link to="/" className="flex items-center gap-3 min-h-[44px]">
            <img
              alt={`${settings.clinic_name}, ke beranda`}
              width="110"
              height="48"
              className="h-10 md:h-12 w-auto object-contain"
              src={clear ? '/images/logo-wide-light.png' : '/images/logo-wide.png'}
            />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 font-body-md text-body-md">
            <Link to="/" className={navLink('/')}>Beranda</Link>
            <Link to="/tentang-kami" className={navLink('/tentang-kami')}>Tentang Kami</Link>
            <Link to="/layanan" className={navLink('/layanan')}>Layanan</Link>
            <Link to="/artikel" className={navLink('/artikel')}>Artikel</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            type="button"
            className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-lg transition-colors ${clear ? 'text-white [@media(hover:hover)]:hover:bg-white/10' : 'text-on-surface [@media(hover:hover)]:hover:bg-surface-container'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <MdClose className="text-3xl" />
            ) : (
              <MdMenu className="text-3xl" />
            )}
          </button>
        </nav>

        {/* Mobile Dropdown Menu -> Side Navbar */}
        <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm"
              />
              
              {/* Sidebar */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white z-[60] shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-outline-variant">
                  <h2 className="font-headline-sm font-bold text-primary">Menu</h2>
                  <button 
                    type="button"
                    className="w-11 h-11 flex items-center justify-center text-on-surface rounded-lg hover:bg-surface-container transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Tutup menu"
                  >
                    <MdClose className="text-3xl" />
                  </button>
                </div>
                
                <nav aria-label="Menu utama" className="flex flex-col px-6 py-6 gap-2 text-lg overflow-y-auto">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/') ? 'text-primary font-bold border-r-4 border-primary pr-4' : 'text-on-surface-variant'} hover:text-primary transition-colors flex items-center min-h-[48px] w-full`}>Beranda</Link>
                  <Link to="/tentang-kami" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/tentang-kami') ? 'text-primary font-bold border-r-4 border-primary pr-4' : 'text-on-surface-variant'} hover:text-primary transition-colors flex items-center min-h-[48px] w-full`}>Tentang Kami</Link>
                  <Link to="/layanan" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/layanan') ? 'text-primary font-bold border-r-4 border-primary pr-4' : 'text-on-surface-variant'} hover:text-primary transition-colors flex items-center min-h-[48px] w-full`}>Layanan</Link>
                  <Link to="/artikel" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/artikel') ? 'text-primary font-bold border-r-4 border-primary pr-4' : 'text-on-surface-variant'} hover:text-primary transition-colors flex items-center min-h-[48px] w-full`}>Artikel</Link>
                </nav>

                <div className="mt-auto p-6 border-t border-outline-variant text-center">
                  <p className="text-sm text-text-muted mb-2">Pendaftaran &amp; informasi</p>
                  <a href={whatsappLink(settings)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 min-h-[48px] font-bold text-on-whatsapp bg-whatsapp-green rounded-full hover:brightness-95 transition">
                    <MdCall aria-hidden="true" />
                    {settings.phone}
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        </MotionConfig>
      </header>
      
      <main>
        {children}
      </main>

      <WhatsAppCTA />
      <PromoPopup />

      <footer className="bg-secondary text-white">
        <div className="w-full max-w-container-max mx-auto px-gutter py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          {/* Identitas & kontak: blok utama footer */}
          <div>
            <Link to="/" className="inline-flex mb-4" aria-label={`${settings.clinic_name}, ke beranda`}>
              <img src="/images/logo-wide-light.png" alt={settings.clinic_name} width="183" height="80" className="h-16 w-auto" loading="lazy" />
            </Link>
            <p className="text-white/90 mb-6">{settings.tagline}</p>
            <address className="not-italic space-y-3 text-white">
              <a href={settings.maps_url} target="_blank" rel="noreferrer" className="block leading-relaxed underline-offset-4 hover:underline">
                {fullAddress(settings)}
              </a>
              <p>{openingDaysText(settings)} {hoursText(settings)}{settings.hours_note ? `. ${settings.hours_note}` : ''}</p>
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 min-h-[44px] hover:underline underline-offset-4">
                  <MdMail aria-hidden="true" /> {settings.email}
                </a>
              )}
            </address>
            <a
              href={whatsappLink(settings)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 min-h-[48px] px-6 rounded-full bg-whatsapp-green text-on-whatsapp font-bold hover:brightness-95 transition"
            >
              <MdCall aria-hidden="true" /> WhatsApp {settings.phone}
            </a>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg mb-3">Layanan</h2>
            <ul>
              {pageServices(services).map((svc) => (
                <li key={svc.slug}><Link to={`/layanan/${svc.slug}`} className="tap-target text-white/90 hover:text-white hover:underline underline-offset-4">{svc.title}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg mb-3">Halaman</h2>
            <ul>
              <li><Link to="/" className="tap-target text-white/90 hover:text-white hover:underline underline-offset-4">Beranda</Link></li>
              <li><Link to="/tentang-kami" className="tap-target text-white/90 hover:text-white hover:underline underline-offset-4">Tentang Kami</Link></li>
              <li><Link to="/layanan" className="tap-target text-white/90 hover:text-white hover:underline underline-offset-4">Layanan</Link></li>
              <li><Link to="/artikel" className="tap-target text-white/90 hover:text-white hover:underline underline-offset-4">Artikel &amp; Edukasi</Link></li>
            </ul>
          </div>

          {socials.length > 0 && (
            <div>
              <h2 className="font-heading font-semibold text-lg mb-3">Ikuti Kami</h2>
              <ul>
                {socials.map(({ url, label, Icon }) => (
                  <li key={label}>
                    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${label} ${socialHandle(url)}`} className="tap-target gap-3 text-white/90 hover:text-white hover:underline underline-offset-4">
                      <Icon className="text-xl shrink-0" aria-hidden="true" />
                      <span>{socialHandle(url)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {settings.service_area && (
          <div className="w-full max-w-container-max mx-auto px-gutter pb-8 text-sm text-white/90">
            <p>
              <strong className="text-white">Wilayah layanan:</strong> {settings.clinic_name} melayani pasien dari {settings.service_area}.
              Klinik umum, dokter gigi, dan KIA terdekat di {localArea(settings)}.
            </p>
          </div>
        )}
        <div className="border-t border-white/20 py-6 px-gutter">
          <p className="max-w-container-max mx-auto text-sm text-white/90">
            © {new Date().getFullYear()} {settings.clinic_name}. Hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Layout;
