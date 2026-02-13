'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme =
  | 'dark'
  | 'light'
  | 'dark-synth'
  | 'ms-access-2010'
  | 'cpt-legacy-dark'
  | 'cpt-legacy-light';

const THEME_ORDER: Theme[] = [
  'cpt-legacy-light',
  'cpt-legacy-dark',
  'dark',
  'light',
  'dark-synth',
  'ms-access-2010',
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

function parseStoredTheme(stored: string | null): Theme {
  const valid: Theme[] = [
    'dark',
    'light',
    'dark-synth',
    'ms-access-2010',
    'cpt-legacy-dark',
    'cpt-legacy-light',
  ];
  if (stored && valid.includes(stored as Theme)) {
    return stored as Theme;
  }
  return 'cpt-legacy-light';
}

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>('cpt-legacy-light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = parseStoredTheme(localStorage.getItem('cpt-theme'));
    setThemeState(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cpt-theme', theme);
  }, [theme, mounted]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
  };

  const cycleTheme = () => {
    const idx = THEME_ORDER.indexOf(theme);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    setThemeState(next);
  };

  const toggleTheme = () => {
    if (theme === 'cpt-legacy-light' || theme === 'light') {
      setThemeState('cpt-legacy-dark');
    } else {
      setThemeState('cpt-legacy-light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
