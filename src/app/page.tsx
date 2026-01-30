'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus } from 'react-feather';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/wishlist/AuthModal';
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

  return (
    <div className="min-h-screen bg-[#f7f7f7] relative overflow-hidden">
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
        currentLang="ru"
      />

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 md:px-8 py-8 md:py-12 pt-20 md:pt-24 pb-12 md:pb-24 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 lg:gap-4 min-h-[60vh] md:min-h-[70vh]">
          {/* Left: Headline */}
          <div className="flex-1 space-y-4 lg:space-y-6 relative z-10 text-center lg:text-left w-full">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] font-geologica">
              <span className="block lg:ml-12 text-[#222222]">получайте</span>
              <span className="block text-[#222222]">только</span>
              <span className="block lg:ml-24 bg-gradient-to-r from-[#E6007A] to-[#FF6600] bg-clip-text text-transparent">
                желанные
              </span>
              <span className="block lg:ml-32 text-[#222222]">подарки</span>
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
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF0000]" />
                    </div>
                  </div>
                  <span className="text-[#222222] text-lg sm:text-xl whitespace-nowrap">Создать вишлист</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="gradient-border w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[500px] xl:max-w-[600px] mb-8 lg:mb-24 mx-auto lg:mx-0">
            <div className="gradient-border-inner relative">
              <Image
                src="/pux.jpeg"
                alt="Wishlist illustration"
                width={600}
                height={600}
                className="rounded-full object-cover w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
