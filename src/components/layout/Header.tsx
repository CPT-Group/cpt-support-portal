'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { CPTButton } from '@cpt-group/cpt-prime-react';
import { useHeader } from '@/providers/HeaderProvider';
import { usePathname } from 'next/navigation';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { HeaderLogo } from './HeaderLogo';
import { HeaderBackToHome } from './HeaderBackToHome';
import { HeaderThemeToggle } from './HeaderThemeToggle';
import { HeaderSidebar } from './HeaderSidebar';

export const Header = memo(() => {
  const { isFormActive } = useHeader();
  const pathname = usePathname();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992); // Bootstrap lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const showBackToHome = useMemo(() => pathname !== '/', [pathname]);

  const handleSidebarOpen = useCallback(() => {
    setSidebarVisible(true);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarVisible(false);
  }, []);

  const startContent = useMemo(() => <HeaderLogo />, []);

  const endContent = useMemo(() => {
    if (isMobile) {
      return (
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
      );
    }

    return (
      <div className="flex align-items-center gap-2">
        {showBackToHome && (
          <HeaderBackToHome
            isFormActive={isFormActive}
            variant="desktop"
          />
        )}
        <HeaderThemeToggle variant="desktop" />
      </div>
    );
  }, [isMobile, showBackToHome, isFormActive, handleSidebarOpen]);

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
          backgroundColor: 'var(--header-bg)',
          borderBottom: '1px solid var(--surface-border)',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 1rem' }}>
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
