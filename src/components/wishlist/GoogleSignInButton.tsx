'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
            options: { theme?: string; size?: string; type?: string }
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

interface GoogleSignInButtonProps {
  clientId: string;
  onCredential: (idToken: string) => void | Promise<void>;
  disabled?: boolean;
  children: React.ReactNode;
}

/** Wraps a custom button and triggers Google Identity Services sign-in; calls onCredential with the JWT. */
export default function GoogleSignInButton({
  clientId,
  onCredential,
  disabled,
  children,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerReady, setContainerReady] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const buttonRenderedRef = useRef(false);
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
    if (!el) buttonRenderedRef.current = false;
  }, []);

  useEffect(() => {
    if (!clientId?.trim() || !scriptReady || !containerReady || !containerRef.current || !window.google) return;
    if (buttonRenderedRef.current) return;

    const container = containerRef.current;
    window.google.accounts.id.initialize({
      client_id: clientId.trim(),
      callback: (response) => {
        callbackRef.current(response.credential);
      },
    });
    try {
      window.google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
      });
      buttonRenderedRef.current = true;
    } catch (err) {
      console.error('[Google Sign-In] renderButton failed:', err);
    }
  }, [clientId, scriptReady, containerReady]);

  const tryClickGoogleButton = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    const btn =
      (container.querySelector('[role="button"]') as HTMLElement) ??
      (container.firstElementChild as HTMLElement);
    if (btn?.click) {
      btn.click();
      return true;
    }
    return false;
  }, []);

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (tryClickGoogleButton()) return;
    // Google injects the button async; retry once after a short delay
    window.setTimeout(() => tryClickGoogleButton(), 500);
  }, [disabled, tryClickGoogleButton]);

  return (
    <>
      {/* Google needs a sized container to render into; keep it off-screen and invisible */}
      <div
        ref={setRef}
        className="absolute -left-[9999px] top-0 w-[240px] h-[44px] overflow-hidden opacity-0 pointer-events-none"
        aria-hidden
      />
      <div onClick={handleClick} className="contents">
        {children}
      </div>
    </>
  );
}
