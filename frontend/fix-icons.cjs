const fs = require('fs');

// 1. About.jsx
let about = fs.readFileSync('src/Pages/About.jsx', 'utf8');
about = about.replace('<MdGroups className="text-white/70 text-6xl drop-shadow-md mb-4" />', '<MdGroups className="text-white/70 text-6xl drop-shadow-md mb-4 mx-auto" />');
about = about.replace('<MdFavorite className="text-primary text-6xl drop-shadow-md mb-6" />', '<MdFavorite className="text-primary text-6xl drop-shadow-md mx-auto mb-6" />');
about = about.replace('<MdPeople className="text-secondary text-5xl mb-4" />', '<MdPeople className="text-secondary text-5xl mx-auto mb-4" />');
about = about.replace('<MdThumbUp className="text-secondary text-5xl mb-4" />', '<MdThumbUp className="text-secondary text-5xl mx-auto mb-4" />');
about = about.replace('<MdMedicalServices className="text-secondary text-5xl mb-4" />', '<MdMedicalServices className="text-secondary text-5xl mx-auto mb-4" />');
fs.writeFileSync('src/Pages/About.jsx', about, 'utf8');

// 2. Services.jsx
let services = fs.readFileSync('src/Pages/Services.jsx', 'utf8');
services = services.replace('<MdMedicalServices className="text-white/70 text-6xl drop-shadow-md mb-4" />', '<MdMedicalServices className="text-white/70 text-6xl drop-shadow-md mx-auto mb-4" />');
fs.writeFileSync('src/Pages/Services.jsx', services, 'utf8');

// 3. Articles.jsx
let articles = fs.readFileSync('src/Pages/Articles.jsx', 'utf8');
articles = articles.replace('<MdMenuBook className="text-white/50 text-6xl mb-4" />', '<MdMenuBook className="text-white/50 text-6xl mx-auto mb-4" />');
articles = articles.replace('<MdArticle className="text-5xl text-on-surface-variant/50" />', '<MdArticle className="text-5xl text-on-surface-variant/50 mx-auto" />');
fs.writeFileSync('src/Pages/Articles.jsx', articles, 'utf8');

// 4. AdminSliders.jsx
let sliders = fs.readFileSync('src/Pages/Admin/AdminSliders.jsx', 'utf8');
sliders = sliders.replace('<MdImage className="text-4xl text-on-surface-variant/50 mb-2" />', '<MdImage className="text-4xl text-on-surface-variant/50 mx-auto mb-2" />');
fs.writeFileSync('src/Pages/Admin/AdminSliders.jsx', sliders, 'utf8');

console.log('Icons centered successfully!');
