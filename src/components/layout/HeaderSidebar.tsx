'use client';

import { Sidebar } from 'primereact/sidebar';
import { HeaderBackToHome } from './HeaderBackToHome';
import { HeaderThemeToggle } from './HeaderThemeToggle';
import { memo, useMemo } from 'react';

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

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position="right"
      className="w-20rem"
      header={headerContent}
    >
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
    </Sidebar>
  );
});

HeaderSidebar.displayName = 'HeaderSidebar';

