'use client';

import { Plus } from 'react-feather';

interface CreateWishlistCardProps {
  onClick: () => void;
  text: string;
}

const gradientId = 'create-card-wrapper-gradient';

export default function CreateWishlistCard({ onClick, text }: CreateWishlistCardProps) {
  return (
    <div className="h-64 sm:h-72 md:h-80 w-full rounded-3xl sm:rounded-4xl relative transition-all duration-300 hover:scale-[0.98] sm:hover:scale-95">
      {/* SVG for dashed gradient border - theme via CSS variables */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 256 320"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'var(--theme-gradient-start)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--theme-gradient-end)' }} />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="1"
          width="254"
          height="318"
          rx="32"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeDasharray="8 8"
        />
      </svg>
      <div className="w-full h-full rounded-3xl sm:rounded-4xl bg-white overflow-hidden">
        {/* Content */}
        <button
          onClick={onClick}
          className="w-full h-full cursor-pointer bg-white rounded-xl cursor-default flex flex-col items-center justify-center p-6 sm:p-8 focus:outline-none focus:ring-0"
        >
          {/* Circular Icon with Gradient Border */}
          <div className="mb-3 sm:mb-4 rounded-full flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 p-0.5 theme-gradient-border-wrap">
            {/* Inner Circle with Plus Icon */}
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 theme-icon-color" />
            </div>
          </div>

          {/* Text */}
          <span className="text-black font-geologica text-base sm:text-lg font-medium text-center">
           {text}
          </span>
        </button>
      </div>
    </div>
  );
}
