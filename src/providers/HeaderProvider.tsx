'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderContextType {
  isFormActive: boolean;
  setIsFormActive: (active: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within HeaderProvider');
  }
  return context;
};

interface HeaderProviderProps {
  children: ReactNode;
}

export const HeaderProvider = ({ children }: HeaderProviderProps) => {
  const [isFormActive, setIsFormActive] = useState(false);

  return (
    <HeaderContext.Provider value={{ isFormActive, setIsFormActive }}>
      {children}
    </HeaderContext.Provider>
  );
};

