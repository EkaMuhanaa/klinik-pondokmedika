import React, { useState, useEffect, useCallback } from 'react';
import { MdCalendarToday, MdArticle } from 'react-icons/md';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../Components/Layout';
import HeroSliderBackground from '../Components/HeroSliderBackground';
import { useSiteSettings } from '../Contexts/SiteSettingsContext';

const categories = ['Semua', 'Edukasi Kesehatan', 'Pengumuman'];

const Articles = () => {
  const settings = useSiteSettings();
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'Semua');
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  // Gambar hero diatur admin di CMS → Kelola Latar / Slider
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_BASE_URL + '/api/sliders/articles')
      .then((res) => {
        if (res.data?.length) setHeroImages(res.data.map((s) => import.meta.env.VITE_API_BASE_URL + s.image_path));
      })
      .catch(() => {});
  }, []);

  const loadArticles = useCallback(() => {
    setLoading(true);
    setError(false);
    const params = activeCategory !== 'Semua' ? { category: activeCategory } : {};
    axios.get(import.meta.env.VITE_API_BASE_URL + '/api/articles', { params })
      .then((res) => setArticles(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  useEffect(() => { loadArticles(); }, [loadArticles]);

  return (
    <Layout>
      <section className="relative min-h-[320px] md:min-h-[400px] flex items-end">
        <HeroSliderBackground images={heroImages} overlayClassName="hero-overlay" />
        <div className="relative z-10 w-full max-w-container-max mx-auto px-gutter py-12">
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile md:font-headline-xl md:text-headline-xl text-white mb-3">Artikel &amp; Edukasi</h1>
          <p className="font-body-lg text-body-lg text-white max-w-2xl">Tips kesehatan dan pengumuman dari {settings.clinic_name}.</p>
        </div>
      </section>

      <section className="py-section-gap px-gutter bg-surface min-h-[60vh]">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-wrap gap-3 mb-10" role="group" aria-label="Filter kategori artikel">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`min-h-[44px] px-5 rounded-lg font-label-md border transition-colors ${
                  activeCategory === cat
                    ? 'bg-secondary text-white border-secondary'
                    : 'bg-white text-on-surface border-outline-variant hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="py-16 text-on-surface-variant" role="status">Memuat artikel…</p>
          ) : error ? (
            <div className="bg-surface-container rounded-xl p-8 max-w-2xl" role="alert">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Artikel gagal dimuat</h2>
              <p className="text-on-surface-variant mb-5">Terjadi gangguan saat mengambil data. Periksa koneksi internet Anda, lalu coba lagi.</p>
              <button type="button" onClick={loadArticles} className="min-h-[44px] px-5 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary/90">
                Muat ulang artikel
              </button>
            </div>
          ) : articles.length > 0 ? (
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
                  <div className="p-6 flex flex-col flex-1">
                    <p className="flex items-center gap-2 text-sm text-text-muted mb-3">
                      <span className="font-bold text-primary">{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <MdCalendarToday aria-hidden="true" />
                      <time dateTime={article.published_at || article.created_at}>
                        {new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </time>
                    </p>
                    <h2 className="font-heading font-semibold text-xl text-on-surface mb-3 line-clamp-2">
                      <Link to={`/artikel/${article.slug}`} className="before:absolute before:inset-0 hover:text-primary">
                        {article.title}
                      </Link>
                    </h2>
                    <p className="text-on-surface-variant line-clamp-3">{article.content}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-16 max-w-xl">
              <MdArticle className="text-5xl text-on-surface-variant mb-4" aria-hidden="true" />
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                {activeCategory === 'Semua' ? 'Belum ada artikel' : `Belum ada ${activeCategory.toLowerCase()}`}
              </h2>
              <p className="text-on-surface-variant">Artikel yang diterbitkan admin akan tampil di sini.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Articles;
