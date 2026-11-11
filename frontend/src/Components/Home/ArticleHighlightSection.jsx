import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowForward, MdCalendarToday } from 'react-icons/md';
import axios from 'axios';
import { useSiteSettings } from '../../Contexts/SiteSettingsContext';
import Reveal from '../Reveal';

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

const ArticleHighlightSection = () => {
  const settings = useSiteSettings();
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | error | ready

  const load = useCallback(() => {
    setStatus('loading');
    axios.get('/articles')
      .then((res) => { setArticles(res.data.filter((a) => a.is_published).slice(0, 3)); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Reveal as="section" className="py-section-gap bg-surface-container-low">
      <div className="w-full max-w-container-max mx-auto px-gutter">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Artikel &amp; Edukasi Terbaru</h2>
            <p className="font-body-lg text-body-lg text-text-muted mt-3">Tips dan informasi kesehatan dari {settings.clinic_name}.</p>
          </div>
          <Link to="/artikel" className="inline-flex items-center gap-2 min-h-[44px] font-bold text-primary hover:underline">
            Semua artikel kesehatan <MdArrowForward aria-hidden="true" />
          </Link>
        </div>

        {status === 'loading' && <p className="text-on-surface-variant py-10" role="status">Memuat artikel…</p>}

        {status === 'error' && (
          <div className="bg-white rounded-xl p-8 max-w-2xl" role="alert">
            <p className="text-on-surface font-medium mb-4">Artikel gagal dimuat. Periksa koneksi internet Anda, lalu coba lagi.</p>
            <button type="button" onClick={load} className="min-h-[44px] px-5 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary/90">
              Muat ulang artikel
            </button>
          </div>
        )}

        {status === 'ready' && articles.length === 0 && (
          <p className="text-on-surface-variant">Belum ada artikel yang diterbitkan.</p>
        )}

        {status === 'ready' && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article key={article.id} className="relative bg-white rounded-xl overflow-hidden border border-outline-variant/40 hover:border-primary transition-colors flex flex-col">
                <div className="aspect-[16/10] bg-surface-container">
                  <img
                    src={article.thumbnail_path ? import.meta.env.VITE_API_BASE_URL + article.thumbnail_path : '/images/placeholder-artikel.svg'}
                    alt=""
                    width="640"
                    height="400"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="flex items-center gap-2 text-sm text-text-muted mb-3">
                    <span className="font-bold text-primary">{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <MdCalendarToday aria-hidden="true" />
                    <time dateTime={article.published_at || article.created_at}>{formatDate(article.published_at || article.created_at)}</time>
                  </p>
                  <h3 className="font-heading font-semibold text-xl text-on-surface mb-3 line-clamp-2">
                    <Link to={`/artikel/${article.slug}`} className="before:absolute before:inset-0 hover:text-primary">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-on-surface-variant line-clamp-3">
                    {article.content.replace(/<[^>]+>/g, '').substring(0, 150)}…
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
};

export default ArticleHighlightSection;
