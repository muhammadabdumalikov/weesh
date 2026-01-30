'use client';

import { useTranslation } from 'react-i18next';
import { Gift, ExternalLink, Check, Edit2, Trash2 } from 'react-feather';

interface GiftCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  productUrl?: string;
  price?: string;
  isReserved?: boolean;
  isOwner?: boolean;
  /** Label for the product link (e.g. "Buy" or "View product"). Default: from i18n giftCard.buy */
  productLinkLabel?: string;
  /** Show "Подарить" / reserve button. Default: true. Set false on public wishlist. */
  showReserveButton?: boolean;
  onClick?: () => void;
  onMenuClick?: () => void;
  onReserveClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export default function GiftCard({
  id,
  title,
  imageUrl,
  productUrl,
  price,
  isReserved = false,
  isOwner = false,
  productLinkLabel,
  showReserveButton = true,
  onClick,
  onMenuClick,
  onReserveClick,
  onEditClick,
  onDeleteClick,
}: GiftCardProps) {
  const { t } = useTranslation();
  const linkLabel = productLinkLabel ?? t('giftCard.buy');

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick?.();
  };

  return (
    <div
      className="h-64 sm:h-72 md:h-80 w-full rounded-3xl sm:rounded-4xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-pink-200/50 hover:scale-[0.98] sm:hover:scale-95 cursor-pointer group overflow-hidden relative"
      onClick={onClick}
    >
      {/* Main card */}
      <div className="w-full h-full flex flex-col">
        {/* Image area */}
        <div className="relative h-32 sm:h-36 md:h-44 overflow-hidden bg-gray-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            /* Placeholder with gradient */
            <div className="w-full h-full bg-gradient-to-br from-pink-50 via-orange-50 to-pink-100 flex items-center justify-center">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(230, 0, 122, 0.15) 0%, rgba(255, 102, 0, 0.15) 100%)',
                }}
              >
                <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400" />
              </div>
            </div>
          )}
          
          {/* Reserved badge */}
          {isReserved && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-500 text-white text-[10px] sm:text-xs font-semibold font-geologica flex items-center gap-1">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Забронировано</span>
              <span className="sm:hidden">Занят</span>
            </div>
          )}
        </div>
        
        {/* Content area */}
        <div className="flex-1 min-w-0 p-3 sm:p-4 flex flex-col justify-between relative">
          {/* Title and price */}
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 font-geologica line-clamp-2 leading-tight mb-0.5 sm:mb-1">
              {title}
            </h3>
            {price && (
              <p className="text-base sm:text-lg font-bold font-geologica bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent truncate">
                {price}
              </p>
            )}
          </div>
          
          {/* Actions - owner: Edit/Delete; else: Buy + Reserve */}
          <div className="flex gap-2 min-h-0 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-200">
            {isOwner && (onEditClick || onDeleteClick) ? (
              <>
                {onEditClick && (
                  <button
                    onClick={handleEdit}
                    className="flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium font-geologica bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors overflow-hidden"
                  >
                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{t('giftCard.edit')}</span>
                  </button>
                )}
                {onDeleteClick && (
                  <button
                    onClick={handleDelete}
                    className="flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium font-geologica bg-red-50 hover:bg-red-100 text-red-600 transition-colors overflow-hidden"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{t('giftCard.delete')}</span>
                  </button>
                )}
              </>
            ) : (
              <>
                {productUrl && (
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors font-geologica min-w-0 overflow-hidden ${
                      showReserveButton
                        ? 'flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold shadow-sm hover:shadow-md'
                    }`}
                  >
                    {showReserveButton && <ExternalLink className="hidden sm:block w-3.5 h-3.5 flex-shrink-0" />}
                    <span className="truncate">{linkLabel}</span>
                  </a>
                )}
                {showReserveButton && !isReserved && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReserveClick?.();
                    }}
                    className="flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md font-geologica overflow-hidden"
                  >
                    <span className="truncate">{t('giftCard.reserve')}</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
