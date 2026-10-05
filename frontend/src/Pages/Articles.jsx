import React, { useState, useEffect } from 'react';
import { MdMenuBook, MdCalendarToday, MdArrowForward, MdArticle } from 'react-icons/md';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../Components/Layout';
import HeroSliderBackground from '../Components/HeroSliderBackground';

const categories = ['Semua', 'Edukasi Kesehatan', 'Pengumuman'];

const Articles = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'Semua');
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImages, setHeroImages] = useState([
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2000&auto=format&fit=crop'
  ]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch hero sliders
        const bgRes = await axios.get(import.meta.env.VITE_API_BASE_URL + '/api/sliders/articles').catch(() => null);
        if (bgRes && bgRes.data && bgRes.data.length > 0) {
          setHeroImages(bgRes.data.map(s => import.meta.env.VITE_API_BASE_URL + s.image_path));
        }

        // Fetch articles
        const params = activeCategory !== 'Semua' ? { category: activeCategory } : {};
        const artRes = await axios.get(import.meta.env.VITE_API_BASE_URL + '/api/articles', { params });
        setArticles(artRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCategory]);

  return (
    <Layout>
      {/* Hero Header */}
      <section className='relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden transition-all duration-1000 opacity-100 translate-y-0'>
        <HeroSliderBackground images={heroImages} overlayClassName='bg-primary/20 backdrop-brightness-75' />
        <div className='relative z-10 text-center px-gutter max-w-4xl transition-all duration-700 opacity-100 translate-y-0 animate-fade-in-up'>
          <MdMenuBook className="text-white/50 text-6xl mx-auto mb-4" />
          <h1 className='font-headline-xl text-headline-xl text-white mb-4'>Artikel & Edukasi</h1>
          <p className='font-body-lg text-white/90 max-w-2xl mx-auto'>Wadah edukasi kesehatan, tips medis, informasi rilis media, dan pengumuman internal Klinik Pondok Medika.</p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className='py-section-gap px-gutter bg-surface min-h-screen'>
        <div className='max-w-container-max mx-auto'>
          {/* Categories Filter */}
          <div className='flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up' style={{ animationDelay: '100ms' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-label-md transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-secondary text-white shadow-md scale-105'
                    : 'bg-surface-container text-on-surface hover:bg-primary/15 hover:text-primary hover:shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
             <div className='text-center py-20 text-on-surface-variant'>Memuat artikel...</div>
          ) : articles.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {articles.map((article, index) => (
                <div key={article.id} className='bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border border-outline-variant/30 flex flex-col group'>
                  <div className='h-56 relative overflow-hidden rounded-t-[23px]'>
                    <img 
                      src={article.thumbnail_path ? import.meta.env.VITE_API_BASE_URL + article.thumbnail_path : 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop'} 
                      alt={article.title} 
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-t-[23px]' 
                    />
                    <div className='absolute top-4 left-4'>
                      <span className='px-3 py-1 bg-surface/90 backdrop-blur-sm text-primary rounded-full text-xs font-bold shadow-sm'>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className='p-6 flex flex-col flex-1'>
                    <div className='flex items-center gap-2 text-on-surface-variant text-sm mb-3'>
                      <MdCalendarToday className="text-sm" />
                      <span>{new Date(article.published_at || article.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                    <h3 className='font-headline-md text-xl font-bold text-on-surface mb-3 line-clamp-2 group-hover:text-primary transition-colors'>
                      {article.title}
                    </h3>
                    <p className='text-on-surface-variant line-clamp-3 mb-6 flex-1'>
                      {article.content}
                    </p>
                    <Link to={`/artikel/${article.slug}`} className='text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all mt-auto'>
                      Baca Selengkapnya
                      <MdArrowForward />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-20 animate-fade-in-up' style={{ animationDelay: '200ms' }}>
              <div className='w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6'>
                <MdArticle className="text-5xl text-on-surface-variant/50 mx-auto" />
              </div>
              <h3 className='font-headline-lg text-headline-lg text-on-surface mb-3'>
                {activeCategory === 'Semua' ? 'Belum Ada Artikel' : `Belum Ada ${activeCategory}`}
              </h3>
              <p className='text-on-surface-variant text-body-lg max-w-md mx-auto'>
                {activeCategory === 'Semua' 
                  ? 'Saat ini belum ada artikel atau informasi yang dipublikasikan.' 
                  : activeCategory === 'Edukasi Kesehatan'
                  ? 'Belum ada edukasi kesehatan untuk saat ini.'
                  : 'Belum ada pengumuman untuk saat ini.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Articles;
