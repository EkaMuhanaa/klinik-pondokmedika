import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdLogout, MdArticle, MdImage, MdMenu, MdClose } from 'react-icons/md';
import { useState } from 'react';
import { useAuth } from '../../Contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Artikel & Edukasi', path: '/admin/articles', icon: <MdArticle className='text-xl' /> },
    { name: 'Kelola Latar / Slider', path: '/admin/sliders', icon: <MdImage className='text-xl' /> },
  ];

  return (
    <div className='min-h-screen bg-surface-container-lowest flex font-sans'>
      {/* Sidebar */}
      <aside className={`w-64 bg-surface text-on-surface border-r border-outline-variant/30 flex flex-col shadow-sm fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='p-6 border-b border-outline-variant/30 flex justify-between items-center'>
          <h2 className='text-2xl font-headline-md font-bold text-primary'>Klinik Admin</h2>
        </div>
        
        <nav className='flex-1 p-4 space-y-2'>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                location.pathname.startsWith(item.path)
                  ? 'bg-primary text-on-primary font-bold shadow-md'
                  : 'hover:bg-primary/10 text-on-surface-variant hover:text-primary'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className='p-4 border-t border-outline-variant/30'>
          <div className='mb-4 px-4'>
            <p className='text-xs text-on-surface-variant uppercase font-bold tracking-wider'>Masuk sebagai</p>
            <p className='font-bold truncate'>{user?.name || 'Admin'}</p>
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/10 rounded-xl transition-colors font-bold'
          >
            <MdLogout className='text-xl' />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className='fixed inset-0 bg-black/50 z-40 md:hidden' 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Main Content */}
      <main className='flex-1 flex flex-col min-w-0 overflow-hidden'>
        <header className='bg-surface border-b border-outline-variant/30 py-4 px-8 flex justify-between items-center shadow-sm md:hidden'>
          <h2 className='text-xl font-bold text-primary'>Klinik Admin</h2>
          <button onClick={handleLogout} className='text-error font-bold'>Keluar</button>
        </header>
        <div className='flex-1 overflow-auto p-8'>
          <div className='max-w-container-max mx-auto'>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
