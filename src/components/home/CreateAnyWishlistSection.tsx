'use client';

import { useTranslation } from 'react-i18next';

const WISHLIST_TYPES = [
  { emoji: '🎂', key: 'wishlistTypeBirthday', bg: '#FCEEF6' },
  { emoji: '🎄', key: 'wishlistTypeChristmas', bg: '#DFF5EB' },
  { emoji: '👶', key: 'wishlistTypeBaby', bg: '#FFF5DF' },
  { emoji: '💍', key: 'wishlistTypeWedding', bg: '#EDEBFD' },
  { emoji: '🛍️', key: 'wishlistTypeShopping', bg: '#E4F2FE' },
  { emoji: '✨', key: 'wishlistTypeInspiration', bg: '#FEF2D0' },
];

const LEFT_CARDS = [
  { emoji: '🎂', key: 'wishlistTypeBirthday', bg: '#FCEEF6', rotate: '-2deg' },
  { emoji: '🎄', key: 'wishlistTypeChristmas', bg: '#DFF5EB', rotate: '-1deg' },
  { emoji: '👶', key: 'wishlistTypeBaby', bg: '#FFF5DF', rotate: '-3deg' },
];

const RIGHT_CARDS = [
  { emoji: '💍', key: 'wishlistTypeWedding', bg: '#EDEBFD', rotate: '2deg' },
  { emoji: '🛍️', key: 'wishlistTypeShopping', bg: '#E4F2FE', rotate: '1deg' },
  { emoji: '✨', key: 'wishlistTypeInspiration', bg: '#FEF2D0', rotate: '3deg' },
];

export default function CreateAnyWishlistSection() {
  const { t } = useTranslation();

  return (
    <section className="mt-20 md:mt-28 lg:mt-36 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-geologica mb-3 text-balance max-w-2xl mx-auto theme-content-color">
        {t('home.createAnyWishlistTitle')}
      </h2>
      <p className="text-sm sm:text-base font-geologica mb-12 md:mb-16 text-balance max-w-xl mx-auto theme-content-muted">
        {t('home.createAnyWishlistSubtitle')}
      </p>

      {/* Mobile: 2-column grid of 6 cards, no phone — narrow width, taller height */}
      <div className="sm:hidden grid grid-cols-2 gap-3 max-w-[280px] mx-auto px-2 py-4">
        {WISHLIST_TYPES.map((item) => (
          <div
            key={item.key}
            className="rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 min-h-[110px]"
            style={{ backgroundColor: item.bg }}
          >
            <span className="text-2xl" aria-hidden>{item.emoji}</span>
            <span className="font-semibold text-[#222222] font-geologica text-xs text-center leading-tight line-clamp-2">
              {t(`home.${item.key}`)}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop: 3-column grid so phone is truly centered (1fr | phone | 1fr), whole row centered */}
      <div className="hidden sm:block w-full py-4 flex justify-center">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-5xl mx-auto px-4">
          {/* Left 3 cards — justify end so they sit next to center */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 md:gap-3">
            {LEFT_CARDS.map((item) => (
              <div
                key={item.key}
                className="rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1 w-[84px] sm:w-[92px] md:w-[100px] lg:w-[108px] h-[108px] sm:h-[118px] md:h-[128px] lg:h-[138px] flex-shrink-0 transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: item.bg, transform: `rotate(${item.rotate})` }}
              >
                <span className="text-xl sm:text-2xl md:text-3xl" aria-hidden>{item.emoji}</span>
                <span className="font-semibold text-[#222222] font-geologica text-[10px] sm:text-xs md:text-sm text-center leading-tight line-clamp-2">
                  {t(`home.${item.key}`)}
                </span>
              </div>
            ))}
          </div>

          {/* Center: phone mockup — truly centered, text centered inside */}
          <div className="flex justify-center w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px] flex-shrink-0">
            <div
              className="relative overflow-hidden rounded-[1.5rem] w-full aspect-[9/19] pt-10 flex flex-col items-center justify-start text-center"
              style={{ backgroundColor: '#f0f0f0' }}
            >
              <span className="w-full text-center text-gray-600 font-semibold font-geologica text-xs mt-2">My Lists</span>
              <span className="w-full text-center text-gray-400 font-geologica text-[10px] mt-2">+ New Wishlist</span>
            </div>
          </div>

          {/* Right 3 cards — justify start so they sit next to center */}
          <div className="flex items-center justify-start gap-2 sm:gap-2.5 md:gap-3">
            {RIGHT_CARDS.map((item) => (
              <div
                key={item.key}
                className="rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1 w-[84px] sm:w-[92px] md:w-[100px] lg:w-[108px] h-[108px] sm:h-[118px] md:h-[128px] lg:h-[138px] flex-shrink-0 transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: item.bg, transform: `rotate(${item.rotate})` }}
              >
                <span className="text-xl sm:text-2xl md:text-3xl" aria-hidden>{item.emoji}</span>
                <span className="font-semibold text-[#222222] font-geologica text-[10px] sm:text-xs md:text-sm text-center leading-tight line-clamp-2">
                  {t(`home.${item.key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
