'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Plus } from 'react-feather';

interface HeroSectionProps {
  onCreateWishlistClick: () => void;
}

export default function HeroSection({ onCreateWishlistClick }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
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
              onClick={onCreateWishlistClick}
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
  );
}
