import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useServices, useSiteSettings } from '../Contexts/SiteSettingsContext';
import { absoluteUrl, breadcrumbFor, breadcrumbJsonLd, clinicJsonLd, pageMeta } from '../seo/meta';

const DEFAULT_IMAGE = absoluteUrl('/images/logo-wide.png');

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (content === undefined || content === null || content === '') {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Mengatur <title>, meta description, canonical, Open Graph, dan JSON-LD halaman.
 * Tanpa props, judul/deskripsi diambil otomatis dari seo/meta.js berdasarkan URL.
 * Tag yang sama juga ditulis saat build oleh scripts/prerender-meta.mjs.
 */
const Seo = ({ title, description, image, type = 'website', noindex = false, jsonLd, path }) => {
  const settings = useSiteSettings();
  const { services } = useServices();
  const location = useLocation();
  const currentPath = path || location.pathname;

  useEffect(() => {
    const auto = pageMeta(currentPath, settings, services) || {};
    const finalTitle = title || auto.title || settings.clinic_name;
    const finalDesc = description || auto.description || settings.tagline;
    const url = absoluteUrl(currentPath);

    document.title = finalTitle;
    setMeta('name', 'description', finalDesc);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    setLink('canonical', url);
    setMeta('property', 'og:title', finalTitle);
    setMeta('property', 'og:description', finalDesc);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', image || DEFAULT_IMAGE);
    setMeta('property', 'og:site_name', settings.clinic_name);
    setMeta('property', 'og:locale', 'id_ID');
    setMeta('name', 'twitter:card', 'summary_large_image');

    setJsonLd('ld-clinic', clinicJsonLd(settings, services));
    const crumbs = breadcrumbFor(currentPath, services);
    setJsonLd('ld-breadcrumb', crumbs ? breadcrumbJsonLd(crumbs) : null);
    setJsonLd('ld-page', jsonLd || null);
  }, [currentPath, settings, services, title, description, image, type, noindex, jsonLd]);

  return null;
};

export default Seo;
