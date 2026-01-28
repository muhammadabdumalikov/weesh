'use client';

import { useState, useEffect } from 'react';
import { Gift } from 'react-feather';
import GiftModal from '@/components/wishlist/GiftModal';
import WishlistModal from '@/components/wishlist/WishlistModal';
import AuthModal from '@/components/wishlist/AuthModal';
import Footer from '@/components/Footer';
import {
  fetchWishlistItems,
  createWishlistItem,
  isAuthenticated,
  signIn,
  signUp,
  getUsername,
  type WishlistItem,
  type CreateWishlistDto,
  type AuthCredentials,
} from '@/lib/api/wishlist';
import Header from '@/components/Header';
import CreateWishlistCard from '@/components/CreateWishlistCard';
import WishlistCard from '@/components/WishlistCard';
import GiftCard from '@/components/GiftCard';

// Sample gifts for demo
interface GiftItem {
  id: string;
  title: string;
  imageUrl?: string;
  productUrl?: string;
  price?: string;
  isReserved?: boolean;
}

// Sample wishlists for demo
interface Wishlist {
  id: string;
  title: string;
  itemCount: number;
  coverImage?: string;
  previewItems?: Array<{ imageUrl?: string; title: string }>;
}

// Translations
const translations = {
  en: {
    title: 'List of things which you can gift to me',
    description: 'Thanks for considering! Here are some items I\'d love to receive. Click on any product to view more details and purchase options.',
    viewProduct: 'View Product',
    footerNote: '💝 These are just suggestions! Any gift or even just your kind thoughts are greatly appreciated. Thank you for being so thoughtful!',
    addNew: 'Add New Item',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this item?',
    loading: 'Loading...',
    localItem: 'Local',
    apiItem: 'My Wishlist',
    share: 'Share',
    signIn: 'Sign In',
  },
  ru: {
    title: 'Список вещей, которые вы можете мне подарить',
    description: 'Спасибо, что рассмотрели! Вот некоторые предметы, которые мне бы хотелось получить. Нажмите на любой продукт, чтобы просмотреть подробности и варианты покупки.',
    viewProduct: 'Просмотр продукта',
    footerNote: '💝 Это всего лишь предложения! Любой подарок или даже просто ваши добрые мысли очень ценятся. Спасибо, что вы такие внимательные!',
    addNew: 'Добавить новый',
    edit: 'Редактировать',
    delete: 'Удалить',
    confirmDelete: 'Вы уверены, что хотите удалить этот элемент?',
    loading: 'Загрузка...',
    localItem: 'Локальный',
    apiItem: 'Мой список',
    share: 'Поделиться',
    signIn: 'Войти',
  },
  uz: {
    title: 'Menga sovg\'a qila oladigan narsalar ro\'yxati',
    description: 'Ko\'rib chiqganingiz uchun rahmat! Quyida menga juda yoqadigan ba\'zi narsalar. Batafsil ma\'lumot va xarid qilish variantlarini ko\'rish uchun har qanday mahsulotni bosing.',
    viewProduct: 'Mahsulotni ko\'rish',
    footerNote: '💝 Bu faqat takliflar! Har qanday sovg\'a yoki hatto faqat sizning mehribon fikrlaringiz juda qadrlanadi. Sizga minnatdorman!',
    addNew: 'Yangi qo\'shish',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    confirmDelete: 'Ushbu elementni o\'chirishga ishonchingiz komilmi?',
    loading: 'Yuklanmoqda...',
    localItem: 'Lokal',
    apiItem: 'Mening ro\'yxatim',
    share: 'Ulashish',
    signIn: 'Kirish',
  }
};

export default function WishlistPage() {
  const [currentLang, setCurrentLang] = useState<'en' | 'ru' | 'uz'>('ru');
  const [apiItems, setApiItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Gift modal state
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftModalMode, setGiftModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  
  // Wishlist modal state
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [wishlistModalMode, setWishlistModalMode] = useState<'create' | 'edit'>('create');
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
  
  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [username, setUsernameState] = useState<string>('');
  
  // Sample wishlists data
  const [wishlists, setWishlists] = useState<Wishlist[]>([
    {
      id: '1',
      title: 'На день рождения',
      itemCount: 5,
      coverImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80',
      previewItems: [
        { imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100', title: 'Watch' },
        { imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100', title: 'Headphones' },
      ],
    },
    {
      id: '2',
      title: 'Новый год 2026',
      itemCount: 12,
      previewItems: [
        { imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100', title: 'Shoes' },
        { imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100', title: 'Camera' },
        { title: 'Gift 3' },
        { title: 'Gift 4' },
      ],
    },
    {
      id: '3',
      title: 'Для дома',
      itemCount: 3,
      coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    },
    {
      id: '4',
      title: 'Для дома',
      itemCount: 3,
      coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    },
  ]);

  // Sample gifts data
  const [gifts, setGifts] = useState<GiftItem[]>([
    {
      id: 'gift-1',
      title: 'Apple Watch Series 9',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      productUrl: 'https://apple.com',
      price: '45 000 ₽',
      isReserved: false,
    },
    {
      id: 'gift-2',
      title: 'Sony WH-1000XM5 Наушники',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      productUrl: 'https://sony.com',
      price: '32 000 ₽',
      isReserved: true,
    },
    {
      id: 'gift-3',
      title: 'Nike Air Max 90',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      productUrl: 'https://nike.com',
      price: '15 000 ₽',
      isReserved: false,
    },
    {
      id: 'gift-4',
      title: 'Книга "Атомные привычки"',
      price: '800 ₽',
      isReserved: false,
    },
  ]);

  const t = translations[currentLang];

  // Check authentication on mount
  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsUserAuthenticated(authenticated);
    
    if (authenticated) {
      const storedUsername = getUsername();
      if (storedUsername) setUsernameState(storedUsername);
      loadApiItems();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Auth handlers
  const handleSignIn = async (credentials: AuthCredentials) => {
    await signIn(credentials);
    setIsUserAuthenticated(true);
    setUsernameState(credentials.login);
    loadApiItems();
  };

  const handleSignUp = async (credentials: AuthCredentials) => {
    await signUp(credentials);
    setIsUserAuthenticated(true);
    setUsernameState(credentials.login);
    loadApiItems();
  };

  const loadApiItems = async () => {
    if (!isAuthenticated()) {
      setApiItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const items = await fetchWishlistItems();
      setApiItems(items.map((item) => ({ ...item, source: 'api' as const })));
    } catch (error) {
      console.error('Failed to load API items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateItem = async (data: CreateWishlistDto) => {
    try {
      const newItem = await createWishlistItem(data);
      if (newItem) {
        setApiItems((prev) => [...prev, { ...newItem, source: 'api' }]);
      } else {
        console.error('Failed to create item: API returned null');
        alert('Failed to create item. Please try again.');
        throw new Error('Failed to create item');
      }
    } catch (error) {
      console.error('Error creating item:', error);
      alert(error instanceof Error ? error.message : 'Failed to create item. Please try again.');
      throw error; // Re-throw to prevent modal from closing
    }
  };

  // Open wishlist creation modal
  const openCreateWishlistModal = () => {
    setSelectedWishlist(null);
    setWishlistModalMode('create');
    setIsWishlistModalOpen(true);
  };

  // Handle wishlist creation
  const handleCreateWishlist = async (data: { title: string; coverImage?: string }) => {
    const newWishlist: Wishlist = {
      id: `wishlist-${Date.now()}`,
      title: data.title,
      itemCount: 0,
      coverImage: data.coverImage,
    };
    setWishlists((prev) => [...prev, newWishlist]);
    setIsWishlistModalOpen(false);
  };

  const [activeTab, setActiveTab] = useState<'create' | 'my' | 'shared' | 'ideas'>('my');

  // Open gift creation modal
  const openCreateGiftModal = () => {
    setSelectedItem(null);
    setGiftModalMode('create');
    setIsGiftModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Header 
        onSignInClick={() => setIsAuthModalOpen(true)}
        isAuthenticated={isUserAuthenticated}
        username={username}
      />
      <main className="px-4 sm:px-6 md:px-8 py-8 md:py-12 pt-24 md:pt-32 pb-16 md:pb-24 max-w-7xl mx-auto">
        {/* Tabs - Scrollable on mobile with fade hint */}
        <div className="relative mb-8 sm:mb-12 md:mb-16 lg:mb-24">
          {/* Scroll fade indicator on right */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#f7f7f7] to-transparent pointer-events-none z-10 sm:hidden" />
          
          <div className="flex gap-3 sm:gap-6 md:gap-10 lg:gap-16 overflow-x-auto py-3 sm:py-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            <button
              onClick={() => setActiveTab('create')}
              className={`font-geologica font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl transition-colors whitespace-nowrap flex-shrink-0 py-2 sm:py-1 ${
                activeTab === 'create'
                  ? 'text-black'
                  : 'text-gray-400 cursor-pointer active:text-gray-500'
              }`}
            >
              создать
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`font-geologica font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl transition-colors whitespace-nowrap flex-shrink-0 py-2 sm:py-1 ${
                activeTab === 'my'
                  ? 'text-black'
                  : 'text-gray-400 cursor-pointer active:text-gray-500'
              }`}
            >
              мои вишлисты
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`font-geologica font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl transition-colors whitespace-nowrap flex-shrink-0 py-2 sm:py-1 ${
                activeTab === 'shared'
                  ? 'text-black'
                  : 'text-gray-400 cursor-pointer active:text-gray-500'
              }`}
            >
              поделились
            </button>
            <button
              onClick={() => setActiveTab('ideas')}
              className={`font-geologica font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl transition-colors whitespace-nowrap flex-shrink-0 py-2 sm:py-1 ${
                activeTab === 'ideas'
                  ? 'text-black'
                  : 'text-gray-400 cursor-pointer active:text-gray-500'
              }`}
            >
              идеи
            </button>
          </div>
        </div>

        {/* Content for Active Tab */}
        {activeTab === 'create' && (
          <>
            {/* Create Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {/* Create Gift Card */}
              <CreateWishlistCard onClick={openCreateGiftModal} text='Создать подарок'/>
            </div>

            {/* Recent Gifts Section */}
            {gifts.length > 0 && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-geologica mb-4 sm:mb-6">
                  Мои подарки
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {gifts.map((gift) => (
                    <GiftCard
                      key={gift.id}
                      id={gift.id}
                      title={gift.title}
                      imageUrl={gift.imageUrl}
                      productUrl={gift.productUrl}
                      price={gift.price}
                      isReserved={gift.isReserved}
                      onClick={() => console.log('Open gift:', gift.id)}
                      onMenuClick={() => console.log('Menu for gift:', gift.id)}
                      onReserveClick={() => console.log('Reserve gift:', gift.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'my' && (
          <>
            {/* Wishlist Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* Create Wishlist Card */}
              <CreateWishlistCard onClick={openCreateWishlistModal} text='Создать вишлист'/>
              
              {/* Wishlist Cards */}
              {wishlists.map((wishlist) => (
                <WishlistCard
                  key={wishlist.id}
                  id={wishlist.id}
                  title={wishlist.title}
                  itemCount={wishlist.itemCount}
                  coverImage={wishlist.coverImage}
                  previewItems={wishlist.previewItems}
                  onClick={() => {
                    // Handle wishlist click - open details
                    console.log('Open wishlist:', wishlist.id);
                  }}
                  onMenuClick={() => {
                    // Handle menu click - show options
                    console.log('Menu for wishlist:', wishlist.id);
                  }}
                />
              ))}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-geologica">{t.loading}</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'shared' && (
          <>
            {/* Empty State for Shared */}
            <div className="flex flex-col items-center justify-center py-20">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(230, 0, 122, 0.1) 0%, rgba(255, 102, 0, 0.1) 100%)',
                }}
              >
                <Gift className="w-12 h-12 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-geologica mb-2">
                Пока пусто
              </h3>
              <p className="text-gray-500 font-geologica text-center max-w-md">
                Здесь будут вишлисты, которыми с вами поделились друзья
              </p>
            </div>
          </>
        )}

        {activeTab === 'ideas' && (
          <>
            {/* Ideas Grid with Create Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* Create Idea Card */}
              <CreateWishlistCard onClick={openCreateWishlistModal} text='Создать идею'/>
              
              {/* Sample idea cards */}
              <WishlistCard
                id="idea-1"
                title="Подарки для путешественников"
                itemCount={8}
                coverImage="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80"
                onClick={() => console.log('Open idea 1')}
              />
              <WishlistCard
                id="idea-2"
                title="Техника и гаджеты"
                itemCount={15}
                coverImage="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80"
                onClick={() => console.log('Open idea 2')}
              />
            </div>
          </>
        )}
      </main>
      <Footer />

      {/* Modals */}
      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => {
          setIsWishlistModalOpen(false);
          setSelectedWishlist(null);
        }}
        onSubmit={handleCreateWishlist}
        wishlist={selectedWishlist}
        mode={wishlistModalMode}
        currentLang={currentLang}
      />
      
      <GiftModal
        isOpen={isGiftModalOpen}
        onClose={() => {
          setIsGiftModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={async (data) => {
          try {
            await handleCreateItem(data as CreateWishlistDto);
            setIsGiftModalOpen(false);
            setSelectedItem(null);
          } catch (error) {
            // Error is already handled in handleCreateItem
            // Don't close modal on error so user can retry
          }
        }}
        item={selectedItem}
        mode={giftModalMode}
        currentLang={currentLang}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        currentLang={currentLang}
      />
    </div>
  );
}

