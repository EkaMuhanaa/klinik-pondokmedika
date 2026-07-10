import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdHourglassEmpty, MdUpload, MdImage, MdDelete } from 'react-icons/md';

const pages = [
  { id: 'home', name: 'Beranda' },
  { id: 'about', name: 'Tentang Kami' },
  { id: 'services', name: 'Layanan' },
  { id: 'articles', name: 'Artikel & Edukasi' }
];

const AdminSliders = () => {
  const [activePage, setActivePage] = useState('home');
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSliders = async (pageId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/sliders/${pageId}`);
      setSliders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders(activePage);
  }, [activePage]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (sliders.length + files.length > 4) {
      setMessage(`Gagal: Maksimal hanya diperbolehkan 4 gambar slider per halaman. Saat ini sudah ada ${sliders.length} gambar.`);
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const uploadPromises = files.map(file => {
        const data = new FormData();
        data.append('page', activePage);
        data.append('image', file);
        return axios.post('/admin/sliders', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      });

      await Promise.all(uploadPromises);
      setMessage(`Berhasil menambahkan ${files.length} gambar ke slider!`);
      fetchSliders(activePage);
    } catch (err) {
      console.error(err);
      setMessage('Beberapa gambar mungkin gagal diunggah. Silakan coba lagi.');
      fetchSliders(activePage);
    } finally {
      setUploading(false);
      // Reset input file
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus gambar ini dari slider?')) {
      try {
        await axios.delete(`/admin/sliders/${id}`);
        setSliders(sliders.filter(s => s.id !== id));
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus gambar');
      }
    }
  };

  return (
    <div>
      <h1 className='text-3xl font-headline-lg font-bold text-on-surface mb-8'>Kelola Latar Belakang (Slider)</h1>

      {message && (
        <div className={`px-4 py-3 rounded-xl mb-6 font-bold ${message.includes('Gagal') ? 'bg-error/10 text-error' : 'bg-whatsapp-green/10 text-whatsapp-green'}`}>
          {message}
        </div>
      )}

      {/* Page Selector */}
      <div className='flex gap-2 mb-8 bg-surface p-2 rounded-2xl shadow-sm border border-outline-variant/30 overflow-x-auto'>
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`px-6 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${activePage === page.id ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            {page.name}
          </button>
        ))}
      </div>

      <div className='bg-surface p-8 rounded-2xl shadow-sm border border-outline-variant/30'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-on-surface'>
            Gambar Slider - {pages.find(p => p.id === activePage)?.name}
          </h2>
          <div>
            <input 
              type='file' 
              id='upload-slider'
              accept='image/*'
              multiple
              className='hidden'
              onChange={handleUpload}
              disabled={uploading || sliders.length >= 4}
            />
            <label 
              htmlFor='upload-slider' 
              className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-transform shadow-md ${
                uploading || sliders.length >= 4
                  ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-70' 
                  : 'bg-primary text-on-primary cursor-pointer hover:scale-105'
              }`}
            >
              {uploading ? <MdHourglassEmpty className='text-xl' /> : <MdUpload className='text-xl' />}
              {uploading ? 'Mengunggah...' : (sliders.length >= 4 ? 'Batas Maksimal (4)' : 'Tambah Gambar')}
            </label>
          </div>
        </div>

        {loading ? (
          <div className='py-12 text-center text-on-surface-variant'>Memuat gambar slider...</div>
        ) : sliders.length === 0 ? (
          <div className='py-12 text-center border-2 border-dashed border-outline-variant/30 rounded-xl'>
            <MdImage className="text-4xl text-on-surface-variant/50 mb-2" />
            <p className='text-on-surface-variant font-bold mb-1'>Belum ada gambar slider</p>
            <p className='text-sm text-on-surface-variant/70'>Halaman ini akan menggunakan gambar latar default bawaan sistem.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {sliders.map((slider) => (
              <div key={slider.id} className='relative group rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 aspect-video'>
                <img 
                  src={`${import.meta.env.VITE_API_BASE_URL}${slider.image_path}`} 
                  alt='Slider' 
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' 
                />
                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4'>
                  <button 
                    onClick={() => handleDelete(slider.id)}
                    className='bg-error text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg'
                    title='Hapus Gambar'
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSliders;
