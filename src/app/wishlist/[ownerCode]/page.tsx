'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Redirect /wishlist/{code} to /{code} so share URLs work at root */
export default function WishlistOwnerCodeRedirect() {
  const params = useParams();
  const router = useRouter();
  const ownerCode = params.ownerCode as string;

  useEffect(() => {
    if (ownerCode) router.replace(`/${ownerCode}`);
  }, [ownerCode, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--theme-page-bg)]">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent" style={{ borderColor: 'var(--theme-gradient-start)' }} />
    </div>
  );
}
