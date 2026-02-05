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
  const callbackRef = useRef(onCredential);

  callbackRef.current = onCredential;

  useEffect(() => {
    if (!clientId) return;
    loadScript(GSI_SCRIPT_URL)
      .then(() => setScriptReady(true))
      .catch(console.error);
  }, [clientId]);

  const setRef = useCallback((el: HTMLDivElement | null) => {
    containerRef.current = el;
    setContainerReady(!!el);
  }, []);

  useEffect(() => {
    if (!clientId || !scriptReady || !containerReady || !containerRef.current || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        callbackRef.current(response.credential);
      },
    });
    window.google.accounts.id.renderButton(containerRef.current, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
    });
  }, [clientId, scriptReady, containerReady]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    const btn = containerRef.current?.firstElementChild;
    if (btn && typeof (btn as HTMLElement).click === 'function') {
      (btn as HTMLElement).click();
    }
  }, [disabled]);

  return (
    <>
      <div
        ref={setRef}
        className="absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
        aria-hidden
      />
      <div onClick={handleClick} className="contents">
        {children}
      </div>
    </>
  );
}
