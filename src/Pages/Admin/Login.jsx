import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/admin/articles');
    } catch (err) {
      setError('Email atau password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-surface-container-lowest flex items-center justify-center p-4 font-sans'>
      <div className='bg-surface w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-outline-variant/30'>
        <div className='p-8 sm:p-10'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4'>
              <span className='material-symbols-outlined text-3xl'>admin_panel_settings</span>
            </div>
            <h1 className='text-2xl font-headline-md font-bold text-on-surface'>Login Admin</h1>
            <p className='text-on-surface-variant mt-2'>Masuk ke panel manajemen Klinik Pondok Medika</p>
          </div>

          {error && (
            <div className='bg-error/10 text-error px-4 py-3 rounded-xl mb-6 flex items-center gap-2'>
              <span className='material-symbols-outlined'>error</span>
              <p className='text-sm'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-bold text-on-surface mb-2'>Email</label>
              <input 
                type='email' 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 rounded-xl bg-surface-container border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none'
                placeholder='admin@pm.com'
              />
            </div>
            <div>
              <label className='block text-sm font-bold text-on-surface mb-2'>Password</label>
              <input 
                type='password' 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                className='w-full px-4 py-3 rounded-xl bg-surface-container border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none'
                placeholder='••••••••'
              />
            </div>
            
            <button 
              type='submit' 
              disabled={loading}
              className='w-full bg-primary text-on-primary py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:scale-100 mt-8'
            >
              {loading ? (
                <span className='material-symbols-outlined animate-spin'>progress_activity</span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

