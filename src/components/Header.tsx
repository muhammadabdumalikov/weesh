'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'react-feather';

interface HeaderProps {
  onSignInClick?: () => void;
  isAuthenticated?: boolean;
  username?: string;
}

export default function Header({ onSignInClick, isAuthenticated, username }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignInClick = () => {
    setIsMobileMenuOpen(false);
    onSignInClick?.();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-8 md:px-16 lg:px-32 py-4 md:py-6 flex justify-between items-center backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-xs">
      {/* Logo - container matches 664:223 aspect so logo isn't squashed */}
      <Link href="/" className="relative flex items-center shrink-0 h-10 sm:h-12 md:h-14 lg:h-16 w-[120px] sm:w-[144px] md:w-[168px] lg:w-[192px]">
        <Image
          src="/logo.png"
          alt="weesh"
          fill
          className="object-contain object-left"
          sizes="(max-width: 640px) 120px, (max-width: 768px) 144px, (max-width: 1024px) 168px, 192px"
          priority
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        <Link 
          href="#about" 
          className="text-black hover:text-gray-600 transition-colors text-sm lg:text-base font-geologica"
        >
          О сервисе
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-geologica hidden lg:block">{username}</span>
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold font-geologica text-sm lg:text-base">
              {username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        ) : (
          <button 
            onClick={onSignInClick}
            className="px-4 lg:px-5 py-2 border border-black rounded-full text-black hover:bg-gray-50 transition-colors text-sm lg:text-base font-geologica"
          >
            Войти
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
            <Link 
              href="#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-black hover:text-gray-600 transition-colors text-base font-geologica py-2"
            >
              О сервисе
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold font-geologica">
                  {username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-base text-gray-700 font-geologica">{username}</span>
              </div>
            ) : (
              <button 
                onClick={handleSignInClick}
                className="w-full px-5 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full font-medium transition-colors text-base font-geologica"
              >
                Войти
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
