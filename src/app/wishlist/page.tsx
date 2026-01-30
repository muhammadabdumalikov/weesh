'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Gift, Trash2, X } from 'react-feather';
import GiftModal from '@/components/wishlist/GiftModal';
import WishlistModal from '@/components/wishlist/WishlistModal';
import AuthModal from '@/components/wishlist/AuthModal';
import Footer from '@/components/Footer';
import {
  fetchWishlistItems,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  isAuthenticated,
  signIn,
  signUp,
  signOut,
  getUsername,
  type WishlistItem,
  type CreateWishlistDto,
  type UpdateWishlistDto,
  type AuthCredentials,
} from '@/lib/api/wishlist';
import Header from '@/components/Header';
import CreateWishlistCard from '@/components/CreateWishlistCard';
import WishlistCard from '@/components/WishlistCard';
import GiftCard from '@/components/GiftCard';

// Sample wishlists for demo
interface Wishlist {
  id: string;
  title: string;
  itemCount: number;
  coverImage?: string;
  previewItems?: Array<{ imageUrl?: string; title: string }>;
}

export default function WishlistPage() {
  const { t } = useTranslation();
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

  // Delete confirmation (page-level modal)
  const [itemToDelete, setItemToDelete] = useState<WishlistItem | null>(null);
  
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

  const [activeTab, setActiveTab] = useState<'create' | 'my' | 'shared' | 'ideas'>('create');

  // Open gift creation modal
  const openCreateGiftModal = () => {
    setSelectedItem(null);
    setGiftModalMode('create');
    setIsGiftModalOpen(true);
  };

  // Open gift edit modal
  const openEditGiftModal = (item: WishlistItem) => {
    setSelectedItem(item);
    setGiftModalMode('edit');
    setIsGiftModalOpen(true);
  };

  // Update gift (edit)
  const handleUpdateItem = async (data: UpdateWishlistDto) => {
    if (!selectedItem) return;
    try {
      const updated = await updateWishlistItem(selectedItem.id, data);
      if (updated) {
        setApiItems((prev) =>
          prev.map((i) => (i.id === selectedItem.id ? { ...updated, source: 'api' as const } : i))
        );
        setIsGiftModalOpen(false);
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert(error instanceof Error ? error.message : 'Не удалось обновить. Попробуйте снова.');
      throw error;
    }
  };

  // Request delete: open page-level confirmation modal (and close edit modal if open)
  const openDeleteConfirm = (item: WishlistItem) => {
    setIsGiftModalOpen(false);
    setItemToDelete(item);
  };

  // Delete gift (called after user confirms in delete modal)
  const handleDeleteGift = async (id: string) => {
    try {
      const ok = await deleteWishlistItem(id);
      if (ok) {
        setApiItems((prev) => prev.filter((i) => i.id !== id));
        setItemToDelete(null);
      } else {
        alert('Не удалось удалить. Попробуйте снова.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(error instanceof Error ? error.message : t('wishlistPage.confirmDelete'));
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Header
        onSignInClick={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          signOut();
          setIsUserAuthenticated(false);
          setUsernameState('');
        }}
        isAuthenticated={isUserAuthenticated}
        username={username}
      />
      <main className="px-4 sm:px-6 md:px-8 py-8 md:py-12 pt-24 md:pt-32 pb-16 md:pb-24 max-w-7xl mx-auto">
        {/* Tabs - Scrollable on mobile; fade hint on desktop */}
        <div className="relative mb-8 sm:mb-12 md:mb-16 lg:mb-24">
          {/* Left-side fade to hint horizontal scroll (desktop only) */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f7f7f7] to-transparent pointer-events-none z-10 hidden sm:block" />
          {/* Right-side fade to hint horizontal scroll (desktop only) */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f7f7f7] to-transparent pointer-events-none z-10 hidden sm:block" />
          <div className="flex gap-3 sm:gap-6 md:gap-10 lg:gap-16 overflow-x-auto py-3 sm:py-0 -mx-4 px-6 sm:px-8 sm:mx-0 scrollbar-hide">
            <button
              onClick={() => setActiveTab('create')}
              className={`font-geologica font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl transition-colors whitespace-nowrap flex-shrink-0 py-2 sm:py-1 ${
                activeTab === 'create'
                  ? 'text-black'
                  : 'text-gray-400 cursor-pointer active:text-gray-500'
              }`}
            >
              {t('wishlistPage.tabCreate')}
            </button>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="relative font-geologica font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl transition-colors whitespace-nowrap flex-shrink-0 py-2 sm:py-1 text-gray-300 cursor-not-allowed"
            >
              {t('wishlistPage.tabMy')}
              <span className="absolute -top-0.5 right-0 sm:top-0 sm:-right-1 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-400 font-geologica whitespace-nowrap">
                {t('wishlistPage.soon')}
              </span>
            </button>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="relative font-geologica font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl transition-colors whitespace-nowrap flex-shrink-0 py-2 sm:py-1 text-gray-300 cursor-not-allowed"
            >
              {t('wishlistPage.tabShared')}
              <span className="absolute -top-0.5 right-0 sm:top-0 sm:-right-1 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-400 font-geologica whitespace-nowrap">
                {t('wishlistPage.soon')}
              </span>
            </button>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="relative font-geologica font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl transition-colors whitespace-nowrap flex-shrink-0 py-2 sm:py-1 text-gray-300 cursor-not-allowed"
            >
              {t('wishlistPage.tabIdeas')}
              <span className="absolute -top-0.5 right-0 sm:top-0 sm:-right-1 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-400 font-geologica whitespace-nowrap">
                {t('wishlistPage.soon')}
              </span>
            </button>
          </div>
        </div>

        {/* Content for Active Tab */}
        {activeTab === 'create' && (
          <>
            {/* Create Options */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <CreateWishlistCard onClick={openCreateGiftModal} text={t('wishlistPage.createGift')} />
            </div>

            {/* Мои подарки - from API */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-geologica mb-4 sm:mb-6">
              {t('wishlistPage.myGifts')}
            </h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent"></div>
                <p className="mt-3 text-gray-500 text-sm font-geologica">{t('wishlistPage.loading')}</p>
              </div>
            ) : !isUserAuthenticated ? (
              <p className="text-gray-500 font-geologica py-4">
                {t('wishlistPage.signInToSeeGifts')}
              </p>
            ) : apiItems.length === 0 ? (
              <p className="text-gray-500 font-geologica py-4">
                {t('wishlistPage.noGiftsYet')}
              </p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {apiItems.map((item) => (
                  <GiftCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    imageUrl={item.imageurl || undefined}
                    productUrl={item.producturl || undefined}
                    isOwner={isUserAuthenticated}
                    onEditClick={() => openEditGiftModal(item)}
                    onDeleteClick={() => openDeleteConfirm(item)}
                    onClick={() => console.log('Open gift:', item.id)}
                    onReserveClick={() => console.log('Reserve gift:', item.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'my' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <CreateWishlistCard onClick={openCreateWishlistModal} text={t('wishlistPage.createWishlist')} />
              {wishlists.map((wishlist) => (
                <WishlistCard
                  key={wishlist.id}
                  id={wishlist.id}
                  title={wishlist.title}
                  itemCount={wishlist.itemCount}
                  coverImage={wishlist.coverImage}
                  previewItems={wishlist.previewItems}
                  onClick={() => console.log('Open wishlist:', wishlist.id)}
                  onMenuClick={() => console.log('Menu for wishlist:', wishlist.id)}
                />
              ))}
            </div>
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
                {t('wishlistPage.sharedEmptyTitle')}
              </h3>
              <p className="text-gray-500 font-geologica text-center max-w-md">
                {t('wishlistPage.sharedEmptySubtitle')}
              </p>
            </div>
          </>
        )}

        {activeTab === 'ideas' && (
          <>
            {/* Ideas Grid with Create Card */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* Create Idea Card */}
              <CreateWishlistCard onClick={openCreateWishlistModal} text={t('wishlistPage.createIdea')}/>
              
              {/* Sample idea cards */}
              <WishlistCard
                id="idea-1"
                title={t('wishlistPage.ideasTravel')}
                itemCount={8}
                coverImage="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80"
                onClick={() => console.log('Open idea 1')}
              />
              <WishlistCard
                id="idea-2"
                title={t('wishlistPage.ideasTech')}
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
      />
      
      <GiftModal
        isOpen={isGiftModalOpen}
        onClose={() => {
          setIsGiftModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={async (data) => {
          try {
            if (selectedItem && giftModalMode === 'edit') {
              await handleUpdateItem(data as UpdateWishlistDto);
            } else {
              await handleCreateItem(data as CreateWishlistDto);
              setIsGiftModalOpen(false);
              setSelectedItem(null);
            }
          } catch (error) {
            // Error is already handled in handlers
          }
        }}
        item={selectedItem}
        mode={giftModalMode}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />

      {/* Delete confirmation modal (page-level) */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setItemToDelete(null)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setItemToDelete(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label={t('shareModal.close')}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <h2 id="delete-confirm-title" className="text-lg font-bold text-gray-900 font-geologica pr-8">
                {t('giftCard.delete')}
              </h2>
            </div>
            <p className="text-gray-600 text-sm font-geologica mb-6">
              {t('wishlistPage.confirmDelete')}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold font-geologica hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                {t('wishlistModal.cancel')}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteGift(itemToDelete.id)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-transparent bg-rose-600 text-white font-semibold font-geologica hover:bg-rose-700 hover:border-rose-500 transition-colors"
              >
                {t('giftCard.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

