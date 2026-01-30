'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Image, MoreVertical } from 'react-feather';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; coverImage?: string }) => Promise<void>;
  wishlist?: { id: string; title: string; coverImage?: string } | null;
  mode: 'create' | 'edit';
}

export default function WishlistModal({
  isOpen,
  onClose,
  onSubmit,
  wishlist,
  mode,
}: WishlistModalProps) {
  const { t } = useTranslation();
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (wishlist && mode === 'edit') {
        setName(wishlist.title);
        setCoverImage(wishlist.coverImage ?? '');
      } else {
        setName('');
        setCoverImage('');
      }
    } else {
      setName('');
      setCoverImage('');
      setIsSubmitting(false);
      setIsClosing(false);
    }
  }, [wishlist, mode, isOpen]);

  // Focus name input when modal opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);

    try {
      await onSubmit({
        title: name.trim(),
        coverImage: coverImage.trim() || undefined,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-visible ${
        isClosing ? 'animate-out zoom-out-95 fade-out duration-200' : 'animate-in zoom-in-95 duration-300'
      }`}>
        {/* Close button - inside on mobile, outside on desktop */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 sm:-top-0 sm:-right-14 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 sm:bg-white sm:shadow-[0_8px_24px_rgba(15,23,42,0.18)] flex items-center justify-center text-gray-600 transition-colors hover:bg-gray-200 theme-close-btn-hover z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pr-8 sm:pr-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-geologica">
              {mode === 'create' ? t('wishlistModal.createTitle') : t('wishlistModal.editTitle')}
            </h2>
            <button
              type="button"
              className="rounded-full p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100/80 transition-colors hidden sm:block"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Wishlist Name */}
          <div className="space-y-2">
            <label
              htmlFor="wishlistName"
              className="block text-sm font-semibold text-gray-800 font-geologica"
            >
              {t('wishlistModal.nameLabel')}
              <span className="theme-icon-color">*</span>
            </label>
            <input
              ref={nameInputRef}
              type="text"
              id="wishlistName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('wishlistModal.namePlaceholder')}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl theme-input-focus transition-all text-gray-900 placeholder:text-gray-400 font-geologica"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label
              htmlFor="coverImage"
              className="block text-sm font-semibold text-gray-800 font-geologica"
            >
              {t('wishlistModal.coverLabel')}
            </label>
            
            {/* Image preview or placeholder */}
            <div
              className="rounded-2xl p-[2px] mb-3"
              style={{
                background: coverImage 
                  ? 'transparent' 
                  : 'linear-gradient(135deg, var(--theme-gradient-start) 0%, var(--theme-gradient-end) 100%)',
              }}
            >
              <div className="h-40 w-full rounded-[14px] overflow-hidden bg-gray-50 flex items-center justify-center">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center px-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 theme-placeholder-bg-strong">
                      <Image className="w-7 h-7 theme-icon-color" />
                    </div>
                    <p className="text-sm text-gray-500 font-geologica">
                      {t('wishlistModal.coverHint')}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <input
              type="url"
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder={t('wishlistModal.coverPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl theme-input-focus transition-all text-gray-900 placeholder:text-gray-400 font-geologica text-sm"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-geologica"
            >
              {t('wishlistModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 px-6 py-3 border border-transparent theme-gradient-bg text-white rounded-xl font-geologica font-semibold shadow-lg hover:shadow-xl hover:opacity-90 hover:border-[var(--theme-gradient-start)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('wishlistModal.saving') : mode === 'create' ? t('wishlistModal.create') : t('wishlistModal.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
