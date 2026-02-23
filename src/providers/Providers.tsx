'use client';

import { ReactNode } from 'react';
import { PrimeReactProvider } from './PrimeReactProvider';
import { ThemeProvider } from './ThemeProvider';
import { HeaderProvider } from './HeaderProvider';
import { CasesProvider } from './CasesProvider';
import { LoadingOverlayProvider } from './LoadingOverlayProvider';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider>
      <HeaderProvider>
        <CasesProvider>
          <LoadingOverlayProvider>
            <PrimeReactProvider>{children}</PrimeReactProvider>
          </LoadingOverlayProvider>
        </CasesProvider>
      </HeaderProvider>
    </ThemeProvider>
  );
};

