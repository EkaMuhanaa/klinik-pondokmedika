import React, { useState } from 'react';
import { MdClose, MdCall, MdMail, MdMenu } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppCTA from './WhatsAppCTA';
import PromoPopup from './PromoPopup';
import Seo from './Seo';
import { useSiteSettings } from '../Contexts/SiteSettingsContext';
import { services } from '../data/services';
import { fullAddress, localArea, openingDaysText, hoursText, whatsappLink } from '../seo/meta';

/** seo: props untuk <Seo> (title, description, image, type, noindex, jsonLd). */
const Layout = ({ children, seo }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settings = useSiteSettings();
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
          <Link to="/" className="flex items-center gap-3">
            <img 
              alt="Logo Klinik Pondok Medika" 
              className="h-10 md:h-12 w-auto object-contain" 
              src="/images/logo-wide.png" 
            />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 font-body-md text-body-md">
            <Link to="/" className={`${isActive('/') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant'} hover:text-primary transition-colors`}>Beranda</Link>
            <Link to="/tentang-kami" className={`${isActive('/tentang-kami') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant'} hover:text-primary transition-colors`}>Tentang Kami</Link>
            <Link to="/layanan" className={`${isActive('/layanan') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant'} hover:text-primary transition-colors`}>Layanan</Link>
            <Link to="/artikel" className={`${isActive('/artikel') ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant'} hover:text-primary transition-colors`}>Artikel</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-on-surface rounded-md hover:bg-surface-container transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <MdClose className="text-3xl" />
            ) : (
              <MdMenu className="text-3xl" />
            )}
          </button>
        </nav>

        {/* Mobile Dropdown Menu -> Side Navbar */}
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
                    className="p-2 text-on-surface rounded-md hover:bg-surface-container transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <MdClose className="text-3xl" />
                  </button>
                </div>
                
                <div className="flex flex-col px-6 py-8 gap-8 text-lg overflow-y-auto">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/') ? 'text-primary font-bold border-r-4 border-primary pr-4' : 'text-on-surface-variant'} hover:text-primary transition-colors block w-full`}>Beranda</Link>
                  <Link to="/tentang-kami" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/tentang-kami') ? 'text-primary font-bold border-r-4 border-primary pr-4' : 'text-on-surface-variant'} hover:text-primary transition-colors block w-full`}>Tentang Kami</Link>
                  <Link to="/layanan" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/layanan') ? 'text-primary font-bold border-r-4 border-primary pr-4' : 'text-on-surface-variant'} hover:text-primary transition-colors block w-full`}>Layanan</Link>
                  <Link to="/artikel" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/artikel') ? 'text-primary font-bold border-r-4 border-primary pr-4' : 'text-on-surface-variant'} hover:text-primary transition-colors block w-full`}>Artikel</Link>
                </div>

                <div className="mt-auto p-6 border-t border-outline-variant text-center">
                  <p className="text-sm text-text-muted mb-2">Pusat Informasi</p>
                  <a href={whatsappLink(settings)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 font-bold text-whatsapp-green bg-whatsapp-green/10 py-3 rounded-full hover:bg-whatsapp-green/20 transition-colors">
                    <MdCall />
                    {settings.phone}
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      
      <main>
        {children}
      </main>

      <WhatsAppCTA />
      <PromoPopup />

      <footer className="bg-white text-on-surface border-t border-outline-variant/30">
        <div className="w-full max-w-container-max mx-auto px-gutter flex flex-col lg:flex-row lg:justify-between gap-10 mb-12 py-section-gap">
          <div className="lg:w-1/4 shrink-0">
            <div className="mb-4">
              <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                <img src="/images/logo-wide.png" alt="Logo Klinik Pondok Medika" className="h-12 object-contain" onError={(e) => e.target.style.display='none'} />
              </Link>
            </div>
            <div className="font-headline-md text-headline-md font-bold text-on-surface mb-4">
                {settings.clinic_name}
            </div>
            <p className="text-on-surface/80 text-body-md mb-6">
                {settings.tagline}
            </p>
            <address className="not-italic text-on-surface/80 text-body-md space-y-2">
              <a href={settings.maps_url} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors leading-relaxed block">
                {fullAddress(settings)}
              </a>
              <a href={whatsappLink(settings)} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors block">
                WhatsApp/Telp: {settings.phone}
              </a>
              <p>{openingDaysText(settings)} {hoursText(settings)}{settings.hours_note ? ` · ${settings.hours_note}` : ''}</p>
            </address>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-wider text-sm text-black">Navigasi</h4>
            <ul className="space-y-4 text-on-surface/80">
              <li><Link to="/" className="hover:text-primary transition-colors">Beranda</Link></li>
              <li><Link to="/tentang-kami" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link to="/layanan" className="hover:text-primary transition-colors">Layanan Unggulan</Link></li>
              <li><Link to="/artikel" className="hover:text-primary transition-colors">Artikel & Edukasi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-wider text-sm text-black">Layanan</h4>
            <ul className="space-y-4 text-on-surface/80">
              {services.map((svc) => (
                <li key={svc.slug}><Link to={`/layanan/${svc.slug}`} className="hover:text-primary transition-colors">{svc.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-wider text-sm text-black">Hubungi Kami</h4>
            <ul className="space-y-4 text-on-surface/80">
              <li>
                <a className="flex items-center gap-3 hover:text-primary transition-colors" href={whatsappLink(settings)} target="_blank" rel="noreferrer">
                  <MdCall className="text-sm" />
                  <span>WhatsApp</span>
                </a>
              </li>
              {settings.email && (
                <li>
                  <a className="flex items-center gap-3 hover:text-primary transition-colors" href={`mailto:${settings.email}`}>
                    <MdMail className="text-sm" />
                    <span>Email</span>
                  </a>
                </li>
              )}
              {socials.map((x) => (
                <li key={x.label}>
                  <a className="hover:text-primary transition-colors" href={x.url} target="_blank" rel="noopener noreferrer">{x.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {settings.service_area && (
          <div className="w-full max-w-container-max mx-auto px-gutter pb-8 text-sm text-on-surface/70">
            <p>
              <strong className="text-on-surface">Wilayah layanan:</strong> {settings.clinic_name} melayani pasien dari {settings.service_area}.
              Klinik umum, dokter gigi, dan KIA terdekat di {localArea(settings)}.
            </p>
          </div>
        )}
        <div className="border-t border-on-surface/10 py-6 px-gutter">
          <div className="max-w-container-max mx-auto text-center md:text-left">
            <p className="text-sm opacity-60 font-body-md">
                © {new Date().getFullYear()} {settings.clinic_name}. Hak cipta dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
