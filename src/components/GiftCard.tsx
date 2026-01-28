'use client';

import { Gift, ExternalLink, MoreVertical, Check } from 'react-feather';

interface GiftCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  productUrl?: string;
  price?: string;
  isReserved?: boolean;
  onClick?: () => void;
  onMenuClick?: () => void;
  onReserveClick?: () => void;
}

export default function GiftCard({
  id,
  title,
  imageUrl,
  productUrl,
  price,
  isReserved = false,
  onClick,
  onMenuClick,
  onReserveClick,
}: GiftCardProps) {
  return (
    <div
      className="h-64 sm:h-72 md:h-80 w-full rounded-3xl sm:rounded-4xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-pink-200/50 hover:scale-[0.98] sm:hover:scale-95 cursor-pointer group overflow-hidden relative"
      onClick={onClick}
    >
      {/* Main card */}
      <div className="w-full h-full flex flex-col">
        {/* Image area */}
        <div className="relative h-32 sm:h-36 md:h-44 overflow-hidden bg-gray-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            /* Placeholder with gradient */
            <div className="w-full h-full bg-gradient-to-br from-pink-50 via-orange-50 to-pink-100 flex items-center justify-center">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(230, 0, 122, 0.15) 0%, rgba(255, 102, 0, 0.15) 100%)',
                }}
              >
                <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400" />
              </div>
            </div>
          )}
          
          {/* Reserved badge */}
          {isReserved && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-500 text-white text-[10px] sm:text-xs font-semibold font-geologica flex items-center gap-1">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Забронировано</span>
              <span className="sm:hidden">Занят</span>
            </div>
          )}
          
          {/* Menu button - always visible on mobile for touch */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick?.();
            }}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-800 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-sm"
          >
            <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
        
        {/* Content area */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between relative">
          {/* Title and price */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 font-geologica line-clamp-2 leading-tight mb-0.5 sm:mb-1">
              {title}
            </h3>
            {price && (
              <p className="text-base sm:text-lg font-bold font-geologica bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                {price}
              </p>
            )}
          </div>
          
          {/* Actions - always visible on mobile, hover on desktop */}
          <div className="flex gap-2 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-200">
            {productUrl && (
              <a
                href={productUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 transition-colors font-geologica"
              >
                <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Купить
              </a>
            )}
            {!isReserved && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReserveClick?.();
                }}
                className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md font-geologica"
              >
                Подарить
              </button>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}
