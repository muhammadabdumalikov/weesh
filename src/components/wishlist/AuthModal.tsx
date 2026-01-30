'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, User, Lock, Eye, EyeOff, Gift } from 'react-feather';
import type { AuthCredentials } from '@/lib/api/wishlist';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (credentials: AuthCredentials) => Promise<void>;
  onSignUp: (credentials: AuthCredentials) => Promise<void>;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
}: AuthModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-visible ${
        isClosing ? 'animate-out zoom-out-95 fade-out duration-200' : 'animate-in zoom-in-95 duration-300'
      }`}>
        {/* Close button - inside on mobile, outside on desktop */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 sm:-top-0 sm:-right-14 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 sm:bg-white sm:shadow-[0_8px_24px_rgba(15,23,42,0.18)] flex items-center justify-center text-gray-600 transition-colors hover:bg-gray-200 sm:hover:bg-gradient-to-r sm:hover:from-pink-500 sm:hover:via-red-500 sm:hover:to-orange-500 sm:hover:text-white z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 sm:pb-6 text-center">
          {/* Logo icon */}
          <div 
            className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #E6007A 0%, #FF6600 100%)',
            }}
          >
            <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-geologica mb-1 sm:mb-2">
            {t('auth.welcome')}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-geologica">
            {t('auth.subtitle')}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex mx-4 sm:mx-8 mb-4 sm:mb-6 p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all font-geologica ${
              mode === 'signin'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('auth.signIn')}
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all font-geologica ${
              mode === 'signup'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('auth.signUp')}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-8 pb-6 sm:pb-8 space-y-3 sm:space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800 font-geologica">
              {t('auth.username')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('auth.usernamePlaceholder')}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-geologica"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800 font-geologica">
              {t('auth.password')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-geologica"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
            className="w-full py-3 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:from-pink-600 hover:via-red-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-geologica"
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
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-geologica"
            >
              {mode === 'signin' ? t('auth.switchToSignUp') : t('auth.switchToSignIn')}{' '}
              <span className="font-semibold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

