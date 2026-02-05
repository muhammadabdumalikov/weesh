'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Camera, Check, LogOut, Share2 } from 'react-feather';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShareModal from '@/components/wishlist/ShareModal';
import { getUsername, getOwnerCode, isAuthenticated, signOut } from '@/lib/api/wishlist';
import { useTheme, type StyleId } from '@/contexts/ThemeContext';

const THEME_IDS: StyleId[] = ['classic', 'pink', 'warm', 'ocean', 'sage', 'vintage', 'bold', 'citrus', 'dark'];
const THEME_LABEL_KEYS: Record<StyleId, string> = {
  classic: 'styleClassic',
  pink: 'stylePink',
  warm: 'styleWarm',
  ocean: 'styleOcean',
  sage: 'styleSage',
  vintage: 'styleVintage',
  bold: 'styleBold',
  citrus: 'styleCitrus',
  dark: 'styleDark',
};
const THEME_SWATCHES: Record<StyleId, { swatch1: string; swatch2: string }> = {
  classic: { swatch1: '#f5f5f5', swatch2: '#9ca3af' },
  pink: { swatch1: '#fce7f3', swatch2: '#db2777' },
  warm: { swatch1: '#fef3c7', swatch2: '#b45309' },
  ocean: { swatch1: '#e0f2fe', swatch2: '#0e7490' },
  sage: { swatch1: '#dcfce7', swatch2: '#4d7c0f' },
  vintage: { swatch1: '#f3e8ff', swatch2: '#7c3aed' },
  bold: { swatch1: '#fce7f3', swatch2: '#dc2626' },
  citrus: { swatch1: '#ffedd5', swatch2: '#ea580c' },
  dark: { swatch1: '#1a1a1a', swatch2: '#a78bfa' },
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { style, setStyle } = useTheme();
  const [username, setUsername] = useState<string | null>(null);
  const [ownerCode, setOwnerCode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const u = getUsername();
      const code = getOwnerCode();
      setUsername(u);
      setOwnerCode(code);
      setFullName(u ?? '');
      setUsernameInput(code ?? '');
    }
  }, []);

  const authenticated = mounted && isAuthenticated();

  if (!mounted) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--theme-page-bg)' }}>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-24 flex justify-center">
          <div className="animate-pulse h-8 w-48 bg-gray-200 rounded" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--theme-page-bg)' }}>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-500 font-geologica theme-content-muted">{t('profile.signInRequired')}</p>
          <Link
            href="/wishlist"
            className="inline-block mt-4 px-5 py-2.5 rounded-full theme-gradient-bg text-white font-semibold font-geologica text-sm hover:opacity-90"
          >
            {t('header.signIn')}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName = username || t('header.user');
  const handle = ownerCode ? `@${ownerCode}` : '';

  return (
    <div className="min-h-screen" style={{ background: 'var(--theme-page-bg)' }}>
      <Header
        isAuthenticated
        username={username ?? undefined}
        onLogout={() => {
          signOut();
          setStyle('classic');
          router.push('/');
        }}
      />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pt-24 pb-16 space-y-6">
        {/* Profile header card */}
        <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
          <div className="h-24 sm:h-28 bg-gray-100 relative">
            <button
              type="button"
              className="absolute top-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 font-geologica hover:bg-gray-50"
            >
              <Camera className="w-4 h-4" />
              {t('profile.edit')}
            </button>
          </div>
          <div className="px-4 sm:px-6 pb-6 -mt-12 relative">
            <div className="w-24 h-24 rounded-full theme-gradient-bg flex items-center justify-center text-white font-bold font-geologica text-3xl border-4 border-white shadow flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <h1 className="mt-4 text-xl sm:text-2xl font-bold text-[#222222] font-geologica">{displayName}</h1>
            <p className="text-gray-500 font-geologica text-sm mt-0.5">{handle}</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="rounded-2xl bg-white border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-[#222222] font-geologica mb-4">{t('profile.profileInfo')}</h2>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: persist profile changes when API is ready
            }}
          >
            <div>
              <label htmlFor="profile-fullName" className="block text-sm font-medium text-[#222222] font-geologica mb-1.5">
                {t('profile.fullName')}
              </label>
              <input
                id="profile-fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[#222222] font-geologica text-sm theme-input-focus transition-colors"
              />
            </div>
            <div>
              <label htmlFor="profile-username" className="block text-sm font-medium text-[#222222] font-geologica mb-1.5">
                {t('profile.username')}
              </label>
              <input
                id="profile-username"
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[#222222] font-geologica text-sm theme-input-focus transition-colors"
              />
            </div>
            <div>
              <label htmlFor="profile-bio" className="block text-sm font-medium text-[#222222] font-geologica mb-1.5">
                {t('profile.bio')}
              </label>
              <textarea
                id="profile-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t('profile.bioPlaceholder')}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[#222222] font-geologica text-sm placeholder:text-gray-400 theme-input-focus transition-colors resize-y min-h-[96px]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#222222] text-white font-semibold font-geologica text-sm hover:bg-gray-800 transition-colors"
            >
              {t('profile.saveProfileChanges')}
            </button>
          </form>
        </div>

        {/* Share your weesh */}
        <div className="rounded-2xl bg-white border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <h2 className="text-lg font-bold text-[#222222] font-geologica">{t('profile.shareTitle')}</h2>
            <div className="theme-gradient-border-wrap w-fit rounded-full">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="group flex items-center gap-2.5 sm:gap-3 pl-1.5 pr-4 sm:pl-2 sm:pr-5 py-2.5 sm:py-3 rounded-full transition-colors min-h-0"
                style={{ background: 'var(--theme-page-bg)' }}
                aria-label={t('wishlistPage.shareYourWeesh')}
              >
                <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full theme-gradient-bg text-white group-hover:scale-105 transition-transform flex-shrink-0">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <span className="font-geologica font-semibold text-sm sm:text-base theme-content-color">
                  {t('wishlistPage.shareYourWeesh')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Page theme */}
        <div className="rounded-2xl bg-white border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-[#222222] font-geologica">{t('profile.pageTheme')}</h2>
            <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-xs font-bold font-geologica">
              {t('profile.pageThemeNew')}
            </span>
          </div>
          <p className="text-gray-500 text-sm font-geologica mb-4">{t('profile.pageThemeHint')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {THEME_IDS.map((id) => {
              const swatches = THEME_SWATCHES[id];
              const isSelected = style === id;
              const isDarkCard = id === 'dark';
              const nameColor = isDarkCard ? '#f5f5f5' : swatches.swatch2;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setStyle(id)}
                  className={`rounded-xl overflow-hidden text-left transition-all flex flex-col min-h-[100px] ${
                    isSelected
                      ? 'border-2 border-[#222222] ring-2 ring-[#222222] ring-offset-1'
                      : 'border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="relative flex-1 flex items-center justify-center px-3 py-4" style={{ backgroundColor: swatches.swatch1 }}>
                    <span className="text-sm font-bold font-geologica text-center" style={{ color: nameColor }}>
                      {t(`home.${THEME_LABEL_KEYS[id]}`)}
                    </span>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white border-2 border-[#222222] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-[#222222]" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <div
                    className="h-10 rounded-b-[10px] flex-shrink-0"
                    style={{ backgroundColor: swatches.swatch2 }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Visibility & Log out */}
        <div className="rounded-2xl bg-white border border-gray-200 p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium font-geologica text-[#222222]">
              {t('profile.visibility')}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-geologica">
              {t('profile.visibilityPublic')}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                signOut();
                setStyle('classic');
                router.push('/');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left font-geologica text-red-600 hover:bg-red-50 transition-colors rounded-lg"
            >
              <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="text-sm font-medium">{t('header.logout')}</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        ownerCode={ownerCode ?? ''}
      />
    </div>
  );
}
