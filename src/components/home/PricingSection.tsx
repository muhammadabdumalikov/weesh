'use client';

import { useTranslation } from 'react-i18next';
import { Check } from 'react-feather';

interface PricingSectionProps {
  onGetStartedClick?: () => void;
  onNotifyMeClick?: () => void;
}

export default function PricingSection({ onGetStartedClick, onNotifyMeClick }: PricingSectionProps) {
  const { t } = useTranslation();

  return (
    <section id="pricing" className="mt-20 md:mt-28 lg:mt-36 text-center scroll-mt-24">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-geologica mb-2 text-balance max-w-2xl mx-auto theme-content-color">
        {t('home.pricingTitle')}
      </h2>
      <p className="text-sm sm:text-base font-geologica max-w-xl mx-auto mb-12 md:mb-16 theme-content-muted">
        {t('home.pricingSubtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
        {/* Free plan */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 flex flex-col text-left">
          <h3 className="text-xl font-bold text-[#222222] font-geologica mb-1">
            {t('home.pricingFreeName')}
          </h3>
          <p className="text-2xl font-bold text-[#222222] font-geologica mb-6">
            {t('home.pricingFreePrice')}
          </p>
          <ul className="space-y-3 mb-8 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base font-geologica">
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>{t(`home.pricingFreeFeature${i}`)}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onGetStartedClick}
            className="w-full py-3 px-4 rounded-xl font-semibold font-geologica text-white theme-gradient-bg hover:opacity-90 transition-opacity cursor-pointer"
          >
            {t('home.pricingFreeCta')}
          </button>
        </div>

        {/* Pro plan */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 flex flex-col text-left">
          <h3 className="text-xl font-bold text-[#222222] font-geologica mb-1">
            {t('home.pricingProName')}
          </h3>
          <p className="text-2xl font-bold text-[#222222] font-geologica mb-6">
            {t('home.pricingProPrice')}
          </p>
          <ul className="space-y-3 mb-8 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base font-geologica">
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>{t(`home.pricingProFeature${i}`)}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onNotifyMeClick}
            className="w-full py-3 px-4 rounded-xl font-semibold font-geologica text-[#222222] bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors cursor-pointer"
          >
            {t('home.pricingProCta')}
          </button>
        </div>
      </div>
    </section>
  );
}
