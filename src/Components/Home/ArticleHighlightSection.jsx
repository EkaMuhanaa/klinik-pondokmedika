import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowForward, MdCalendarToday } from 'react-icons/md';
import axios from 'axios';

const ArticleHighlightSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('/articles');
        // Get the latest 3 published articles
        const publishedArticles = response.data.filter(a => a.is_published);
        setArticles(publishedArticles.slice(0, 3));
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (!loading && articles.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      }, { threshold: 0.1 });

      const elements = document.querySelectorAll('.articles-animate-on-scroll');
      elements.forEach(el => observer.observe(el));
      
      return () => observer.disconnect();
    }
  }, [loading, articles]);

  if (loading || articles.length === 0) return null;

  return (
    <section className="py-20 bg-surface-container-lowest">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 articles-animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <div className="max-w-2xl mb-6 md:mb-0">
            <h2 className="text-3xl md:text-5xl font-headline-md font-bold text-on-surface mb-4">Artikel & Edukasi Terbaru</h2>
            <div className="w-24 h-1.5 bg-primary rounded-full mb-6"></div>
            <p className="text-on-surface-variant text-lg">
              Tetap terinformasi dengan tips kesehatan dan berita medis terbaru dari tenaga ahli kami.
            </p>
          </div>
          <Link 
            to="/layanan/artikel"
            className="group flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-sm whitespace-nowrap"
          >
            Lihat Semua Artikel 
            <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article 
              key={article.id} 
              className={`bg-surface rounded-3xl overflow-hidden outline outline-1 outline-outline-variant/30 hover:outline-primary/50 shadow-sm hover:shadow-xl transition-all duration-500 group articles-animate-on-scroll opacity-0 translate-y-8 flex flex-col`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[16/10] bg-surface-container overflow-hidden relative">
                {article.thumbnail_path ? (
                  <img 
                    src={import.meta.env.VITE_API_BASE_URL + article.thumbnail_path} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30 bg-primary/5">
                    <MdCalendarToday className="text-6xl" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur text-primary px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                  {article.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
                  <MdCalendarToday className="text-primary" />
                  <span>
                    {new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-on-surface mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  <Link to={`/layanan/artikel/${article.slug}`} className="before:absolute before:inset-0">
                    {article.title}
                  </Link>
                </h3>
                <p className="text-on-surface-variant line-clamp-3 mb-6 flex-grow">
                  {article.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
                </p>
                <div className="flex items-center text-primary font-bold text-sm mt-auto group/btn">
                  Baca Selengkapnya
                  <MdArrowForward className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleHighlightSection;
