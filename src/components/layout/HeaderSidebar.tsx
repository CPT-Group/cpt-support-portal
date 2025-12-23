'use client';

import { Sidebar } from 'primereact/sidebar';
import { CPTButton } from '@cpt-group/cpt-prime-react';
import { HeaderBackToHome } from './HeaderBackToHome';
import { HeaderThemeToggle } from './HeaderThemeToggle';
import { memo } from 'react';

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
  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position="right"
      className="w-20rem"
    >
      <div className="flex flex-column gap-3 p-3">
        <div className="flex justify-content-between align-items-center mb-3">
          <h2 className="text-2xl font-bold m-0">Menu</h2>
          <CPTButton
            icon="pi pi-times"
            onClick={onHide}
            className="p-button-rounded p-button-text"
            aria-label="Close Menu"
          />
        </div>
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
    </Sidebar>
  );
});

HeaderSidebar.displayName = 'HeaderSidebar';

