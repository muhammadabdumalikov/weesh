'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Logo from '@/components/Logo';

const socialConfig = [
  { href: 'https://x.com', key: 'socialX' as const },
  { href: 'https://instagram.com/weesh.link', key: 'socialInstagram' as const },
  { href: 'https://telegram.org', key: 'socialTelegram' as const },
  { href: 'https://facebook.com', key: 'socialFacebook' as const },
];

const navColumnsConfig = [
  {
    titleKey: 'service' as const,
    links: [
      { key: 'features' as const, href: '#features' },
      { key: 'pricing' as const, href: '#pricing' },
    ],
  },
  {
    titleKey: 'resources' as const,
    links: [
      { key: 'blog' as const, href: '#blog' },
      { key: 'support' as const, href: '#support' },
    ],
  },
  {
    titleKey: 'company' as const,
    links: [
      { key: 'aboutUs' as const, href: '#about' },
      { key: 'contact' as const, href: '#contact' },
    ],
  },
];

const legalLinksConfig = [
  { key: 'privacyPolicy' as const, href: '/privacy' },
  { key: 'termsOfService' as const, href: '/terms' },
  { key: 'cookieSettings' as const, href: '#cookies' },
];

const socialIcons = [
  <svg key="x" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>,
  <svg key="ig" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>,
  <svg key="tg" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>,
  <svg key="fb" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>,
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="px-4 sm:px-8 md:px-16 lg:px-32 py-12 md:py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex">
              <Logo asSpan className="text-2xl md:text-3xl" />
            </Link>
            <p className="text-gray-500 text-sm md:text-base font-geologica max-w-md leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-4 mt-2">
              {socialConfig.map(({ href, key }, i) => (
                <Link
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-gray-600 transition-colors"
                  aria-label={t(`footer.${key}`)}
                >
                  {socialIcons[i]}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 lg:gap-12">
            {navColumnsConfig.map((column) => (
              <div key={column.titleKey}>
                <h3 className="text-sm font-bold text-black font-geologica mb-4">
                  {t(`footer.${column.titleKey}`)}
                </h3>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-gray-500 text-sm font-geologica hover:text-gray-700 transition-colors"
                      >
                        {t(`footer.${link.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 md:px-16 lg:px-32 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-geologica">
          <span>{t('footer.copyright')}</span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {legalLinksConfig.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-gray-500 hover:text-gray-700 transition-colors underline underline-offset-2"
              >
                {t(`footer.${link.key}`)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
