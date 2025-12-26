'use client';

import { Sidebar } from 'primereact/sidebar';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { HeaderBackToHome } from './HeaderBackToHome';
import { HeaderThemeToggle } from './HeaderThemeToggle';
import { CPTButton } from '@cpt-group/cpt-prime-react';
import { confirmDialog } from 'primereact/confirmdialog';
import { memo, useMemo, useCallback } from 'react';

interface HeaderSidebarProps {
  visible: boolean;
  onHide: () => void;
  showBackToHome: boolean;
  isFormActive: boolean;
}

export const HeaderSidebar = memo(({ 
  visible, 
  onHide, 
  showBackToHome,
  isFormActive 
}: HeaderSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isFaqPage = pathname === '/faq';

  const headerContent = useMemo(() => (
    <h2 className="text-2xl font-bold m-0">Menu</h2>
  ), []);

  const handleFaqClick = useCallback(() => {
    onHide();
    router.push('/faq');
  }, [router, onHide]);

  const handleCptGroupClick = useCallback(() => {
    confirmDialog({
      message: 'Would you like to leave CPT Support and navigate to CPT Corporate?',
      header: 'Navigate to CPT Corporate',
      icon: 'pi pi-external-link',
      accept: () => {
        window.location.href = 'https://cptgroup.com';
      },
    });
  }, []);

  const footerContent = useMemo(() => (
    <div className="flex flex-column gap-2">
      <CPTButton
        label="CPT Group"
        icon="pi pi-external-link"
        iconPos="left"
        onClick={handleCptGroupClick}
        className="p-button-outlined w-full"
        aria-label="Navigate to CPT Corporate"
      />
      <div className="flex justify-content-center align-items-center gap-2 pt-2" style={{ borderTop: '1px solid var(--surface-border)' }}>
        <Link 
          href="/terms" 
          className="text-xs text-color-secondary"
          style={{ textDecoration: 'none' }}
          onClick={onHide}
        >
          Terms
        </Link>
        <span className="text-xs text-color-secondary">|</span>
        <Link 
          href="/privacy" 
          className="text-xs text-color-secondary"
          style={{ textDecoration: 'none' }}
          onClick={onHide}
        >
          Privacy
        </Link>
      </div>
    </div>
  ), [handleCptGroupClick, onHide]);

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position="right"
      className="w-20rem"
      header={headerContent}
    >
      <div className="flex flex-column gap-3" style={{ height: '100%', justifyContent: 'space-between' }}>
        <div className="flex flex-column gap-3">
          {showBackToHome && (
            <HeaderBackToHome
              isFormActive={isFormActive}
              variant="mobile"
              onNavigate={onHide}
            />
          )}
          {!isFaqPage && (
            <CPTButton
              label="FAQ"
              icon="pi pi-question-circle"
              iconPos="left"
              onClick={handleFaqClick}
              className="p-button-text w-full justify-content-start"
              aria-label="View FAQ"
            />
          )}
          <HeaderThemeToggle
            variant="mobile"
            onToggle={onHide}
          />
        </div>
        <div className="mt-auto pt-3">
          {footerContent}
        </div>
      </div>
    </Sidebar>
  );
});

HeaderSidebar.displayName = 'HeaderSidebar';

