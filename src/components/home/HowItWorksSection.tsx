'use client';

import { useTranslation } from 'react-i18next';

export default function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section className="mt-20 md:mt-28 lg:mt-36 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#222222] font-geologica mb-2">
        {t('home.howItWorksTitle')}
      </h2>
      <p className="text-gray-500 text-sm sm:text-base font-geologica max-w-xl mx-auto mb-12 md:mb-16">
        {t('home.howItWorksSubtitle')}
      </p>

      {/* Step 1: Text left, placeholder right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center mb-16 md:mb-24">
        <div className="order-2 lg:order-1 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#222222] font-bold font-geologica text-xl mb-4 mx-auto">
            1
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#222222] font-geologica mb-3">
            {t('home.howItWorksStep1Title')}
          </h3>
          <p className="text-gray-500 text-sm sm:text-base font-geologica leading-relaxed">
            {t('home.howItWorksStep1Desc')}
          </p>
        </div>
        <div className="order-1 lg:order-2 flex justify-center">
          <div className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] aspect-[9/19] rounded-[1.5rem] bg-slate-100/80 flex items-center justify-center">
            <span className="text-slate-400 text-sm font-geologica">Phone mockup</span>
          </div>
        </div>
      </div>

      {/* Step 2: Placeholder left, text right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center mb-16 md:mb-24">
        <div className="flex justify-center order-1">
          <div className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] aspect-[9/19] rounded-[1.5rem] bg-violet-50/90 flex items-center justify-center">
            <span className="text-violet-400 text-sm font-geologica">Phone mockup</span>
          </div>
        </div>
        <div className="order-2 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#222222] font-bold font-geologica text-xl mb-4 mx-auto">
            2
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#222222] font-geologica mb-3">
            {t('home.howItWorksStep2Title')}
          </h3>
          <p className="text-gray-500 text-sm sm:text-base font-geologica leading-relaxed">
            {t('home.howItWorksStep2Desc')}
          </p>
        </div>
      </div>

      {/* Step 3: Text left, placeholder right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
        <div className="order-2 lg:order-1 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#222222] font-bold font-geologica text-xl mb-4 mx-auto">
            3
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#222222] font-geologica mb-3">
            {t('home.howItWorksStep3Title')}
          </h3>
          <p className="text-gray-500 text-sm sm:text-base font-geologica leading-relaxed">
            {t('home.howItWorksStep3Desc')}
          </p>
        </div>
        <div className="order-1 lg:order-2 flex justify-center">
          <div className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] aspect-[9/19] rounded-[1.5rem] bg-emerald-50/90 flex items-center justify-center">
            <span className="text-emerald-400 text-sm font-geologica">Phone mockup</span>
          </div>
        </div>
      </div>
    </section>
  );
}
