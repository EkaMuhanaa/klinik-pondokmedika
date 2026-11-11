import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { siteDefaults } from '../seo/siteDefaults';

const SiteSettingsContext = createContext(siteDefaults);

// eslint-disable-next-line react-refresh/only-export-components
export const useSiteSettings = () => useContext(SiteSettingsContext);

/** Data klinik (alamat, kontak, jam, sosial media) dari CMS, dengan nilai cadangan bawaan. */
export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(siteDefaults);

  useEffect(() => {
    axios.get('/site-settings')
      .then((res) => setSettings({ ...siteDefaults, ...res.data }))
      .catch(() => {});
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ ...settings, setSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
