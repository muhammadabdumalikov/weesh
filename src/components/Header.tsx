'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogOut, Zap, Settings } from 'react-feather';
import Logo from '@/components/Logo';
import { useLocale } from '@/contexts/LocaleContext';
import { useLockBodyScroll } from '@/lib/useLockBodyScroll';
import type { Locale } from '@/i18n';

const LANG_LABELS: Record<Locale, string> = {
  en: 'En',
  ru: 'Ru',
  uz: 'Uz',
};

const LANG_FLAGS: Record<Locale, string> = {
  en: '🇺🇸',
  ru: '🇷🇺',
  uz: '🇺🇿',
};

interface HeaderProps {
  onSignInClick?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  username?: string;
}

export default function Header({ onSignInClick, onLogout, isAuthenticated, username }: HeaderProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const handleUpgradeClick = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (pathname === '/') {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push('/#pricing');
    }
  };
  const { locale, setLocale } = useLocale();
  const langOptions: Locale[] = ['en', 'ru', 'uz'];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  useLockBodyScroll(isProfileModalOpen);
  const profileModalRef = useRef<HTMLDivElement>(null);
  const langDropdownDesktopRef = useRef<HTMLDivElement>(null);
  const langDropdownMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileModalRef.current && !profileModalRef.current.contains(e.target as Node)) {
        setIsProfileModalOpen(false);
      }
      const target = e.target as Node;
      const inDesktop = langDropdownDesktopRef.current?.contains(target);
      const inMobile = langDropdownMobileRef.current?.contains(target);
      if (!inDesktop && !inMobile) setIsLangOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileModalOpen, isLangOpen]);

  const handleSignInClick = () => {
    setIsMobileMenuOpen(false);
    onSignInClick?.();
  };

  const openProfileModal = () => {
    setIsMobileMenuOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleLogout = () => {
    setIsProfileModalOpen(false);
    onLogout?.();
  };

  const navBtnBase = 'header-nav-btn rounded-full';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-2 md:py-4 flex justify-between items-center">
        <Logo />

        {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-2 sm:gap-3">
        <Link
          href="/#pricing"
          onClick={handleUpgradeClick}
          className={`inline-flex items-center gap-1.5 h-10 px-3 py-0 font-semibold font-geologica text-sm ${navBtnBase}`}
        >
          <span className="theme-gradient-text-135">{t('header.upgradePlan')}</span>
          <Zap className="w-4 h-4 theme-icon-color shrink-0" strokeWidth={2.5} />
        </Link>

        {/* Flag language selector — between upgrade and profile */}
        <div className="relative" ref={langDropdownDesktopRef}>
          <button
            type="button"
            onClick={() => setIsLangOpen((v) => !v)}
            className={`flex items-center justify-center w-10 h-10 text-2xl leading-none shrink-0 ${navBtnBase}`}
            aria-expanded={isLangOpen}
            aria-haspopup="listbox"
            aria-label={t('header.selectLanguage')}
          >
            {LANG_FLAGS[locale]}
          </button>
          {isLangOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 pt-2 z-50">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-gray-800" aria-hidden />
              <div
                className="min-w-[4.5rem] rounded-xl bg-gray-800 animate-in zoom-in-95 duration-150"
                role="listbox"
                aria-label={t('header.languageOptions')}
              >
                {langOptions.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    role="option"
                    aria-selected={locale === lang}
                    onClick={() => {
                      setLocale(lang);
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-left font-geologica transition-colors cursor-default first:rounded-t-xl last:rounded-b-xl ${
                      locale === lang
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-200 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl leading-none">{LANG_FLAGS[lang]}</span>
                    <span className="text-sm font-medium">{LANG_LABELS[lang]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={openProfileModal}
            className="flex items-center justify-center focus:outline-none cursor-default p-0 hover:opacity-90 transition-opacity rounded-full shrink-0"
            aria-label={t('header.account')}
          >
            <div className="w-10 h-10 rounded-full theme-gradient-bg flex items-center justify-center text-white font-bold font-geologica text-sm">
              {username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </button>
        ) : (
          <button
            onClick={onSignInClick}
            className={`inline-flex items-center h-10 px-4 lg:px-5 py-2 text-[#222222] text-sm lg:text-base font-semibold font-geologica ${navBtnBase}`}
          >
            {t('header.signIn')}
          </button>
        )}
      </nav>

      {/* Mobile: Upgrade button always visible in header + menu button */}
      <div className="md:hidden flex items-center gap-2">
        <Link
          href="/#pricing"
          onClick={handleUpgradeClick}
          className={`inline-flex items-center gap-1.5 px-3 py-2 font-semibold font-geologica text-sm ${navBtnBase}`}
        >
          <span className="theme-gradient-text-135">{t('header.upgradePlan')}</span>
          <Zap className="w-4 h-4 theme-icon-color shrink-0" strokeWidth={2.5} />
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 md:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col p-4 gap-4 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Mobile: flag language selector */}
            <div className="relative self-start" ref={langDropdownMobileRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen((v) => !v)}
                className={`flex items-center gap-2 font-semibold font-geologica text-base py-3 px-4 min-h-[44px] touch-manipulation w-fit ${navBtnBase}`}
                aria-expanded={isLangOpen}
                aria-haspopup="listbox"
                aria-label={t('header.selectLanguage')}
              >
                <span className="text-2xl leading-none">{LANG_FLAGS[locale]}</span>
                <span className="text-[#222222]">{LANG_LABELS[locale]}</span>
              </button>
              {isLangOpen && (
                <div
                  className="absolute top-full left-0 mt-1.5 min-w-[5rem] rounded-xl bg-gray-800 z-50 animate-in zoom-in-95 duration-150"
                  role="listbox"
                  aria-label={t('header.languageOptions')}
                >
                  {langOptions.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      role="option"
                      aria-selected={locale === lang}
                      onClick={() => {
                        setLocale(lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-left font-geologica transition-colors cursor-default first:rounded-t-xl last:rounded-b-xl touch-manipulation ${
                        locale === lang
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-200 hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-xl leading-none">{LANG_FLAGS[lang]}</span>
                      <span className="text-sm font-medium">{LANG_LABELS[lang]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={openProfileModal}
                className="flex items-center gap-3 py-2 w-full text-left rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full theme-gradient-bg flex items-center justify-center text-white font-bold font-geologica flex-shrink-0">
                  {username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-base text-gray-700 font-geologica">{username}</span>
              </button>
            ) : (
              <button
                onClick={handleSignInClick}
                className={`w-full px-5 py-3 text-[#222222] text-base font-semibold font-geologica ${navBtnBase}`}
              >
                {t('header.signIn')}
              </button>
            )}
          </nav>
        </div>
      )}

      </div>

      {/* Profile card modal — dropdown from top-right (example style) */}
      {isProfileModalOpen && (
        <>
          <div className="fixed inset-0 z-[99] bg-black/20 md:bg-transparent" aria-hidden="true" />
          <div
            ref={profileModalRef}
            className="fixed z-[100] w-full max-w-[280px] bg-white rounded-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200 md:top-20 md:right-4 lg:right-16 xl:right-32 top-20 left-4 right-4 mx-auto md:mx-0 md:left-auto"
            role="dialog"
            aria-labelledby="profile-modal-title"
            aria-modal="true"
          >
            {/* User block */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full theme-gradient-bg flex items-center justify-center text-white font-bold font-geologica text-base flex-shrink-0">
                  {username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 id="profile-modal-title" className="text-[15px] font-bold text-[#222222] font-geologica truncate">
                    {username || t('header.user')}
                  </h2>
                  <p className="text-[13px] text-gray-500 font-geologica truncate">
                    {username ? `${username}@weesh` : t('header.account')}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <Link
                href="/profile"
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left font-geologica text-[#222222] hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-[18px] h-[18px] text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium">{t('header.settings')}</span>
              </Link>
            </div>

            {/* Divider before logout */}
            <div className="border-t border-gray-200" />

            <div className="py-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left font-geologica text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-sm font-medium">{t('header.logout')}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
