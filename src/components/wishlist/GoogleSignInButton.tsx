'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const GSI_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; type?: string; width?: number }
          ) => void;
        };
      };
    };
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Document not available'));
      return;
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

interface GoogleSignInButtonProps {
  clientId: string;
  onCredential: (idToken: string) => void | Promise<void>;
  disabled?: boolean;
  children: React.ReactNode;
}

/**
 * Renders Google sign-in with your design: custom-styled overlay (pointer-events-none)
 * over Google's button so clicks hit the real button and styling matches the rest of the modal.
 */
export default function GoogleSignInButton({
  clientId,
  onCredential,
  disabled,
  children,
}: GoogleSignInButtonProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [containerReady, setContainerReady] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [buttonWidth, setButtonWidth] = useState(320);
  const renderedRef = useRef(false);
  const callbackRef = useRef(onCredential);

  callbackRef.current = onCredential;

  useEffect(() => {
    if (!clientId?.trim()) return;
    loadScript(GSI_SCRIPT_URL)
      .then(() => setScriptReady(true))
      .catch((err) => console.error('[Google Sign-In] Script load failed:', err));
  }, [clientId]);

  const setRef = useCallback((el: HTMLDivElement | null) => {
    containerRef.current = el;
    setContainerReady(!!el);
    if (!el) renderedRef.current = false;
  }, []);

  const setWrapperRef = useCallback((el: HTMLDivElement | null) => {
    wrapperRef.current = el;
    if (el && el.offsetWidth > 0) setButtonWidth(el.offsetWidth);
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const ro = new ResizeObserver(() => {
      if (el.offsetWidth > 0) setButtonWidth(el.offsetWidth);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerReady]);

  useEffect(() => {
    if (!clientId?.trim() || !scriptReady || !containerReady || !containerRef.current || !window.google) return;
    if (renderedRef.current || disabled) return;

    const container = containerRef.current;
    const width = wrapperRef.current?.offsetWidth ?? 320;
    window.google.accounts.id.initialize({
      client_id: clientId.trim(),
      callback: (response: { credential: string }) => {
        callbackRef.current(response.credential);
      },
    });
    try {
      window.google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        width: Math.max(200, width),
      });
      renderedRef.current = true;
    } catch (err) {
      console.error('[Google Sign-In] renderButton failed:', err);
    }
  }, [clientId, scriptReady, containerReady, disabled, buttonWidth]);

  if (disabled) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div
      ref={setWrapperRef}
      className="relative w-full min-h-[44px] rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden"
    >
      {/* Google's button lives here; clicks go to the iframe */}
      <div ref={setRef} className="absolute inset-0 min-h-[44px] [&>div]:!w-full [&>iframe]:!w-full" />
      {/* Your design on top; solid bg so only our label shows (no Google iframe text); pointer-events-none so clicks pass through */}
      <div
        className="absolute inset-0 flex items-center justify-center gap-3 py-3 px-4 pointer-events-none text-[#222222] font-semibold font-geologica text-sm bg-white rounded-xl"
        aria-hidden
      >
        <GoogleIcon className="w-5 h-5 flex-shrink-0" />
        <span>{t('auth.continueWithGoogle')}</span>
      </div>
    </div>
  );
}
