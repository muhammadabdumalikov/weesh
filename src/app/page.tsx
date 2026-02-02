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

      <main className="relative z-10 px-4 sm:px-6 md:px-8 py-8 md:py-12 pt-20 md:pt-24 pb-12 md:pb-24 max-w-7xl mx-auto">
        <HeroSection onCreateWishlistClick={handleCreateWishlist} />
        <StyleSection />
        {/* <HowItWorksSection /> */}
        <CreateAnyWishlistSection />
        <PricingSection onGetStartedClick={handleCreateWishlist} />
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
}
