'use client';

import Image from 'next/image';
import { User } from 'react-feather';

export interface TestimonialCardProps {
  quote: string;
  name: string;
  avatarUrl?: string | null;
  stars?: number;
}

export default function TestimonialCard({
  quote,
  name,
  avatarUrl,
  stars = 5,
}: TestimonialCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 border border-gray-200 flex flex-col h-full">
      <p className="text-gray-700 text-sm sm:text-base font-geologica leading-relaxed flex-1 mb-4 relative">
        <span className="text-2xl sm:text-3xl text-gray-300 font-serif leading-none select-none" aria-hidden>
          &quot;
        </span>
        <span className="px-0.5">{quote}</span>
        <span className="text-2xl sm:text-3xl text-gray-300 font-serif leading-none select-none align-top" aria-hidden>
          &quot;
        </span>
      </p>
      <div className="flex items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-3 min-w-0">
          {avatarUrl ? (
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
              <Image
                src={avatarUrl}
                alt=""
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
          ) : (
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-violet-100 text-violet-500"
              aria-hidden
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
            </div>
          )}
          <span className="font-semibold text-[#222222] font-geologica text-sm sm:text-base truncate">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0" aria-label={`${stars} out of 5 stars`}>
          {Array.from({ length: stars }, (_, i) => (
            <span
              key={i}
              className="text-amber-400 text-base sm:text-lg leading-none"
              aria-hidden
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
