import React, { useState, useEffect, useRef } from 'react';
import { MdArrowBack, MdCalendarToday, MdShare, MdContentCopy, MdLink, MdCheck } from 'react-icons/md';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../Components/Layout';

const ArticleDetail = () => {
  const { slug } = useParams();
  
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/articles/${slug}`);
        setArticle(res.data);
        
        // Fetch related articles
        if (res.data && res.data.category) {
          const relatedRes = await axios.get(`/articles?category=${encodeURIComponent(res.data.category)}`);
          // Filter out the current article and take max 4
          const filtered = relatedRes.data.filter(a => a.id !== res.data.id).slice(0, 4);
          setRelatedArticles(filtered);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
    setCopied(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setShowShareMenu(false), 1500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-on-surface-variant font-bold">Memuat artikel...</p>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
          <Link to="/artikel" className="text-primary hover:underline">Kembali ke Daftar Artikel</Link>
        </div>
      </Layout>
    );
  }

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(article.title);

  return (
    <Layout>
      {/* Detail Header */}
      <section className="pt-32 pb-12 px-gutter bg-surface-container-lowest transition-all duration-700 opacity-100 translate-y-0 animate-fade-in-up">
        <div className="max-w-3xl mx-auto text-center">
          <Link to="/artikel" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all mb-8">
            <MdArrowBack className="text-sm" />
            Kembali ke Daftar Artikel
          </Link>
          
          <div className="flex justify-center items-center gap-3 mb-6">
            <Link to={`/artikel?category=${encodeURIComponent(article.category)}`} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors">
              {article.category}
            </Link>
            <span className="text-on-surface-variant text-sm flex items-center gap-1">
              <MdCalendarToday className="text-[16px]" />
              {new Date(article.published_at || article.created_at).toLocaleDateString('id-ID')}
            </span>
          </div>

          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-6 leading-tight">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Article Content & Sidebar */}
      <section className="py-12 px-gutter bg-white min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            {article.thumbnail_path && (
              <div className="w-full aspect-video rounded-2xl mb-12 overflow-hidden animate-fade-in-up shadow-sm border border-outline-variant/30" style={{ animationDelay: '100ms' }}>
                <img src={`${import.meta.env.VITE_API_BASE_URL}${article.thumbnail_path}`} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}

            <article className="prose prose-lg prose-slate max-w-none text-on-surface-variant font-body-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
            </article>
            
            <div className="mt-16 pt-8 border-t border-outline-variant/30 flex justify-between items-center animate-fade-in-up relative" style={{ animationDelay: '300ms' }}>
              <p className="text-on-surface-variant font-label-md">Bagikan artikel ini:</p>
              <div className="flex gap-4 relative" ref={shareMenuRef}>
              <button 
                onClick={handleCopyLink}
                title="Salin Tautan"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-surface-container text-on-surface hover:text-primary hover:bg-primary/10'}`}
              >
                {copied ? <MdCheck className="text-[20px]" /> : <MdLink className="text-[20px]" />}
              </button>
              <button 
                onClick={handleShare}
                title="Bagikan"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showShareMenu ? 'bg-primary text-white' : 'bg-surface-container text-on-surface hover:text-primary hover:bg-primary/10'}`}
              >
                <MdShare className="text-[20px]" />
              </button>

              {/* Share Dropdown */}
              {showShareMenu && (
                <div className="absolute bottom-14 right-0 w-48 bg-white rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex flex-col">
                    <button onClick={handleCopyLink} className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container-low text-left">
                      <MdContentCopy className="text-[18px]" />
                      Salin Link
                    </button>
                    <a href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container-low">
                      <svg className="w-[18px] h-[18px] fill-[#25D366]" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 56.3 0 109.2 21.9 149 61.6 39.8 39.8 61.7 92.7 61.7 149.2 0 101.7-82.7 184.4-184.4 184.4h-.1zM294.6 220c-5.4-2.7-31.9-15.7-36.8-17.5-4.9-1.8-8.5-2.7-12.1 2.7-3.6 5.4-14.4 17.5-17.5 21.1-3.1 3.6-6.3 4-11.7 1.4-5.4-2.7-22.8-8.4-43.4-26.8-16-14.3-26.8-31.9-29.5-37.3-2.7-5.4-.3-8.3 2.4-11 2.4-2.4 5.4-6.3 8-9.4 2.7-3.1 3.6-5.4 5.4-9 1.8-3.6 .9-6.7-.4-9.4-1.4-2.7-12.1-29.3-16.6-40.1-4.4-10.5-8.8-9.1-12.1-9.3-3.1-.1-6.7-.1-10.3-.1-3.6 0-9.4 1.4-14.4 6.7-5.4 5.4-20.6 20.2-20.6 49.3s21.1 57.2 24.2 61.3c3.1 4 41.8 63.8 101.3 89.4 14.2 6.1 25.3 9.8 33.9 12.5 14.3 4.5 27.3 3.9 37.6 2.4 11.5-1.7 35.4-14.4 40.4-28.4 5-13.9 5-25.9 3.6-28.4-1.4-2.7-5.4-4.1-10.8-6.8z"/></svg>
                      WhatsApp
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container-low">
                      <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L273 181.6 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                      X (Twitter)
                    </a>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
          
          {/* Sidebar (Right) */}
          <aside className="lg:col-span-1 border-t lg:border-t-0 pt-12 lg:pt-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="sticky top-24">
              <h3 className="font-bold text-xl text-on-surface mb-6 relative inline-block">
                Artikel Terkait
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
              </h3>
              
              <div className="flex flex-col gap-6">
                {relatedArticles.length > 0 ? (
                  relatedArticles.map((relArticle) => (
                    <Link 
                      key={relArticle.id} 
                      to={`/artikel/${relArticle.slug}`} 
                      className="group flex flex-col gap-3"
                    >
                      <div className="w-full h-36 rounded-xl overflow-hidden relative bg-surface-container-low">
                        <img 
                          src={`http://localhost:8000/storage/${relArticle.image_path}`} 
                          alt={relArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/400x300?text=Klinik+Pondok+Medika';
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-1.5">
                          <MdCalendarToday className="text-[12px]" />
                          {new Date(relArticle.published_at || relArticle.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <h4 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-1.5">
                          {relArticle.title}
                        </h4>
                        <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                          {relArticle.excerpt || relArticle.content.substring(0, 100).replace(/<[^>]+>/g, '') + '...'}
                        </p>
                      </div>
                      <hr className="border-outline-variant/30 mt-3 group-last:hidden" />
                    </Link>
                  ))
                ) : (
                  <p className="text-on-surface-variant text-sm italic">
                    Tidak ada artikel terkait.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default ArticleDetail;
