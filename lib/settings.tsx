'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';
import type { SiteSettings } from '@/types';

const DEFAULTS: SiteSettings = {
  whatsappNumber: '+919876543210',
  phoneNumber: '+91-9876543210',
  shopAddress: '81/1, main road, near bank of baroda, barra-2, Barra, kanpur nagar, Kanpur, Uttar Pradesh 208027',
  shopEmail: 'info@devendraelectricals.com',
};

interface SettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULTS,
  isLoading: true,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<{ success: boolean; data: SiteSettings }>('/settings');
        if (res.success && res.data) {
          setSettings({ ...DEFAULTS, ...res.data });
        }
      } catch {
        // fallback to defaults
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
