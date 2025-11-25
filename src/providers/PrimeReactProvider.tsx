'use client';

import { PrimeReactProvider as PRProvider } from 'primereact/api';
import { ReactNode } from 'react';

// Import PrimeReact theme and styles
import 'primereact/resources/themes/soho-dark/theme.css';
// TODO: Switch to CPT light theme when available: import '@cpt-group/cpt-prime-react/cpt/light-theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

interface PrimeReactProviderProps {
  children: ReactNode;
}

export const PrimeReactProvider = ({ children }: PrimeReactProviderProps) => {
  return <PRProvider>{children}</PRProvider>;
};

