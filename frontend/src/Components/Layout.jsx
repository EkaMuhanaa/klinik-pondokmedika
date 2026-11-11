import React, { useState } from 'react';
import { MdClose, MdCall, MdMail, MdMenu } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import WhatsAppCTA from './WhatsAppCTA';
import PromoPopup from './PromoPopup';
import Seo from './Seo';
import { useServices, useSiteSettings } from '../Contexts/SiteSettingsContext';
import { fullAddress, localArea, openingDaysText, hoursText, whatsappLink, pageServices } from '../seo/meta';

/** seo: props untuk <Seo> (title, description, image, type, noindex, jsonLd). */
const Layout = ({ children, seo }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settings = useSiteSettings();
  const { services } = useServices();
  const socials = [
    { url: settings.instagram_url, label: 'Instagram' },
    { url: settings.facebook_url, label: 'Facebook' },
    { url: settings.tiktok_url, label: 'TikTok' },
    { url: settings.youtube_url, label: 'YouTube' },
  ].filter((x) => x.url);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <Seo {...(seo || {})} />
      <header className="docked full-width top-0 sticky z-50 bg-white shadow-sm">
        <nav className="flex justify-between items-center px-gutter py-4 w-full max-w-container-max mx-auto">
          <Link to="/" className="flex items-center gap-3 min-h-[44px]">
            <img
              alt={`${settings.clinic_name}, ke beranda`}
              width="110"
              height="48"
              className="h-10 md:h-12 w-auto object-contain"
              src="/images/logo-wide.png"
            />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 font-body-md text-body-md">
            <Link to="/" className={`${isActive('/') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant'} hover:text-primary transition-colors inline-flex items-center min-h-[44px]`}>Beranda</Link>
            <Link to="/tentang-kami" className={`${isActive('/tentang-kami') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant'} hover:text-primary transition-colors inline-flex items-center min-h-[44px]`}>Tentang Kami</Link>
            <Link to="/layanan" className={`${isActive('/layanan') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant'} hover:text-primary transition-colors inline-flex items-center min-h-[44px]`}>Layanan</Link>
            <Link to="/artikel" className={`${isActive('/artikel') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant'} hover:text-primary transition-colors inline-flex items-center min-h-[44px]`}>Artikel</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            type="button"
            className="lg:hidden w-11 h-11 flex items-center justify-center text-on-surface rounded-lg hover:bg-surface-container transition-colors"
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
        <div className="w-full max-w-container-max mx-auto px-gutter py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-10">
          {/* Identitas & kontak: blok utama footer */}
          <div>
            <p className="font-heading text-2xl font-bold mb-2">{settings.clinic_name}</p>
            <p className="text-white/90 mb-6">{settings.tagline}</p>
            <address className="not-italic space-y-3 text-white">
              <a href={settings.maps_url} target="_blank" rel="noreferrer" className="block leading-relaxed underline-offset-4 hover:underline">
                {fullAddress(settings)}
              </a>
              <p>{openingDaysText(settings)} {hoursText(settings)}{settings.hours_note ? `. ${settings.hours_note}` : ''}</p>
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
              {settings.email && (
                <li><a href={`mailto:${settings.email}`} className="tap-target gap-2 text-white/90 hover:text-white hover:underline underline-offset-4"><MdMail aria-hidden="true" /> {settings.email}</a></li>
              )}
              {socials.map((x) => (
                <li key={x.label}><a href={x.url} target="_blank" rel="noopener noreferrer" className="tap-target text-white/90 hover:text-white hover:underline underline-offset-4">{x.label}</a></li>
              ))}
            </ul>
          </div>
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
