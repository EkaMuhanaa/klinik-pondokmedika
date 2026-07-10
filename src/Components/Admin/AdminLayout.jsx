import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Artikel & Edukasi', path: '/admin/articles', icon: 'article' },
    { name: 'Kelola Latar / Slider', path: '/admin/sliders', icon: 'imagesmode' },
  ];

  return (
    <div className='min-h-screen bg-surface-container-lowest flex font-sans'>
      {/* Sidebar */}
      <aside className='w-64 bg-surface text-on-surface border-r border-outline-variant/30 flex flex-col shadow-sm hidden md:flex'>
        <div className='p-6 border-b border-outline-variant/30'>
          <h2 className='text-2xl font-headline-md font-bold text-primary'>Klinik Admin</h2>
        </div>
        
        <nav className='flex-1 p-4 space-y-2'>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                location.pathname.startsWith(item.path)
                  ? 'bg-primary text-on-primary font-bold shadow-md'
                  : 'hover:bg-primary/10 text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className='material-symbols-outlined'>{item.icon}</span>
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
            <span className='material-symbols-outlined'>logout</span>
            Keluar
          </button>
        </div>
      </aside>

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
