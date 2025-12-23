'use client';

import { ReactNode } from 'react';
import { PrimeReactProvider } from './PrimeReactProvider';
import { ThemeProvider } from './ThemeProvider';
import { HeaderProvider } from './HeaderProvider';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider>
      <HeaderProvider>
        <PrimeReactProvider>{children}</PrimeReactProvider>
      </HeaderProvider>
    </ThemeProvider>
  );
};

