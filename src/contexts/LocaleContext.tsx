'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import i18n, { getStoredLocale, setStoredLocale, type Locale } from '@/i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const defaultValue: LocaleContextValue = {
  locale: 'ru',
  setLocale: () => {},
};

const LocaleContext = createContext<LocaleContextValue>(defaultValue);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ru');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getStoredLocale();
    setLocaleState(initial);
    i18n.changeLanguage(initial);
    setMounted(true);
  }, []);

  const setLocale = useCallback((lng: Locale) => {
    setLocaleState(lng);
    setStoredLocale(lng);
    i18n.changeLanguage(lng);
  }, []);

  const value = mounted ? { locale, setLocale } : defaultValue;

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
