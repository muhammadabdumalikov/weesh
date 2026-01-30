'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogOut, User, Users, CreditCard, Bookmark, Moon, Globe } from 'react-feather';
import Logo from '@/components/Logo';
import { useLocale } from '@/contexts/LocaleContext';
import type { Locale } from '@/i18n';

const LANG_LABELS: Record<Locale, string> = {
  en: 'En',
  ru: 'Ru',
  uz: 'Uz',
};

interface HeaderProps {
  onSignInClick?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  username?: string;
}

export default function Header({ onSignInClick, onLogout, isAuthenticated, username }: HeaderProps) {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const langOptions: Locale[] = ['en', 'ru', 'uz'];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const profileModalRef = useRef<HTMLDivElement>(null);
  const langDropdownDesktopRef = useRef<HTMLDivElement>(null);
  const langDropdownMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileModalRef.current && !profileModalRef.current.contains(e.target as Node)) {
        setIsProfileModalOpen(false);
      }
      const target = e.target as Node;
      const desktop = langDropdownDesktopRef.current?.contains(target);
      const mobile = langDropdownMobileRef.current?.contains(target);
      if (!desktop && !mobile) setIsLangOpen(false);
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-8 sm:px-12 md:px-24 lg:px-32 xl:px-40 py-2 md:py-4 flex justify-between items-center backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-xs">
      <Logo />

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-4 sm:gap-6 lg:gap-8">
        <div className="relative" ref={langDropdownDesktopRef}>
          <button
            type="button"
            onClick={() => setIsLangOpen((v) => !v)}
            className="flex items-center gap-1.5 text-black hover:text-gray-600 transition-colors cursor-pointer font-geologica text-sm lg:text-base"
            aria-expanded={isLangOpen}
            aria-haspopup="listbox"
            aria-label={t('header.selectLanguage')}
          >
            <span>{LANG_LABELS[locale]}</span>
            <Globe className="w-4 h-4 text-current" strokeWidth={2} />
          </button>
          {isLangOpen && (
            <div
              className="absolute top-full left-0 mt-1.5 min-w-[4.5rem] rounded-xl border border-gray-200 bg-white shadow-lg z-50 animate-in zoom-in-95 duration-150"
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
                  className={`w-full px-3 py-2 text-left text-xs font-medium font-geologica transition-colors cursor-pointer first:rounded-t-[11px] last:rounded-b-[11px] ${
                    locale === lang
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {LANG_LABELS[lang]}
                </button>
              ))}
            </div>
          )}
        </div>
        <Link 
          href="#about" 
          className="text-black hover:text-gray-600 transition-colors text-sm lg:text-base font-geologica cursor-pointer"
        >
          {t('header.aboutService')}
        </Link>
        {isAuthenticated ? (
          <button
            type="button"
            onClick={openProfileModal}
            className="flex items-center gap-4 focus:outline-none cursor-pointer px-2 py-1 hover:bg-gray-50 transition-colors rounded-full"
            aria-label={t('header.account')}
          >
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full theme-gradient-bg flex items-center justify-center text-white font-bold font-geologica text-sm lg:text-base">
              {username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-gray-600 font-geologica hidden lg:block">{username}</span>
          </button>
        ) : (
          <button 
            onClick={onSignInClick}
            className="px-4 lg:px-5 py-2 border border-black rounded-full text-black text-sm lg:text-base font-geologica cursor-pointer"
          >
            {t('header.signIn')}
          </button>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg md:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col p-4 gap-4">
            <div className="relative self-start" ref={langDropdownMobileRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen((v) => !v)}
                className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors cursor-pointer font-geologica text-base py-2 min-h-[44px] touch-manipulation"
                aria-expanded={isLangOpen}
                aria-haspopup="listbox"
                aria-label={t('header.selectLanguage')}
              >
                <span>{LANG_LABELS[locale]}</span>
                <Globe className="w-4 h-4 text-current" strokeWidth={1.5} />
              </button>
              {isLangOpen && (
                <div
                  className="absolute top-full left-0 mt-1.5 min-w-[5rem] py-1 rounded-xl border border-gray-200 bg-white shadow-lg z-50 animate-in zoom-in-95 duration-150"
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
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium font-geologica transition-colors cursor-pointer first:rounded-t-[11px] last:rounded-b-[11px] touch-manipulation ${
                        locale === lang
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {LANG_LABELS[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link 
              href="#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-black hover:text-gray-600 transition-colors text-base font-geologica py-2 cursor-pointer"
            >
              {t('header.aboutService')}
            </Link>
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
                className="w-full px-5 py-3 border border-black rounded-full text-black hover:bg-gray-50 transition-colors text-base font-geologica cursor-pointer"
              >
                {t('header.signIn')}
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Profile card modal — dropdown from top-right (example style) */}
      {isProfileModalOpen && (
        <>
          <div className="fixed inset-0 z-[99] bg-black/20 md:bg-transparent" aria-hidden="true" />
          <div
            ref={profileModalRef}
            className="fixed z-[100] w-full max-w-[280px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200 md:top-20 md:right-4 lg:right-16 xl:right-32 top-20 left-4 right-4 mx-auto md:mx-0 md:left-auto"
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

            {/* Options list */}
            <div className="py-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left font-geologica text-[#222222] hover:bg-gray-50 transition-colors"
              >
                <User className="w-[18px] h-[18px] text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium">{t('header.account')}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left font-geologica text-[#222222] hover:bg-gray-50 transition-colors"
              >
                <Users className="w-[18px] h-[18px] text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium">{t('header.referrals')}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left font-geologica text-[#222222] hover:bg-gray-50 transition-colors"
              >
                <Users className="w-[18px] h-[18px] text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium">{t('header.community')}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left font-geologica text-[#222222] hover:bg-gray-50 transition-colors"
              >
                <CreditCard className="w-[18px] h-[18px] text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium">{t('header.payment')}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left font-geologica text-[#222222] hover:bg-gray-50 transition-colors"
              >
                <Bookmark className="w-[18px] h-[18px] text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium">{t('header.bookmarks')}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDarkMode((v) => !v)}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left font-geologica text-[#222222] hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Moon className="w-[18px] h-[18px] text-gray-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{t('header.darkTheme')}</span>
                </span>
                <span
                  className={`w-9 h-5 rounded-full flex flex-shrink-0 items-center transition-colors ${
                    isDarkMode ? 'justify-end theme-gradient-bg' : 'justify-start bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={isDarkMode}
                >
                  <span className="block w-4 h-4 rounded-full bg-white shadow mx-0.5" />
                </span>
              </button>
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
