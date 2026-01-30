'use client';

import '@/i18n';
import { LocaleProvider } from '@/contexts/LocaleContext';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
