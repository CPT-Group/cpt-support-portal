'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <main
      style={{
        paddingTop: isHomePage ? 0 : 'var(--header-offset)',
      }}
    >
      {children}
    </main>
  );
};

