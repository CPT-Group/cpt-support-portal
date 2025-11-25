'use client';

import { CPTButton } from '@cpt-group/cpt-prime-react';
import { useTheme } from '@/providers/ThemeProvider';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="fixed top-0 left-0 z-5 m-3"
      style={{
        zIndex: 1000,
      }}
    >
      <CPTButton
        icon={theme === 'light' ? 'pi pi-sun' : 'pi pi-moon'}
        onClick={toggleTheme}
        className="p-button-rounded p-button-text"
        tooltip={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
        tooltipOptions={{ position: 'bottom' }}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        style={{
          width: '3rem',
          height: '3rem',
          fontSize: '1.5rem',
        }}
      />
    </div>
  );
};

