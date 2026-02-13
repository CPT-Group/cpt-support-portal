'use client';

import { PrimeReactProvider as PRProvider } from 'primereact/api';
import { ReactNode } from 'react';

// Import PrimeReact core styles (theme CSS is loaded in layout.tsx: lara-dark-blue + main.scss overrides)
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

interface PrimeReactProviderProps {
  children: ReactNode;
}

export const PrimeReactProvider = ({ children }: PrimeReactProviderProps) => {
  return <PRProvider>{children}</PRProvider>;
};

