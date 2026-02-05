'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Share2, Copy, Check, Link2 } from 'react-feather';
import { useLockBodyScroll } from '@/lib/useLockBodyScroll';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerCode: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  ownerCode,
}: ShareModalProps) {
  const { t } = useTranslation();
  useLockBodyScroll(isOpen);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/${ownerCode}`);
    }
  }, [isOpen, ownerCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl theme-gradient-bg text-white flex-shrink-0">
                <Share2 className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <h2 id="share-modal-title" className="text-xl font-bold text-[#222222] font-geologica">
                  {t('shareModal.title')}
                </h2>
                <p className="text-gray-500 text-sm font-geologica mt-0.5">
                  {t('shareModal.subtitle')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label={t('shareModal.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-4 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 font-geologica mb-2">
              <Link2 className="w-4 h-4 text-gray-500" />
              {t('shareModal.shareUrl')}
            </label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm font-geologica break-all select-all">
              {shareUrl}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            disabled={copied}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 border border-transparent theme-gradient-bg text-white rounded-xl font-semibold font-geologica hover:opacity-90 transition-all disabled:opacity-90"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                {t('shareModal.copied')}
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                {t('shareModal.copyLink')}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold font-geologica hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            {t('shareModal.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
