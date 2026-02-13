'use client';

import { Dropdown } from 'primereact/dropdown';
import { useTheme } from '@/providers/ThemeProvider';
import type { Theme } from '@/providers/ThemeProvider';
import { memo, useMemo } from 'react';

const THEME_LABELS: Record<Theme, string> = {
  'cpt-legacy-light': 'CPT Legacy Light',
  'cpt-legacy-dark': 'CPT Legacy Dark',
  dark: 'Dark',
  light: 'Light',
  'dark-synth': 'Dark Synth',
  'ms-access-2010': 'MS Access 2010',
};

const THEME_ORDER: Theme[] = [
  'cpt-legacy-light',
  'cpt-legacy-dark',
  'dark',
  'light',
  'dark-synth',
  'ms-access-2010',
];

interface HeaderThemeToggleProps {
  variant?: 'desktop' | 'mobile';
  onToggle?: () => void;
}

export const HeaderThemeToggle = memo(({ variant = 'desktop', onToggle }: HeaderThemeToggleProps) => {
  const { theme, setTheme } = useTheme();

  const options = useMemo(
    () => THEME_ORDER.map((value) => ({ label: THEME_LABELS[value], value })),
    []
  );

  const handleChange = (value: Theme) => {
    setTheme(value);
    onToggle?.();
  };

  const isMobile = variant === 'mobile';

  return (
    <Dropdown
      value={theme}
      options={options}
      onChange={(e) => handleChange(e.value as Theme)}
      optionLabel="label"
      optionValue="value"
      placeholder="Theme"
      aria-label="Select theme"
      className={isMobile ? 'w-full' : undefined}
      panelClassName="theme-dropdown-panel"
      style={!isMobile ? { minWidth: '10rem' } : undefined}
    />
  );
});

HeaderThemeToggle.displayName = 'HeaderThemeToggle';

