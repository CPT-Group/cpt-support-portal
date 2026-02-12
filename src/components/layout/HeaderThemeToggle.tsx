'use client';

import { Button } from 'primereact/button';
import { useTheme } from '@/providers/ThemeProvider';
import { memo } from 'react';

interface HeaderThemeToggleProps {
  variant?: 'desktop' | 'mobile';
  onToggle?: () => void;
}

export const HeaderThemeToggle = memo(({ variant = 'desktop', onToggle }: HeaderThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
    onToggle?.();
  };

  const isMobile = variant === 'mobile';
  const icon = theme === 'light' ? 'pi pi-sun' : 'pi pi-moon';
  const label = theme === 'light' ? 'Dark Theme' : 'Light Theme';

  if (isMobile) {
    return (
      <Button
        label={label}
        icon={icon}
        iconPos="left"
        onClick={handleToggle}
        className="p-button-text w-full justify-content-start"
        aria-label={label}
      />
    );
  }

  return (
    <Button
      icon={icon}
      onClick={handleToggle}
      className="p-button-rounded p-button-text"
      tooltip={label}
      tooltipOptions={{ position: 'bottom' }}
      aria-label={label}
      style={{
        width: '2.5rem',
        height: '2.5rem',
      }}
    />
  );
});

HeaderThemeToggle.displayName = 'HeaderThemeToggle';

