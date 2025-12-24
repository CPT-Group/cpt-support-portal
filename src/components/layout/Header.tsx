'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { CPTButton } from '@cpt-group/cpt-prime-react';
import { useHeader } from '@/providers/HeaderProvider';
import { usePathname } from 'next/navigation';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { HeaderLogo } from './HeaderLogo';
import { HeaderSidebar } from './HeaderSidebar';

export const Header = memo(() => {
  const { isFormActive, isFaqDialogOpen } = useHeader();
  const pathname = usePathname();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const showBackToHome = useMemo(() => pathname !== '/', [pathname]);

  const handleSidebarOpen = useCallback(() => {
    setSidebarVisible(true);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarVisible(false);
  }, []);

  const startContent = useMemo(() => <HeaderLogo />, []);

  const endContent = useMemo(() => (
    <CPTButton
      icon="pi pi-bars"
      onClick={handleSidebarOpen}
      className="p-button-rounded p-button-text"
      aria-label="Open Menu"
      style={{
        width: '2.5rem',
        height: '2.5rem',
      }}
    />
  ), [handleSidebarOpen]);

  return (
    <>
      <ConfirmDialog />
      <HeaderSidebar
        visible={sidebarVisible}
        onHide={handleSidebarClose}
        showBackToHome={showBackToHome}
        isFormActive={isFormActive}
      />
      <header
        className="sticky top-0"
        style={{
          zIndex: 1000,
          width: '100%',
          backgroundColor: 'var(--header-bg)',
          borderBottom: '1px solid var(--surface-border)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          margin: 0,
          padding: 0,
          display: isFaqDialogOpen ? 'none' : 'block',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 1rem', width: '100%' }}>
          <Toolbar
            start={startContent}
            end={endContent}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0.75rem 0',
            }}
          />
        </div>
      </header>
    </>
  );
});

Header.displayName = 'Header';
