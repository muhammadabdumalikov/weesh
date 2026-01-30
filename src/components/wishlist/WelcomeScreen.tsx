'use client';

import { useTranslation } from 'react-i18next';
import { Gift, Heart, Star, Share2, Lock } from 'react-feather';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const FEATURE_ICONS = [Gift, Share2, Lock];

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { t } = useTranslation();
  const features = [
    { icon: FEATURE_ICONS[0], titleKey: 'welcome.feature1Title' as const, descKey: 'welcome.feature1Desc' as const },
    { icon: FEATURE_ICONS[1], titleKey: 'welcome.feature2Title' as const, descKey: 'welcome.feature2Desc' as const },
    { icon: FEATURE_ICONS[2], titleKey: 'welcome.feature3Title' as const, descKey: 'welcome.feature3Desc' as const },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16">
        {/* Animated Icons */}
        <div className="flex justify-center gap-4 mb-6 animate-in fade-in zoom-in duration-500">
          <div className="p-4 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl animate-bounce delay-100">
            <Gift className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl animate-bounce delay-200">
            <Heart className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
          </div>
          <div className="p-4 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl animate-bounce delay-300">
            <Star className="w-8 h-8 md:w-10 md:h-10 text-pink-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 animate-in slide-in-from-bottom duration-700">
          {t('welcome.title')}
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 animate-in slide-in-from-bottom duration-700 delay-200">
          {t('welcome.subtitle')}
        </p>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-3 px-8 py-4 theme-gradient-bg text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 animate-in zoom-in duration-700 delay-300"
        >
          <Star className="w-6 h-6" />
          {t('welcome.getStarted')}
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom"
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              <div className="mb-4">
                <div className="inline-flex p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t(feature.descKey)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom Decoration */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-full border-2 border-indigo-100">
          <Star className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-semibold text-gray-700">
            {t('welcome.freeForever')}
          </span>
        </div>
      </div>
    </div>
  );
}

