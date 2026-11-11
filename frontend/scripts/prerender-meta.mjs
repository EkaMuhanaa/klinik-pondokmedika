// Dijalankan setelah `vite build`. Menulis HTML per halaman statis (dist/prerender/*.html)
// berisi <title>, meta description, canonical, Open Graph, dan JSON-LD yang benar,
// sehingga mesin pencari & preview WhatsApp/Facebook melihat meta tanpa menjalankan JavaScript.
// Data klinik diambil dari API (VITE_API_BASE_URL) jika bisa, kalau tidak memakai nilai default.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { siteDefaults } from '../src/seo/siteDefaults.js';
import { staticPaths, absoluteUrl, breadcrumbFor, breadcrumbJsonLd, clinicJsonLd, pageMeta } from '../src/seo/meta.js';
import { defaultServices } from '../src/data/defaultServices.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const env = { ...loadEnv('production', root, ''), ...process.env };

async function fetchJson(path, fallback, label) {
  const base = env.VITE_API_BASE_URL;
  if (!base) return fallback;
  try {
    const res = await fetch(`${base}/api${path}`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log(`prerender: ${label} diambil dari ${base}`);
    return await res.json();
  } catch (e) {
    console.log(`prerender: ${label} tidak bisa diambil (${e.message}), memakai data default`);
    return fallback;
  }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

function render(template, path, s, services) {
  const { title, description } = pageMeta(path, s, services);
  const url = absoluteUrl(path);
  const crumbs = breadcrumbFor(path, services);
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:site_name" content=")[^"]*/, `$1${esc(s.clinic_name)}`);
  const ld = [`<script type="application/ld+json" id="ld-clinic">${json(clinicJsonLd(s, services))}</script>`];
  if (crumbs) ld.push(`<script type="application/ld+json" id="ld-breadcrumb">${json(breadcrumbJsonLd(crumbs))}</script>`);
  return html.replace('</head>', `    ${ld.join('\n    ')}\n  </head>`);
}

const template = await readFile(join(dist, 'index.html'), 'utf8');
const settings = { ...siteDefaults, ...(await fetchJson('/site-settings', {}, 'data klinik')) };
const services = await fetchJson('/services', defaultServices, 'daftar layanan');
const paths = staticPaths(services);

for (const path of paths) {
  const html = render(template, path, settings, services);
  const file = path === '/' ? join(dist, 'index.html') : join(dist, 'prerender', `${path.slice(1)}.html`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}
console.log(`prerender: ${paths.length} halaman ditulis`);
