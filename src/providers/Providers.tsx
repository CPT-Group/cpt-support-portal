'use client';

import { ReactNode } from 'react';
import { PrimeReactProvider } from './PrimeReactProvider';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return <PrimeReactProvider>{children}</PrimeReactProvider>;
};

