'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Image, Link2, MoreVertical } from 'react-feather';
import type { WishlistItem, CreateWishlistDto, UpdateWishlistDto } from '@/lib/api/wishlist';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWishlistDto | UpdateWishlistDto) => Promise<void>;
  item?: WishlistItem | null;
  mode: 'create' | 'edit';
  currentLang: 'en' | 'ru' | 'uz';
}

const modalTranslations = {
  en: {
    createTitle: 'Wishlist name',
    editTitle: 'Edit wishlist',
    titleLabel: 'Title',
    titlePlaceholder: 'Enter product title',
    imageUrlLabel: 'Image URL',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    productUrlLabel: 'Product URL',
    productUrlPlaceholder: 'https://example.com/product',
    cancel: 'Cancel',
    save: 'Save',
    create: 'Create',
    saving: 'Saving...',
  },
  ru: {
    createTitle: 'Название вишлиста',
    editTitle: 'Редактировать вишлист',
    titleLabel: 'Подарок',
    titlePlaceholder: 'Название подарка',
    imageUrlLabel: 'Ссылка на изображение',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    productUrlLabel: 'Где купить',
    productUrlPlaceholder: 'Название магазина или ссылка',
    cancel: 'Отмена',
    save: 'Сохранить',
    create: 'Создать',
    saving: 'Сохранение...',
  },
  uz: {
    createTitle: 'Yangi mahsulot qo\'shish',
    editTitle: 'Mahsulotni tahrirlash',
    titleLabel: 'Nomi',
    titlePlaceholder: 'Mahsulot nomini kiriting',
    imageUrlLabel: 'Rasm URL',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    productUrlLabel: 'Mahsulot URL',
    productUrlPlaceholder: 'https://example.com/product',
    cancel: 'Bekor qilish',
    save: 'Saqlash',
    create: 'Yaratish',
    saving: 'Saqlanmoqda...',
  },
};

export default function WishlistModal({
  isOpen,
  onClose,
  onSubmit,
  item,
  mode,
  currentLang,
}: WishlistModalProps) {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = modalTranslations[currentLang];

  useEffect(() => {
    if (isOpen) {
      if (item && mode === 'edit') {
        setTitle(item.title);
        setImageUrl(item.imageurl ?? '');
        setProductUrl(item.producturl ?? '');
      } else {
        setTitle('');
        setImageUrl('');
        setProductUrl('');
      }
    } else {
      // Reset form when modal closes
      setTitle('');
      setImageUrl('');
      setProductUrl('');
      setComment('');
      setIsSubmitting(false);
    }
  }, [item, mode, isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        imageurl: imageUrl,
        producturl: productUrl,
      });
      // Only close if submission was successful
      // The parent component will handle closing on success
    } catch (error) {
      console.error('Error submitting form:', error);
      // Don't close modal on error so user can fix and retry
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-visible animate-in zoom-in-95 duration-300">
        {/* Close button - inside on mobile, outside on desktop */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:-top-0 sm:-right-14 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-100 sm:bg-white sm:shadow-[0_8px_24px_rgba(15,23,42,0.18)] flex items-center justify-center text-gray-600 transition-colors hover:bg-gray-200 sm:hover:bg-gradient-to-r sm:hover:from-pink-500 sm:hover:via-red-500 sm:hover:to-orange-500 sm:hover:text-white z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 overflow-y-auto max-h-[85vh] sm:max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pr-8 sm:pr-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-geologica flex-1">
              {mode === 'create' ? t.createTitle : t.editTitle}
            </h2>
            <button
              type="button"
              className="shrink-0 rounded-full p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100/80 transition-colors hidden sm:block"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Main form grid */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] gap-6 sm:gap-8 items-start">
            {/* Left column */}
            <div className="space-y-5">
              {/* Gift title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-800 font-geologica"
                >
                  {t.titleLabel}
                  <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.titlePlaceholder}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-geologica"
                />
              </div>

              {/* Where to buy */}
              <div className="space-y-2">
                <label
                  htmlFor="productUrl"
                  className="block text-sm font-semibold text-gray-800 font-geologica"
                >
                  {t.productUrlLabel}
                </label>
                <input
                  type="url"
                  id="productUrl"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder={t.productUrlPlaceholder}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-geologica"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-semibold text-gray-800 font-geologica"
                >
                  {t.imageUrlLabel}
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder={t.imageUrlPlaceholder}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-geologica"
                />
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label
                  htmlFor="comment"
                  className="block text-sm font-semibold text-gray-800 font-geologica"
                >
                  {currentLang === 'ru'
                    ? 'Комментарий'
                    : currentLang === 'uz'
                      ? 'Izoh'
                      : 'Comment'}
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder={
                    currentLang === 'ru'
                      ? 'Комментарий...'
                      : currentLang === 'uz'
                        ? 'Izoh...'
                        : 'Comment...'
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none font-geologica"
                />
              </div>
            </div>

            {/* Right column: image box (shows preview inside when URL is set) */}
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="block text-sm font-semibold text-gray-800 font-geologica">
                  {currentLang === 'ru'
                    ? 'Изображение'
                    : currentLang === 'uz'
                      ? 'Rasm'
                      : 'Image'}
                </span>
                <div
                  className="rounded-[1.75rem] p-[2px]"
                  style={{
                    background:
                      'linear-gradient(135deg, #E6007A 0%, #FF6600 100%)',
                  }}
                >
                  <div className="h-64 w-full rounded-[1.5rem] overflow-hidden bg-white/0 text-center flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-white/80 px-4">
                        <Image className="w-8 h-8 mb-2 text-pink-500" />
                        <p className="text-sm font-medium text-gray-800 font-geologica">
                          {currentLang === 'ru'
                            ? 'Загрузите или перетащите изображение'
                            : currentLang === 'uz'
                              ? 'Rasmni yuklang yoki tortib keling'
                              : 'Upload or drag an image'}
                        </p>
                        <p className="mt-1 text-xs text-gray-400 font-geologica">
                          {currentLang === 'ru'
                            ? 'Сейчас используется ссылка на изображение'
                            : currentLang === 'uz'
                              ? 'Hozircha faqat rasm havolasi ishlatiladi'
                              : 'Currently uses image URL only'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-geologica"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white rounded-xl font-geologica font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-600 hover:via-red-600 hover:to-orange-600"
            >
              {isSubmitting ? t.saving : mode === 'create' ? t.create : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

