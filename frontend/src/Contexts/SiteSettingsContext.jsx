import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { siteDefaults } from '../seo/siteDefaults';
import { defaultServices } from '../data/defaultServices';

const SiteSettingsContext = createContext(siteDefaults);
const ServicesContext = createContext({ services: defaultServices, status: 'loading', reload: () => {} });

// eslint-disable-next-line react-refresh/only-export-components
export const useSiteSettings = () => useContext(SiteSettingsContext);
// eslint-disable-next-line react-refresh/only-export-components
export const useServices = () => useContext(ServicesContext);

/** URL gambar dari CMS (/storage/...) atau aset bawaan frontend (/images/...). */
// eslint-disable-next-line react-refresh/only-export-components
export const mediaUrl = (path) => (path?.startsWith('/storage/') ? import.meta.env.VITE_API_BASE_URL + path : path);

/** Data klinik dan daftar layanan dari CMS, dengan nilai cadangan bawaan. */
export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(siteDefaults);
  const [services, setServices] = useState(defaultServices);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    axios.get('/site-settings')
      .then((res) => setSettings({ ...siteDefaults, ...res.data }))
      .catch(() => {});
  }, []);

  const reload = useCallback(() => {
    setStatus('loading');
    axios.get('/services')
      .then((res) => { setServices(res.data); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return (
    <SiteSettingsContext.Provider value={{ ...settings, setSettings }}>
      <ServicesContext.Provider value={{ services, status, reload }}>
        {children}
      </ServicesContext.Provider>
    </SiteSettingsContext.Provider>
  );
};
