'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Plus, Check } from 'react-feather';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/wishlist/AuthModal';
import { useTheme, type StyleId } from '@/contexts/ThemeContext';
import {
  signIn,
  signUp,
  signOut,
  isAuthenticated,
  getUsername,
  type AuthCredentials,
} from '@/lib/api/wishlist';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [username, setUsernameState] = useState('');

  useEffect(() => {
    setIsUserAuthenticated(isAuthenticated());
    const stored = getUsername();
    if (stored) setUsernameState(stored);
  }, []);

  const handleSignIn = async (credentials: AuthCredentials) => {
    await signIn(credentials);
    setIsUserAuthenticated(true);
    setUsernameState(credentials.login);
    setIsAuthModalOpen(false);
  };

  const handleSignUp = async (credentials: AuthCredentials) => {
    await signUp(credentials);
    setIsUserAuthenticated(true);
    setUsernameState(credentials.login);
    setIsAuthModalOpen(false);
  };

  const handleCreateWishlist = () => {
    if (!isUserAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    router.push('/wishlist');
  };

  const { style: selectedStyle, setStyle: setSelectedStyle } = useTheme();

  const styleOptions: { id: StyleId; labelKey: string; swatch1: string; swatch2: string }[] = [
    { id: 'classic', labelKey: 'styleClassic', swatch1: '#f5f5f5', swatch2: '#9ca3af' },
    { id: 'pink', labelKey: 'stylePink', swatch1: '#fce7f3', swatch2: '#db2777' },
    { id: 'warm', labelKey: 'styleWarm', swatch1: '#fef3c7', swatch2: '#b45309' },
    { id: 'ocean', labelKey: 'styleOcean', swatch1: '#e0f2fe', swatch2: '#0e7490' },
    { id: 'sage', labelKey: 'styleSage', swatch1: '#dcfce7', swatch2: '#4d7c0f' },
    { id: 'vintage', labelKey: 'styleVintage', swatch1: '#f3e8ff', swatch2: '#7c3aed' },
    { id: 'bold', labelKey: 'styleBold', swatch1: '#fce7f3', swatch2: '#dc2626' },
    { id: 'citrus', labelKey: 'styleCitrus', swatch1: '#ffedd5', swatch2: '#ea580c' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--theme-page-bg)' }}>
      <Header
        onSignInClick={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          signOut();
          setIsUserAuthenticated(false);
          setUsernameState('');
        }}
        isAuthenticated={isUserAuthenticated}
        username={username}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 md:px-8 py-8 md:py-12 pt-20 md:pt-24 pb-12 md:pb-24 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 lg:gap-4 min-h-[60vh] md:min-h-[70vh]">
          {/* Left: Headline */}
          <div className="flex-1 space-y-4 lg:space-y-6 relative z-10 text-center lg:text-left w-full">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] font-geologica">
              <span className="block lg:ml-12 text-[#222222]">{t('home.heroLine1')}</span>
              <span className="block text-[#222222]">{t('home.heroLine2')}</span>
              <span className="block lg:ml-24 theme-gradient-text">
                {t('home.heroLine3')}
              </span>
              <span className="block lg:ml-32 text-[#222222]">{t('home.heroLine4')}</span>
            </h1>

            {/* CTA Button */}
            <div className="mt-6 flex justify-center lg:justify-start">
              <div className="button-gradient-border">
                <button
                  onClick={handleCreateWishlist}
                  className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-full font-medium hover:opacity-90 transition-opacity text-base sm:text-lg w-full font-geologica"
                >
                  <div className="gradient-border-button flex-shrink-0 p-1.5 sm:p-2">
                    <div className="gradient-border-button-inner">
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 theme-icon-color" />
                    </div>
                  </div>
                  <span className="text-[#222222] text-lg sm:text-xl whitespace-nowrap">{t('home.createWishlist')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="gradient-border w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[500px] xl:max-w-[600px] mb-8 lg:mb-24 mx-auto lg:mx-0">
            <div className="gradient-border-inner relative">
              <Image
                src="/pux.jpeg"
                alt={t('home.illustrationAlt')}
                width={600}
                height={600}
                className="rounded-full object-cover w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>

        {/* Your Wishlist, Your Style */}
        <section className="mt-16 md:mt-24 lg:mt-32 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold font-geologica uppercase tracking-wide mb-4">
            {t('home.styleNewTag')}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#222222] font-geologica mb-2">
            {t('home.styleSectionTitle')}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-geologica max-w-md mx-auto mb-8 md:mb-10">
            {t('home.styleSectionSubtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {styleOptions.map((opt) => {
              const isSelected = selectedStyle === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedStyle(opt.id)}
                  className={`inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold font-geologica text-sm sm:text-base transition-all ${
                    isSelected
                      ? 'bg-[#222222] text-white shadow-md'
                      : 'bg-white text-[#222222] border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <span className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                    <span
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-200/80"
                      style={{ backgroundColor: opt.swatch1 }}
                    />
                    <span
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-200/80"
                      style={{ backgroundColor: opt.swatch2 }}
                    />
                  </span>
                  <span>{t(`home.${opt.labelKey}`)}</span>
                  {isSelected && <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="mt-20 md:mt-28 lg:mt-36 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#222222] font-geologica mb-2">
            {t('home.howItWorksTitle')}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-geologica max-w-xl mx-auto mb-12 md:mb-16">
            {t('home.howItWorksSubtitle')}
          </p>

          {/* Step 1: Text left, placeholder right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center mb-16 md:mb-24">
            <div className="order-2 lg:order-1 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#222222] font-bold font-geologica text-xl mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#222222] font-geologica mb-3">
                {t('home.howItWorksStep1Title')}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base font-geologica leading-relaxed">
                {t('home.howItWorksStep1Desc')}
              </p>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="w-full max-w-[280px] aspect-[9/19] rounded-3xl bg-slate-100/80 shadow-lg flex items-center justify-center">
                <span className="text-slate-400 text-sm font-geologica">Phone mockup</span>
              </div>
            </div>
          </div>

          {/* Step 2: Placeholder left, text right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center mb-16 md:mb-24">
            <div className="flex justify-center order-1">
              <div className="w-full max-w-[280px] aspect-[9/19] rounded-3xl bg-violet-50/90 shadow-lg flex items-center justify-center">
                <span className="text-violet-400 text-sm font-geologica">Phone mockup</span>
              </div>
            </div>
            <div className="order-2 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#222222] font-bold font-geologica text-xl mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#222222] font-geologica mb-3">
                {t('home.howItWorksStep2Title')}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base font-geologica leading-relaxed">
                {t('home.howItWorksStep2Desc')}
              </p>
            </div>
          </div>

          {/* Step 3: Text left, placeholder right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="order-2 lg:order-1 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#222222] font-bold font-geologica text-xl mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#222222] font-geologica mb-3">
                {t('home.howItWorksStep3Title')}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base font-geologica leading-relaxed">
                {t('home.howItWorksStep3Desc')}
              </p>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="w-full max-w-[280px] aspect-[9/19] rounded-3xl bg-emerald-50/90 shadow-lg flex items-center justify-center">
                <span className="text-emerald-400 text-sm font-geologica">Phone mockup</span>
              </div>
            </div>
          </div>
        </section>

        {/* Create any type of wishlist */}
        <section className="mt-20 md:mt-28 lg:mt-36 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#222222] font-geologica mb-3 text-balance max-w-2xl mx-auto">
            {t('home.createAnyWishlistTitle')}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-geologica mb-12 md:mb-16 text-balance max-w-xl mx-auto">
            {t('home.createAnyWishlistSubtitle')}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-10 items-center max-w-6xl mx-auto px-2">
            {/* Left column: 3 cards — slight negative rotation, compact single-line */}
            <div className="flex flex-col gap-3 lg:gap-4 order-2 lg:order-1 items-center lg:items-end">
              {[
                { emoji: '🎂', key: 'wishlistTypeBirthday', bg: '#FCEEF6', rotate: '-2deg' },
                { emoji: '🎄', key: 'wishlistTypeChristmas', bg: '#DFF5EB', rotate: '-1deg' },
                { emoji: '👶', key: 'wishlistTypeBaby', bg: '#FFF5DF', rotate: '-3deg' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-1 w-full max-w-[140px] sm:max-w-[160px] shadow-md transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: item.bg, transform: `rotate(${item.rotate})` }}
                >
                  <span className="text-2xl sm:text-3xl" aria-hidden>{item.emoji}</span>
                  <span className="font-semibold text-[#222222] font-geologica text-xs sm:text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    {t(`home.${item.key}`)}
                  </span>
                </div>
              ))}
            </div>

            {/* Center: phone mockup — light gray, phone aspect */}
            <div className="flex justify-center order-1 lg:order-2">
              <div
                className="relative overflow-hidden rounded-[1.5rem] max-w-[240px] w-full aspect-[9/19] pt-12 flex flex-col items-center justify-start shadow-xl"
                style={{ backgroundColor: '#f0f0f0' }}
              >
                <span className="text-gray-600 font-semibold font-geologica text-sm mt-2">My Lists</span>
                <span className="text-gray-400 font-geologica text-xs mt-3">+ New Wishlist</span>
              </div>
            </div>

            {/* Right column: 3 cards — slight positive rotation, compact single-line */}
            <div className="flex flex-col gap-3 lg:gap-4 order-3 items-center lg:items-start">
              {[
                { emoji: '💍', key: 'wishlistTypeWedding', bg: '#EDEBFD', rotate: '2deg' },
                { emoji: '🛍️', key: 'wishlistTypeShopping', bg: '#E4F2FE', rotate: '1deg' },
                { emoji: '✨', key: 'wishlistTypeInspiration', bg: '#FEF2D0', rotate: '3deg' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-1 w-full max-w-[140px] sm:max-w-[160px] shadow-md transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: item.bg, transform: `rotate(${item.rotate})` }}
                >
                  <span className="text-2xl sm:text-3xl" aria-hidden>{item.emoji}</span>
                  <span className="font-semibold text-[#222222] font-geologica text-xs sm:text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    {t(`home.${item.key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
