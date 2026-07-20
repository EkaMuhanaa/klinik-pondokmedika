import React, { useState, useEffect, useRef } from 'react';
import { MdArrowBack, MdSave, MdImage, MdOutlineRefresh } from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminFacilityForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchFacility();
    }
  }, [id]);

  const fetchFacility = async () => {
    try {
      const response = await axios.get(`/facilities/${id}`);
      setFormData({
        title: response.data.title,
        description: response.data.description || ''
      });
      if (response.data.image_path) {
        setImagePreview(import.meta.env.VITE_API_BASE_URL + response.data.image_path);
      }
    } catch (error) {
      console.error('Error fetching facility:', error);
      alert('Gagal mengambil data fasilitas');
      navigate('/admin/facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (image) {
      data.append('image', image);
    }

    try {
      if (isEdit) {
        data.append('_method', 'PUT'); // required by Laravel for multipart updates
        await axios.post(`/admin/facilities/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/admin/facilities', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/admin/facilities');
    } catch (error) {
      console.error('Error saving facility:', error);
      alert('Gagal menyimpan fasilitas');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant font-bold animate-pulse">Memuat data...</div>;
  }

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto'>
      <div className='flex items-center gap-4 mb-8'>
        <Link 
          to='/admin/facilities'
          className='w-12 h-12 bg-surface rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors shadow-sm'
        >
          <MdArrowBack className='text-2xl' />
        </Link>
        <div>
          <h1 className='text-3xl font-headline-md font-bold text-on-surface'>
            {isEdit ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
          </h1>
        </div>
      </div>

      <div className='bg-surface rounded-3xl p-8 shadow-sm border border-outline-variant/30'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-bold text-on-surface mb-2'>Nama Fasilitas</label>
            <input 
              type='text' 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className='w-full px-4 py-3 rounded-xl bg-surface-container border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none'
              placeholder='Contoh: Ruang Tunggu VIP'
            />
          </div>

          <div>
            <label className='block text-sm font-bold text-on-surface mb-2'>Keterangan (Opsional)</label>
            <textarea 
              rows='4'
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className='w-full px-4 py-3 rounded-xl bg-surface-container border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none'
              placeholder='Deskripsi singkat mengenai fasilitas ini...'
            />
          </div>

          <div>
            <label className='block text-sm font-bold text-on-surface mb-2'>Foto Fasilitas (Opsional)</label>
            <div className='flex flex-col sm:flex-row gap-6 items-start'>
              <div 
                className={`w-full sm:w-64 aspect-video rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden relative group cursor-pointer ${imagePreview ? 'border-primary' : 'border-outline-variant/50 hover:border-primary/50'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <span className='text-white font-bold text-sm'>Ubah Gambar</span>
                    </div>
                  </>
                ) : (
                  <div className='text-center text-on-surface-variant/50 group-hover:text-primary transition-colors'>
                    <MdImage className='text-4xl mx-auto mb-2' />
                    <span className='text-sm font-bold'>Pilih Gambar</span>
                  </div>
                )}
              </div>
              <div className='flex-1'>
                <p className='text-sm text-on-surface-variant mb-4'>
                  Disarankan menggunakan gambar dengan rasio 16:9 (Landscape) untuk tampilan terbaik di halaman beranda. Ukuran maksimal 2MB.
                </p>
                <input 
                  type='file' 
                  ref={fileInputRef}
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                />
                <button 
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='bg-surface-container hover:bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg font-bold transition-colors text-sm'
                >
                  Jelajahi File
                </button>
              </div>
            </div>
          </div>

          <div className='pt-6 border-t border-outline-variant/30 flex justify-end'>
            <button 
              type='submit' 
              disabled={saving}
              className='bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-md disabled:opacity-70 disabled:hover:scale-100'
            >
              {saving ? <MdOutlineRefresh className='text-xl animate-spin' /> : <MdSave className='text-xl' />}
              {saving ? 'Menyimpan...' : 'Simpan Fasilitas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFacilityForm;
