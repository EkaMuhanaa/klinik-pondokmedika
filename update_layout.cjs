const fs = require('fs');
let layout = fs.readFileSync('src/Components/Admin/AdminLayout.jsx', 'utf8');

layout = layout.replace(
  "import { MdLogout, MdArticle, MdImage, MdMenu, MdClose } from 'react-icons/md';",
  "import { MdLogout, MdArticle, MdImage, MdMenu, MdClose, MdDomain } from 'react-icons/md';"
);

layout = layout.replace(
  "{ name: 'Kelola Latar / Slider', path: '/admin/sliders', icon: <MdImage className='text-xl' /> },",
  "{ name: 'Kelola Latar / Slider', path: '/admin/sliders', icon: <MdImage className='text-xl' /> },\n    { name: 'Kelola Fasilitas', path: '/admin/facilities', icon: <MdDomain className='text-xl' /> },"
);

fs.writeFileSync('src/Components/Admin/AdminLayout.jsx', layout, 'utf8');
