'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  uz: { translation: uz },
};

export type Locale = 'en' | 'ru' | 'uz';

const STORAGE_KEY = 'weesh-locale';

export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'ru';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'ru' || stored === 'uz') return stored;
  return 'ru';
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, locale);
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  supportedLngs: ['en', 'ru', 'uz'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
