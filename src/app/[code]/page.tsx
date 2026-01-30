'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Gift, Heart, ArrowRight, Star } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { fetchPublicWishlist, type WishlistItem } from '@/lib/api/wishlist';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GiftCard from '@/components/GiftCard';

function displayOwnerLabel(code: string): string {
  if (!code) return '';
  if (code.length > 20 || code.includes('-')) return code;
  return `@${code}`;
}

export default function PublicWishlistByCodePage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const { t } = useTranslation();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (code) loadWishlist();
  }, [code]);

  const loadWishlist = async () => {
    if (!code) return;
    setIsLoading(true);
    setError(false);
    try {
      const data = await fetchPublicWishlist(code);
      setItems(data);
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOwn = () => {
    router.push('/wishlist');
  };

  const ownerLabel = displayOwnerLabel(code);

  return (
    <div className="min-h-screen bg-[var(--theme-page-bg)]">
      <Header />

      <main className="px-3 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 pt-[4.5rem] sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-24 max-w-6xl mx-auto">
        {/* Hero: whose wishlist */}
        <div className="text-center mb-8 sm:mb-10 md:mb-14 px-1">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-[#222222] font-geologica mb-1.5 sm:mb-2 px-1 break-words leading-tight">
            {t('publicWishlist.title')}
            {ownerLabel && (
              <>
                {' — '}
                <span className="theme-gradient-text">
                  {ownerLabel}
                </span>
              </>
            )}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-geologica px-2">
            {t('publicWishlist.description')}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-24">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 theme-placeholder-bg-strong">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-t-transparent" style={{ borderColor: 'var(--theme-gradient-start)' }} />
            </div>
            <p className="text-gray-600 font-geologica text-sm sm:text-base">{t('publicWishlist.loading')}</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="max-w-md mx-auto text-center py-8 sm:py-12 md:py-16 px-2">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-red-100 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 theme-placeholder-bg-strong">
                <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#222222] font-geologica mb-1.5 sm:mb-2">{t('publicWishlist.error')}</h2>
              <p className="text-gray-600 font-geologica text-sm sm:text-base mb-5 sm:mb-6">{t('publicWishlist.errorSubtitle')}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 theme-gradient-bg text-white rounded-xl sm:rounded-2xl font-medium font-geologica hover:opacity-90 active:opacity-95 transition-opacity text-sm sm:text-base touch-manipulation"
              >
                {t('publicWishlist.backHome')}
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </Link>
            </div>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && items.length === 0 && (
          <div className="max-w-md mx-auto text-center py-8 sm:py-12 md:py-16 px-2">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 theme-placeholder-bg">
                <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#222222] font-geologica mb-1.5 sm:mb-2">{t('publicWishlist.empty')}</h2>
              <p className="text-gray-600 font-geologica text-sm sm:text-base">{t('publicWishlist.emptySubtitle')}</p>
            </div>
          </div>
        )}

        {/* Gift grid */}
        {!isLoading && !error && items.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product) => (
              <GiftCard
                key={product.id}
                id={product.id}
                title={product.title}
                imageUrl={product.imageurl || undefined}
                productUrl={product.producturl || undefined}
                isOwner={false}
                showReserveButton={false}
                productLinkLabel={t('publicWishlist.viewProduct')}
                isReserved={false}
              />
            ))}
          </div>
        )}

        {/* Footer note when there are items */}
        {!isLoading && !error && items.length > 0 && (
          <div className="mt-8 sm:mt-10 md:mt-12 text-center px-1">
            <div className="bg-white/80 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200/80 shadow-sm max-w-2xl mx-auto">
              <p className="text-gray-600 text-xs sm:text-sm font-geologica">{t('publicWishlist.footerNote')}</p>
            </div>
          </div>
        )}

        {/* CTA: Create your own wishlist */}
        <div className="mt-8 sm:mt-12 md:mt-16 max-w-2xl mx-auto px-1">
          <div
            className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden shadow-xl theme-gradient-bg"
            style={{
              background: 'linear-gradient(135deg, var(--theme-gradient-start) 0%, var(--theme-gradient-end) 100%)',
            }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
            <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12" />
            <div className="relative text-center text-white">
              <div className="flex justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-geologica mb-1.5 sm:mb-2">
                {t('publicWishlist.createYourOwn')}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 font-geologica max-w-md mx-auto px-1">
                {t('publicWishlist.createSubtitle')}
              </p>
              <div className="button-gradient-border">
                <button
                  type="button"
                  onClick={handleCreateOwn}
                  className="flex items-center justify-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-geologica font-medium text-[#222222] bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base md:text-lg w-full sm:w-auto min-h-[44px] touch-manipulation"
                >
                  {t('publicWishlist.createYourOwn')}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
