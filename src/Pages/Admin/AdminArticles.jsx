import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const res = await axios.get('/articles');
      setArticles(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus artikel ini?')) {
      try {
        await axios.delete(`/admin/articles/${id}`);
        setArticles(articles.filter(a => a.id !== id));
      } catch (e) {
        console.error(e);
        alert('Gagal menghapus artikel');
      }
    }
  };

  if (loading) return <div>Memuat...</div>;

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-headline-lg font-bold text-on-surface'>Kelola Artikel</h1>
        <Link to='/admin/articles/create' className='bg-primary text-on-primary px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform'>
          <MdAdd />
          Tulis Artikel Baru
        </Link>
      </div>

      <div className='bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-surface-container-lowest border-b border-outline-variant/30'>
              <th className='p-4 font-bold text-on-surface-variant uppercase text-sm tracking-wider'>Judul Artikel</th>
              <th className='p-4 font-bold text-on-surface-variant uppercase text-sm tracking-wider'>Kategori</th>
              <th className='p-4 font-bold text-on-surface-variant uppercase text-sm tracking-wider'>Status</th>
              <th className='p-4 font-bold text-on-surface-variant uppercase text-sm tracking-wider text-right'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan='4' className='p-8 text-center text-on-surface-variant'>
                  Belum ada artikel. Silakan buat artikel pertama Anda!
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className='border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors'>
                  <td className='p-4'>
                    <p className='font-bold text-on-surface line-clamp-1'>{article.title}</p>
                    <p className='text-xs text-on-surface-variant mt-1'>{new Date(article.created_at).toLocaleDateString('id-ID')}</p>
                  </td>
                  <td className='p-4'>
                    <span className='px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold'>
                      {article.category}
                    </span>
                  </td>
                  <td className='p-4'>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${article.is_published ? 'bg-whatsapp-green/10 text-whatsapp-green' : 'bg-outline-variant/30 text-on-surface-variant'}`}>
                      {article.is_published ? 'Dipublikasikan' : 'Draf'}
                    </span>
                  </td>
                  <td className='p-4 text-right flex justify-end gap-2'>
                    <Link to={`/admin/articles/edit/${article.id}`} className='p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors'>
                      <MdEdit className="text-[20px]" />
                    </Link>
                    <button onClick={() => handleDelete(article.id)} className='p-2 text-error hover:bg-error/10 rounded-lg transition-colors'>
                      <MdDelete className="text-[20px]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminArticles;
