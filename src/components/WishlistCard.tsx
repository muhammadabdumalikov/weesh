'use client';

import { Gift, MoreVertical } from 'react-feather';

interface WishlistCardProps {
  id: string;
  title: string;
  itemCount: number;
  coverImage?: string;
  previewItems?: Array<{ imageUrl?: string; title: string }>;
  onClick?: () => void;
  onMenuClick?: () => void;
}

export default function WishlistCard({
  id,
  title,
  itemCount,
  coverImage,
  previewItems = [],
  onClick,
  onMenuClick,
}: WishlistCardProps) {
  return (
    <div
      className="h-64 sm:h-72 md:h-80 w-full rounded-3xl sm:rounded-4xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-pink-200/50 hover:scale-[0.98] sm:hover:scale-95 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      {/* Main card */}
      <div className="w-full h-full flex flex-col">
        {/* Cover image area */}
        <div className="relative h-32 sm:h-36 md:h-44 overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            /* Gradient placeholder with pattern */
            <div className="w-full h-full bg-gradient-to-br from-pink-100 via-orange-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-pink-200/50 to-orange-200/50 blur-sm" />
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-orange-200/50 to-pink-200/50 blur-sm" />
              
              {/* Preview items grid or gift icon */}
              {previewItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-3 sm:p-4">
                  {previewItems.slice(0, 4).map((item, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-white shadow-sm overflow-hidden flex items-center justify-center"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Gift className="w-4 h-4 sm:w-6 sm:h-6 text-pink-300" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(230, 0, 122, 0.1) 0%, rgba(255, 102, 0, 0.1) 100%)',
                  }}
                >
                  <Gift
                    className="w-7 h-7 sm:w-10 sm:h-10"
                    style={{
                      color: '#E6007A',
                    }}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Gradient overlay at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-white to-transparent" />
          
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
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 font-geologica line-clamp-2 leading-tight">
            {title}
          </h3>
          
          {/* Item count with gradient accent */}
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #E6007A 0%, #FF6600 100%)',
              }}
            />
            <span className="text-xs sm:text-sm text-gray-500 font-geologica">
              {itemCount} {itemCount === 1 ? 'подарок' : itemCount < 5 ? 'подарка' : 'подарков'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
