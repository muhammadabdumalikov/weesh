'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Gift, Heart, ArrowRight, Star } from 'react-feather';
import { fetchPublicWishlist, type WishlistItem } from '@/lib/api/wishlist';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const translations = {
  en: {
    title: 'Wishlist',
    description: 'Here are some things I’d love to receive. Click any item to view details and where to get it.',
    viewProduct: 'View product',
    footerNote: '💝 These are just ideas — any gift or kind thought means a lot. Thank you!',
    loading: 'Loading wishlist...',
    empty: 'No gifts yet',
    emptySubtitle: 'Nothing added to this list yet.',
    error: 'Couldn’t load wishlist',
    errorSubtitle: 'Check the link or try again later.',
    createYourOwn: 'Create your wishlist',
    createSubtitle: 'Build your list and share it with friends and family.',
  },
  ru: {
    title: 'Список желаний',
    description: 'Вот что мне бы хотелось получить. Нажмите на любой подарок, чтобы посмотреть подробности и где купить.',
    viewProduct: 'Смотреть товар',
    footerNote: '💝 Это лишь идеи — любой подарок или внимание очень ценны. Спасибо!',
    loading: 'Загружаем список...',
    empty: 'Подарков пока нет',
    emptySubtitle: 'В этот список ещё ничего не добавили.',
    error: 'Не удалось загрузить список',
    errorSubtitle: 'Проверьте ссылку или попробуйте позже.',
    createYourOwn: 'Создать свой вишлист',
    createSubtitle: 'Соберите свой список и поделитесь им с близкими.',
  },
  uz: {
    title: 'Istaklar ro\'yxati',
    description: 'Quyida menga yoqadigan narsalar. Batafsil va qayerdan olish mumkinligini ko\'rish uchun bosing.',
    viewProduct: 'Mahsulotni ko\'rish',
    footerNote: '💝 Bu faqat takliflar — har qanday sovg\'a yoki e\'tibor juda qadrli. Rahmat!',
    loading: 'Ro\'yxat yuklanmoqda...',
    empty: 'Hali sovg\'alar yo\'q',
    emptySubtitle: 'Bu ro\'yxatga hali hech narsa qo\'shilmagan.',
    error: 'Ro\'yxat yuklanmadi',
    errorSubtitle: 'Havolani tekshiring yoki keyinroq urinib ko\'ring.',
    createYourOwn: 'O\'z ro\'yxatingizni yarating',
    createSubtitle: 'Ro\'yxat yarating va yaqinlaringiz bilan ulashing.',
  },
};

function displayOwnerLabel(ownerId: string): string {
  if (!ownerId) return '';
  if (ownerId.length > 20 || ownerId.includes('-')) return ownerId;
  return `@${ownerId}`;
}

export default function PublicWishlistPage() {
  const params = useParams();
  const router = useRouter();
  const ownerId = params.ownerId as string;

  const [currentLang, setCurrentLang] = useState<'en' | 'ru' | 'uz'>('ru');
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);

  const t = translations[currentLang];

  useEffect(() => {
    setIsMounted(true);
    loadWishlist();
  }, [ownerId]);

  const loadWishlist = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await fetchPublicWishlist(ownerId);
      setItems(data);
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => new Set(prev).add(id));
  };

  const handleCreateOwn = () => {
    router.push('/wishlist');
  };

  const ownerLabel = displayOwnerLabel(ownerId);

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <Header />

      <main className="px-4 sm:px-6 md:px-8 py-8 md:py-12 pt-20 md:pt-24 pb-16 md:pb-24 max-w-6xl mx-auto">
        {/* Language selector */}
        <div className="flex justify-end mb-6">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-1 border border-gray-200/80 shadow-sm flex gap-0.5">
            {(['en', 'ru', 'uz'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setCurrentLang(lang)}
                className={`px-4 py-2 rounded-xl text-sm font-medium font-geologica transition-all ${
                  currentLang === lang
                    ? 'bg-gradient-to-r from-[#E6007A] to-[#FF6600] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Hero: whose wishlist */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-[#E6007A] to-[#FF6600] flex items-center justify-center shadow-lg">
              <Gift className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="font-moresugar text-2xl md:text-3xl bg-gradient-to-r from-[#E6007A] to-[#FF6600] bg-clip-text text-transparent">
              weesh
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#222222] font-geologica mb-2">
            {t.title}
            {ownerLabel && (
              <>
                {' — '}
                <span className="bg-gradient-to-r from-[#E6007A] to-[#FF6600] bg-clip-text text-transparent">
                  {ownerLabel}
                </span>
              </>
            )}
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto font-geologica">
            {t.description}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(230,0,122,0.1) 0%, rgba(255,102,0,0.1) 100%)',
              }}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#E6007A] border-t-transparent" />
            </div>
            <p className="text-gray-600 font-geologica">{t.loading}</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="max-w-md mx-auto text-center py-12 md:py-16">
            <div className="bg-white rounded-3xl p-8 md:p-10 border-2 border-red-100 shadow-sm">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(230,0,122,0.08) 0%, rgba(255,102,0,0.08) 100%)',
                }}
              >
                <Gift className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-[#222222] font-geologica mb-2">{t.error}</h2>
              <p className="text-gray-600 font-geologica mb-6">{t.errorSubtitle}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E6007A] to-[#FF6600] text-white rounded-2xl font-medium font-geologica hover:opacity-90 transition-opacity"
              >
                На главную
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && items.length === 0 && (
          <div className="max-w-md mx-auto text-center py-12 md:py-16">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-sm">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gray-50"
                style={{
                  background: 'linear-gradient(135deg, rgba(230,0,122,0.06) 0%, rgba(255,102,0,0.06) 100%)',
                }}
              >
                <Gift className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-[#222222] font-geologica mb-2">{t.empty}</h2>
              <p className="text-gray-600 font-geologica">{t.emptySubtitle}</p>
            </div>
          </div>
        )}

        {/* Gift grid */}
        {!isLoading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {items.map((product) => (
              <article
                key={product.id}
                className="group rounded-3xl sm:rounded-[1.75rem] bg-white shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:shadow-pink-200/30 hover:border-pink-100"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  {!isMounted || imageErrors.has(product.id) ? (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(230,0,122,0.06) 0%, rgba(255,102,0,0.08) 100%)',
                      }}
                    >
                      <Gift className="w-12 h-12 md:w-16 md:h-16 text-pink-300" />
                    </div>
                  ) : (
                    <img
                      src={product.imageurl}
                      alt={product.title}
                      onError={() => handleImageError(product.id)}
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                          handleImageError(product.id);
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-4 md:p-5 flex flex-col gap-3">
                  <h3 className="text-base md:text-lg font-bold text-[#222222] font-geologica line-clamp-2 min-h-[2.5rem]">
                    {product.title}
                  </h3>
                  <a
                    href={product.producturl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 md:py-3 px-4 rounded-xl font-medium text-sm md:text-base font-geologica bg-gradient-to-r from-[#E6007A] to-[#FF6600] text-white hover:opacity-90 transition-opacity shadow-md"
                  >
                    {t.viewProduct}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer note when there are items */}
        {!isLoading && !error && items.length > 0 && (
          <div className="mt-10 md:mt-12 text-center">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 md:p-6 border border-gray-200/80 shadow-sm max-w-2xl mx-auto">
              <p className="text-gray-600 text-sm font-geologica">{t.footerNote}</p>
            </div>
          </div>
        )}

        {/* CTA: Create your own wishlist */}
        <div className="mt-12 md:mt-16 max-w-2xl mx-auto">
          <div
            className="relative rounded-3xl p-8 md:p-10 overflow-hidden shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #E6007A 0%, #FF6600 100%)',
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            <div className="relative text-center text-white">
              <div className="flex justify-center gap-2 mb-3">
                <Star className="w-6 h-6 md:w-7 md:h-7" />
                <Heart className="w-6 h-6 md:w-7 md:h-7" />
                <Gift className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-geologica mb-2">
                {t.createYourOwn}
              </h2>
              <p className="text-white/90 text-sm md:text-base mb-6 font-geologica max-w-md mx-auto">
                {t.createSubtitle}
              </p>
              <div className="button-gradient-border">
                <button
                  onClick={handleCreateOwn}
                  className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-geologica font-medium text-[#222222] bg-white hover:bg-gray-50 transition-colors text-base md:text-lg w-full sm:w-auto"
                >
                  {t.createYourOwn}
                  <ArrowRight className="w-5 h-5" />
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
