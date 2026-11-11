import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './Contexts/AuthContext';
import { SiteSettingsProvider } from './Contexts/SiteSettingsContext';

import Home from './Pages/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import ServiceDetail from './Pages/ServiceDetail';
import Articles from './Pages/Articles';
import ArticleDetail from './Pages/ArticleDetail';
import NotFound from './Pages/NotFound';
import PageTransition from './Components/PageTransition';
import ScrollToTop from './Components/ScrollToTop';

// Admin Components
import AdminLayout from './Components/Admin/AdminLayout';
import Login from './Pages/Admin/Login';
import AdminArticles from './Pages/Admin/AdminArticles';
import AdminArticleForm from './Pages/Admin/AdminArticleForm';
import AdminSliders from './Pages/Admin/AdminSliders';
import AdminFacilities from './Pages/Admin/AdminFacilities';
import AdminFacilityForm from './Pages/Admin/AdminFacilityForm';
import AdminPromos from './Pages/Admin/AdminPromos';
import AdminPromoForm from './Pages/Admin/AdminPromoForm';
import AdminSettings from './Pages/Admin/AdminSettings';
import AdminServices from './Pages/Admin/AdminServices';
import AdminServiceForm from './Pages/Admin/AdminServiceForm';
import AdminDoctors from './Pages/Admin/AdminDoctors';
import AdminDoctorForm from './Pages/Admin/AdminDoctorForm';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className='min-h-screen flex items-center justify-center font-bold text-primary'>Memuat...</div>;
  if (!user) return <Navigate to='/admin/login' replace />;
  return <AdminLayout>{children}</AdminLayout>;
};

function LocationProvider() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path='/admin/login' element={<Login />} />
        <Route path='/admin' element={<Navigate to='/admin/articles' replace />} />
        <Route path='/admin/articles' element={<ProtectedRoute><AdminArticles /></ProtectedRoute>} />
        <Route path='/admin/articles/create' element={<ProtectedRoute><AdminArticleForm /></ProtectedRoute>} />
        <Route path='/admin/articles/edit/:id' element={<ProtectedRoute><AdminArticleForm /></ProtectedRoute>} />
        <Route path='/admin/sliders' element={<ProtectedRoute><AdminSliders /></ProtectedRoute>} />
        <Route path='/admin/facilities' element={<ProtectedRoute><AdminFacilities /></ProtectedRoute>} />
        <Route path='/admin/facilities/new' element={<ProtectedRoute><AdminFacilityForm /></ProtectedRoute>} />
        <Route path='/admin/facilities/edit/:id' element={<ProtectedRoute><AdminFacilityForm /></ProtectedRoute>} />
        <Route path='/admin/promos' element={<ProtectedRoute><AdminPromos /></ProtectedRoute>} />
        <Route path='/admin/promos/new' element={<ProtectedRoute><AdminPromoForm /></ProtectedRoute>} />
        <Route path='/admin/promos/edit/:id' element={<ProtectedRoute><AdminPromoForm /></ProtectedRoute>} />
        <Route path='/admin/settings' element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        <Route path='/admin/services' element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
        <Route path='/admin/services/new' element={<ProtectedRoute><AdminServiceForm /></ProtectedRoute>} />
        <Route path='/admin/services/edit/:id' element={<ProtectedRoute><AdminServiceForm /></ProtectedRoute>} />
        <Route path='/admin/doctors' element={<ProtectedRoute><AdminDoctors /></ProtectedRoute>} />
        <Route path='/admin/doctors/new' element={<ProtectedRoute><AdminDoctorForm /></ProtectedRoute>} />
        <Route path='/admin/doctors/edit/:id' element={<ProtectedRoute><AdminDoctorForm /></ProtectedRoute>} />
        <Route path='*' element={<Navigate to='/admin/articles' replace />} />
      </Routes>
    );
  }

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<PageTransition><Home /></PageTransition>} />
        <Route path='/tentang-kami' element={<PageTransition><About /></PageTransition>} />
        <Route path='/layanan' element={<PageTransition><Services /></PageTransition>} />
        <Route path='/layanan/:slug' element={<PageTransition><ServiceDetail /></PageTransition>} />
        <Route path='/artikel' element={<PageTransition><Articles /></PageTransition>} />
        <Route path='/artikel/:slug' element={<PageTransition><ArticleDetail /></PageTransition>} />
        <Route path='*' element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <Router>
          <ScrollToTop />
          <LocationProvider />
        </Router>
      </SiteSettingsProvider>
    </AuthProvider>
  );
}

export default App;

