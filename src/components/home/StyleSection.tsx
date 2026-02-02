'use client';

import { useTranslation } from 'react-i18next';
import { Check } from 'react-feather';
import { useTheme, type StyleId } from '@/contexts/ThemeContext';

const STYLE_OPTIONS: { id: StyleId; labelKey: string; swatch1: string; swatch2: string }[] = [
  { id: 'classic', labelKey: 'styleClassic', swatch1: '#f5f5f5', swatch2: '#9ca3af' },
  { id: 'pink', labelKey: 'stylePink', swatch1: '#fce7f3', swatch2: '#db2777' },
  { id: 'warm', labelKey: 'styleWarm', swatch1: '#fef3c7', swatch2: '#b45309' },
  { id: 'ocean', labelKey: 'styleOcean', swatch1: '#e0f2fe', swatch2: '#0e7490' },
  { id: 'sage', labelKey: 'styleSage', swatch1: '#dcfce7', swatch2: '#4d7c0f' },
  { id: 'vintage', labelKey: 'styleVintage', swatch1: '#f3e8ff', swatch2: '#7c3aed' },
  { id: 'bold', labelKey: 'styleBold', swatch1: '#fce7f3', swatch2: '#dc2626' },
  { id: 'citrus', labelKey: 'styleCitrus', swatch1: '#ffedd5', swatch2: '#ea580c' },
];

export default function StyleSection() {
  const { t } = useTranslation();
  const { style: selectedStyle, setStyle: setSelectedStyle } = useTheme();

  return (
    <section className="mt-16 md:mt-24 lg:mt-32 text-center">
      <span className="inline-block px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold font-geologica uppercase tracking-wide mb-4">
        {t('home.styleNewTag')}
      </span>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#222222] font-geologica mb-2">
        {t('home.styleSectionTitle')}
      </h2>
      <p className="text-gray-500 text-sm sm:text-base font-geologica max-w-md mx-auto mb-8 md:mb-10">
        {t('home.styleSectionSubtitle')}
      </p>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {STYLE_OPTIONS.map((opt) => {
          const isSelected = selectedStyle === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedStyle(opt.id)}
              className={`inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold font-geologica text-sm sm:text-base transition-all ${
                isSelected
                  ? 'bg-[#222222] text-white'
                  : 'bg-white text-[#222222] border border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                <span
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-200/80"
                  style={{ backgroundColor: opt.swatch1 }}
                />
                <span
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-200/80"
                  style={{ backgroundColor: opt.swatch2 }}
                />
              </span>
              <span>{t(`home.${opt.labelKey}`)}</span>
              {isSelected && <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </section>
  );
}
