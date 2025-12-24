'use client';

import { Sidebar } from 'primereact/sidebar';
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
  const headerContent = useMemo(() => (
    <h2 className="text-2xl font-bold m-0">Menu</h2>
  ), []);

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
    <CPTButton
      label="CPT Group"
      icon="pi pi-external-link"
      iconPos="left"
      onClick={handleCptGroupClick}
      className="p-button-outlined w-full"
      aria-label="Navigate to CPT Corporate"
    />
  ), [handleCptGroupClick]);

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

