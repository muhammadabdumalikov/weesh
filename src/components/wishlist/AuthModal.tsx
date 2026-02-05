'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, User, Lock, Eye, EyeOff, Gift } from 'react-feather';
import type { AuthCredentials } from '@/lib/api/wishlist';
import GoogleSignInButton from './GoogleSignInButton';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (credentials: AuthCredentials) => Promise<void>;
  onSignUp: (credentials: AuthCredentials) => Promise<void>;
  /** When both clientId and onGoogleSignIn are set, the "Continue with Google" button is shown. */
  googleClientId?: string;
  onGoogleSignIn?: (idToken: string) => Promise<void>;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function AuthModal({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
  googleClientId,
  onGoogleSignIn,
}: AuthModalProps) {
  const showGoogle = Boolean(googleClientId && onGoogleSignIn);
  const { t } = useTranslation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setPassword('');
      setError(null);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const credentials = { login: username, password };
      if (mode === 'signin') {
        await onSignIn(credentials);
      } else {
        await onSignUp(credentials);
      }
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.errorGeneric'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
  };

  const handleGoogleCredential = async (idToken: string) => {
    if (!onGoogleSignIn) return;
    setError(null);
    setIsGoogleLoading(true);
    try {
      await onGoogleSignIn(idToken);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.errorGeneric'));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />
      
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className={`relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-md overflow-visible shadow-2xl ${
          isClosing ? 'animate-out zoom-out-95 fade-out duration-200' : 'animate-in zoom-in-95 duration-300'
        }`}
      >
        {/* Close button - inside on mobile, outside on desktop */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 sm:-top-0 sm:-right-14 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 sm:bg-white flex items-center justify-center text-gray-600 transition-colors hover:bg-gray-200 sm:hover:opacity-90 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 sm:[.theme-gradient-bg]:hover:bg-none"
          style={{ ['--tw-gradient-stretch' as string]: undefined }}
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 sm:pb-6 text-center">
          {/* Logo icon */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center theme-gradient-bg">
            <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          
          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold text-gray-900 font-geologica mb-1 sm:mb-2">
            {t('auth.welcome')}
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm font-geologica">
            {t('auth.subtitle')}
          </p>
        </div>

        {/* Google sign-in + Form */}
        <div className="px-4 sm:px-8 pb-6 sm:pb-8 space-y-4">
          {showGoogle && (
            <>
              <GoogleSignInButton
                clientId={googleClientId!}
                onCredential={handleGoogleCredential}
                disabled={isGoogleLoading}
              >
                <button
                  type="button"
                  disabled={isGoogleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-300 bg-white text-[#222222] font-semibold font-geologica text-sm hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <GoogleIcon className="w-5 h-5 flex-shrink-0" />
                  {isGoogleLoading ? t('auth.signingIn') : t('auth.continueWithGoogle')}
                </button>
              </GoogleSignInButton>
              <div className="flex items-center w-full mt-6">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="shrink-0 px-4 text-sm font-medium text-gray-500 font-geologica">{t('auth.or')}</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
            </>
          )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="auth-username" className="block text-sm font-semibold text-gray-900 font-geologica">
              {t('auth.username')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <User className="w-5 h-5" />
              </div>
              <input
                id="auth-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('auth.usernamePlaceholder')}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl theme-input-focus transition-all text-gray-900 placeholder:text-gray-500 font-geologica"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="auth-password" className="block text-sm font-semibold text-gray-900 font-geologica">
              {t('auth.password')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl theme-input-focus transition-all text-gray-900 placeholder:text-gray-500 font-geologica"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 rounded-lg p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-geologica">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 border border-transparent theme-gradient-bg text-white font-semibold rounded-xl hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--theme-gradient-start)] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-geologica"
          >
            {isSubmitting
              ? mode === 'signin'
                ? t('auth.signingIn')
                : t('auth.creatingAccount')
              : mode === 'signin'
                ? t('auth.signInButton')
                : t('auth.signUpButton')}
          </button>

          {/* Switch Mode */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors font-geologica focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--theme-gradient-start)] rounded-lg px-1 py-0.5 cursor-pointer"
            >
              {mode === 'signin' ? t('auth.switchToSignUp') : t('auth.switchToSignIn')}{' '}
              <span className="font-semibold theme-gradient-text">
                {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
              </span>
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}

