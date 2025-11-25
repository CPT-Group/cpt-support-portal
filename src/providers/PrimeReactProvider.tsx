'use client';

import { PrimeReactProvider as PRProvider } from 'primereact/api';
import { ReactNode } from 'react';

// Import PrimeReact theme and styles
// Using soho-dark theme temporarily - CPT themes need refinement
import 'primereact/resources/themes/soho-dark/theme.css';
// import '@cpt-group/cpt-prime-react/cpt/light-theme.css'; // CPT light theme (commented out - needs refinement)
// import '@cpt-group/cpt-prime-react/cpt/dark-theme.css'; // CPT dark theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

interface PrimeReactProviderProps {
  children: ReactNode;
}

export const PrimeReactProvider = ({ children }: PrimeReactProviderProps) => {
  return <PRProvider>{children}</PRProvider>;
};

