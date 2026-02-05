'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'weesh-style';
/** When user is not logged in, we always use default theme (logout + reload without login = classic). */
const OWNER_ID_KEY = 'w-o-id';

export type StyleId = 'classic' | 'pink' | 'warm' | 'ocean' | 'sage' | 'vintage' | 'bold' | 'citrus' | 'dark';

export interface ThemePalette {
  gradientStart: string;
  gradientEnd: string;
  pageBg: string;
  /** Text color on page background (headings, primary text) */
  contentColor: string;
  /** Muted text on page background (captions, secondary text) */
  contentMuted: string;
}

const PALETTES: Record<StyleId, ThemePalette> = {
  classic: { gradientStart: '#E6007A', gradientEnd: '#FF6600', pageBg: '#f7f7f7', contentColor: '#222222', contentMuted: '#6b7280' },
  pink: { gradientStart: '#db2777', gradientEnd: '#ec4899', pageBg: '#fdf2f8', contentColor: '#222222', contentMuted: '#6b7280' },
  warm: { gradientStart: '#b45309', gradientEnd: '#d97706', pageBg: '#fffbeb', contentColor: '#222222', contentMuted: '#6b7280' },
  ocean: { gradientStart: '#0e7490', gradientEnd: '#0891b2', pageBg: '#f0f9ff', contentColor: '#222222', contentMuted: '#6b7280' },
  sage: { gradientStart: '#4d7c0f', gradientEnd: '#65a30d', pageBg: '#f0fdf4', contentColor: '#222222', contentMuted: '#6b7280' },
  vintage: { gradientStart: '#7c3aed', gradientEnd: '#8b5cf6', pageBg: '#faf5ff', contentColor: '#222222', contentMuted: '#6b7280' },
  bold: { gradientStart: '#dc2626', gradientEnd: '#e6007a', pageBg: '#fef2f2', contentColor: '#222222', contentMuted: '#6b7280' },
  citrus: { gradientStart: '#ea580c', gradientEnd: '#f97316', pageBg: '#fff7ed', contentColor: '#222222', contentMuted: '#6b7280' },
  dark: { gradientStart: '#a78bfa', gradientEnd: '#f472b6', pageBg: '#1a1a1a', contentColor: '#f5f5f5', contentMuted: '#9ca3af' },
};

function getStoredStyle(): StyleId {
  if (typeof window === 'undefined') return 'classic';
  if (!localStorage.getItem(OWNER_ID_KEY)) return 'classic';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in PALETTES) return stored as StyleId;
  return 'classic';
}

function applyPalette(palette: ThemePalette) {
  const root = document.documentElement;
  root.style.setProperty('--theme-gradient-start', palette.gradientStart);
  root.style.setProperty('--theme-gradient-end', palette.gradientEnd);
  root.style.setProperty('--theme-page-bg', palette.pageBg);
  root.style.setProperty('--theme-content-color', palette.contentColor);
  root.style.setProperty('--theme-content-muted', palette.contentMuted);
}

interface ThemeContextValue {
  style: StyleId;
  setStyle: (id: StyleId) => void;
  palette: ThemePalette;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyleState] = useState<StyleId>('classic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStyleState(getStoredStyle());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const palette = PALETTES[style];
    applyPalette(palette);
    localStorage.setItem(STORAGE_KEY, style);
  }, [style, mounted]);

  const setStyle = useCallback((id: StyleId) => {
    setStyleState(id);
  }, []);

  const palette = PALETTES[style];

  return (
    <ThemeContext.Provider value={{ style, setStyle, palette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export { PALETTES };
