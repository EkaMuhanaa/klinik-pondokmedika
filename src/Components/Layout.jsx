import React, { useState } from 'react';
import { MdClose, MdCall, MdMail, MdMenu } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppCTA from './WhatsAppCTA';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
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
                  <a href="https://wa.me/6281234163128" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 font-bold text-whatsapp-green bg-whatsapp-green/10 py-3 rounded-full hover:bg-whatsapp-green/20 transition-colors">
                    <MdCall />
                    0812-3416-3128
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

      <footer className="bg-white text-on-surface border-t border-outline-variant/30">
        <div className="w-full max-w-container-max mx-auto px-gutter flex flex-col lg:flex-row lg:justify-between gap-10 mb-12 py-section-gap">
          <div className="lg:w-1/4 shrink-0">
            <div className="mb-4">
              <img src="/images/logo-wide.png" alt="Logo Klinik Pondok Medika" className="h-12 object-contain" onError={(e) => e.target.style.display='none'} />
            </div>
            <div className="font-headline-md text-headline-md font-bold text-on-surface mb-4">
                Klinik Pondok Medika
            </div>
            <p className="text-on-surface/80 text-body-md mb-6">
                Mitra kesehatan terpercaya untuk pelayanan medis bermutu, profesional, dan paripurna di jantung kota.
            </p>
            <div className="text-on-surface/80 text-body-md">
              <a href="https://maps.app.goo.gl/GMcezqSdHjVpFzjp7" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors leading-relaxed block">
                Jl. Raya Pondok Indah No. 123,<br/>Jakarta Selatan, 12310
              </a>
            </div>
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
              <li><Link to="/layanan" className="hover:text-primary transition-colors">Poli Umum</Link></li>
              <li><Link to="/layanan" className="hover:text-primary transition-colors">Poli Gigi</Link></li>
              <li><Link to="/layanan" className="hover:text-primary transition-colors">Poli KIA</Link></li>
              <li><Link to="/layanan" className="hover:text-primary transition-colors">Laboratorium</Link></li>
              <li><Link to="/layanan" className="hover:text-primary transition-colors">Apotek 24 Jam</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-wider text-sm text-black">Social Media</h4>
            <ul className="space-y-4 text-on-surface/80">
              <li>
                <a className="flex items-center gap-3 hover:text-primary transition-colors" href="mailto:info@pondokmedika.com">
                  <MdMail className="text-sm" />
                  <span>Email</span>
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 hover:text-primary transition-colors" href="#">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 hover:text-primary transition-colors" href="#">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L273 181.6 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                  <span>X (Twitter)</span>
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 hover:text-primary transition-colors" href="#">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512"><path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/></svg>
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-wider text-sm text-black">Informasi</h4>
            <ul className="space-y-4 text-on-surface/80">
              <li><Link to="/kebijakan-privasi" className="hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/syarat-ketentuan" className="hover:text-primary transition-colors">Syarat &amp; Ketentuan</Link></li>
              <li><Link to="/bantuan" className="hover:text-primary transition-colors">Pusat Bantuan</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-on-surface/10 py-6 px-gutter">
          <div className="max-w-container-max mx-auto text-center md:text-left">
            <p className="text-sm opacity-60 font-body-md">
                © 2026 Klinik Pondok Medika. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
