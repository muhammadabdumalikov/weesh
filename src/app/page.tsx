'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/wishlist/AuthModal';
import HeroSection from '@/components/home/HeroSection';
import StyleSection from '@/components/home/StyleSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import CreateAnyWishlistSection from '@/components/home/CreateAnyWishlistSection';
import PricingSection from '@/components/home/PricingSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { PALETTES, type StyleId } from '@/contexts/ThemeContext';
import {
  signIn,
  signUp,
  signOut,
  isAuthenticated,
  getUsername,
  type AuthCredentials,
} from '@/lib/api/wishlist';

export default function Home() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [username, setUsernameState] = useState('');
  // Home-only demo style: temporary, not saved; resets on refresh. Does not change global theme.
  const [previewStyle, setPreviewStyle] = useState<StyleId>('classic');
  const previewPalette = PALETTES[previewStyle];

  useEffect(() => {
    setIsUserAuthenticated(isAuthenticated());
    const stored = getUsername();
    if (stored) setUsernameState(stored);
  }, []);

  // Smooth scroll to pricing when landing with #pricing (e.g. from upgrade btn on other pages)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash !== '#pricing') return;
    const id = setTimeout(() => {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => clearTimeout(id);
  }, []);

  const handleSignIn = async (credentials: AuthCredentials) => {
    await signIn(credentials);
    setIsUserAuthenticated(true);
    setUsernameState(credentials.login);
    setIsAuthModalOpen(false);
    router.push('/wishlist');
  };

  const handleSignUp = async (credentials: AuthCredentials) => {
    await signUp(credentials);
    setIsUserAuthenticated(true);
    setUsernameState(credentials.login);
    setIsAuthModalOpen(false);
    router.push('/wishlist');
  };

  const handleCreateWishlist = () => {
    if (!isUserAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    router.push('/wishlist');
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--theme-page-bg)' }}>
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

      <div
        className="relative z-10"
        style={{
          background: previewPalette.pageBg,
          ['--theme-page-bg' as string]: previewPalette.pageBg,
          ['--theme-gradient-start' as string]: previewPalette.gradientStart,
          ['--theme-gradient-end' as string]: previewPalette.gradientEnd,
          ['--theme-content-color' as string]: previewPalette.contentColor,
          ['--theme-content-muted' as string]: previewPalette.contentMuted,
        }}
      >
        <main className="px-4 sm:px-6 md:px-8 py-8 md:py-12 pt-20 md:pt-24 pb-12 md:pb-24 max-w-7xl mx-auto">
          <HeroSection onCreateWishlistClick={handleCreateWishlist} />
          <StyleSection selectedStyle={previewStyle} onStyleChange={setPreviewStyle} />
          {/* <HowItWorksSection /> */}
          <CreateAnyWishlistSection />
          <PricingSection onGetStartedClick={handleCreateWishlist} />
          <TestimonialsSection />
        </main>
      </div>

      <Footer />
    </div>
  );
}
