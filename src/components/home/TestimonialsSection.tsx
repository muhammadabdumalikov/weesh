'use client';

import { useTranslation } from 'react-i18next';
import TestimonialCard from '@/components/TestimonialCard';

export default function TestimonialsSection() {
  const { t } = useTranslation();

  return (
    <section className="mt-20 md:mt-28 lg:mt-36 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-geologica mb-2 text-balance max-w-2xl mx-auto theme-content-color">
        {t('home.testimonialsTitle')}
      </h2>
      <p className="text-sm sm:text-base font-geologica max-w-xl mx-auto mb-12 md:mb-16 theme-content-muted">
        {t('home.testimonialsSubtitle')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <TestimonialCard
            key={i}
            quote={t(`home.testimonial${i}Quote`)}
            name={t(`home.testimonial${i}Name`)}
          />
        ))}
      </div>
    </section>
  );
}
