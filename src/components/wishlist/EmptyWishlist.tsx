'use client';

import { useTranslation } from 'react-i18next';
import { Gift, Plus, Star, Heart } from 'react-feather';

interface EmptyWishlistProps {
  onCreateFirst: () => void;
}

const FEATURE_ICONS = [Gift, Heart, Star];
const FEATURE_KEYS = ['emptyWishlist.feature1', 'emptyWishlist.feature2', 'emptyWishlist.feature3'] as const;

export default function EmptyWishlist({ onCreateFirst }: EmptyWishlistProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden">
          {/* Gradient Header */}
          <div className="theme-gradient-bg p-8 text-center" style={{ background: 'linear-gradient(135deg, var(--theme-gradient-start) 0%, var(--theme-gradient-end) 100%)' }}>
            <div className="inline-flex p-6 bg-white/20 backdrop-blur-sm rounded-3xl mb-4 animate-bounce">
              <Gift className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t('emptyWishlist.title')}
            </h2>
            <p className="text-white/90 text-lg">
              {t('emptyWishlist.subtitle')}
            </p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <p className="text-gray-600 text-center text-lg mb-8">
              {t('emptyWishlist.description')}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {FEATURE_ICONS.map((Icon, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-indigo-300 transition-all"
                >
                  <div className="p-3 bg-white rounded-xl mb-3">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 text-center">
                    {t(FEATURE_KEYS[index])}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={onCreateFirst}
              className="w-full flex items-center justify-center gap-3 py-4 theme-gradient-bg text-white font-semibold rounded-2xl hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-6 h-6" />
              {t('emptyWishlist.createFirst')}
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center gap-2 mt-6 opacity-50">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}

