import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AdminArticleForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Edukasi Kesehatan',
    content: '',
    is_published: false,
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchArticle = async () => {
        try {
          const res = await axios.get('/articles');
          const article = res.data.find(a => a.id === parseInt(id));
          if (article) {
            setFormData({
              title: article.title,
              category: article.category,
              content: article.content,
              is_published: article.is_published
            });
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('content', formData.content);
    data.append('is_published', formData.is_published ? '1' : '0');
    if (thumbnail) {
      data.append('thumbnail', thumbnail);
    }

    try {
      if (isEdit) {
        // Laravel requires _method=PUT for multipart form data updates
        data.append('_method', 'PUT');
        await axios.post(`/admin/articles/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/admin/articles', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/admin/articles');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan artikel');
    }
  };

  if (loading) return <div>Memuat...</div>;

  return (
    <div>
      <div className='flex items-center gap-4 mb-8'>
        <Link to='/admin/articles' className='p-2 bg-surface rounded-full hover:bg-surface-container transition-colors'>
          <span className='material-symbols-outlined'>arrow_back</span>
        </Link>
        <h1 className='text-3xl font-headline-lg font-bold text-on-surface'>
          {isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className='bg-surface p-8 rounded-2xl shadow-sm border border-outline-variant/30 space-y-6'>
        
        <div className='grid md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-bold text-on-surface mb-2'>Judul Artikel</label>
            <input 
              type='text' 
              required 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className='w-full px-4 py-3 rounded-xl bg-surface-container border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none'
              placeholder='Contoh: Cara Menjaga Kesehatan Jantung'
            />
          </div>
          <div>
            <label className='block text-sm font-bold text-on-surface mb-2'>Kategori</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className='w-full px-4 py-3 rounded-xl bg-surface-container border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none'
            >
              <option value='Edukasi Kesehatan'>Edukasi Kesehatan</option>
              <option value='Pengumuman'>Pengumuman</option>
            </select>
          </div>
        </div>

        <div>
          <label className='block text-sm font-bold text-on-surface mb-2'>Gambar Cover (Opsional)</label>
          <input 
            type='file' 
            accept='image/*'
            onChange={(e) => setThumbnail(e.target.files[0])}
            className='w-full px-4 py-3 rounded-xl bg-surface-container border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20'
          />
        </div>

        <div>
          <label className='block text-sm font-bold text-on-surface mb-2'>Konten Artikel</label>
          <textarea 
            required 
            rows='10'
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className='w-full px-4 py-3 rounded-xl bg-surface-container border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none'
            placeholder='Tulis isi artikel di sini...'
          ></textarea>
        </div>

        <div className='flex items-center gap-3 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30'>
          <input 
            type='checkbox' 
            id='is_published'
            checked={formData.is_published}
            onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
            className='w-5 h-5 accent-primary'
          />
          <label htmlFor='is_published' className='font-bold cursor-pointer select-none'>
            Langsung Publikasikan Artikel
          </label>
          <p className='text-xs text-on-surface-variant ml-auto'>
            Jika tidak dicentang, artikel akan disimpan sebagai Draf.
          </p>
        </div>

        <div className='pt-4 border-t border-outline-variant/30 flex justify-end gap-4'>
          <Link to='/admin/articles' className='px-6 py-3 font-bold text-on-surface-variant hover:text-on-surface transition-colors'>
            Batal
          </Link>
          <button type='submit' className='bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-md'>
            Simpan Artikel
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminArticleForm;
