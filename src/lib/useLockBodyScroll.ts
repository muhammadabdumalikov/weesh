'use client';

import { useEffect } from 'react';

/**
 * Locks body scroll when a modal is open. Restores previous overflow on close.
 * Use when open is true (e.g. isOpen for a modal).
 */
export function useLockBodyScroll(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, [open]);
}
