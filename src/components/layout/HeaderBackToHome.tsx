'use client';

import { CPTButton } from '@cpt-group/cpt-prime-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { confirmDialog } from 'primereact/confirmdialog';
import { memo, useCallback } from 'react';

interface HeaderBackToHomeProps {
  isFormActive: boolean;
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
}

export const HeaderBackToHome = memo(({ 
  isFormActive, 
  variant = 'desktop',
  onNavigate 
}: HeaderBackToHomeProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleBackToHome = useCallback(() => {
    if (isFormActive) {
      confirmDialog({
        message: 'You will lose all progress, are you sure?',
        header: 'Confirm Navigation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          onNavigate?.();
          startTransition(() => {
            router.push('/');
          });
        },
      });
    } else {
      onNavigate?.();
      startTransition(() => {
        router.push('/');
      });
    }
  }, [isFormActive, router, onNavigate]);

  const isMobile = variant === 'mobile';

  if (isMobile) {
    return (
      <CPTButton
        label="Back To Home"
        icon="pi pi-home"
        iconPos="left"
        onClick={handleBackToHome}
        className="p-button-text w-full justify-content-start"
        loading={isPending}
        aria-label="Back to Home"
      />
    );
  }

  return (
    <CPTButton
      label="Back To Home"
      icon="pi pi-home"
      iconPos="left"
      onClick={handleBackToHome}
      className="p-button-text"
      tooltip="Back to Home"
      tooltipOptions={{ position: 'bottom' }}
      aria-label="Back to Home"
      loading={isPending}
    />
  );
});

HeaderBackToHome.displayName = 'HeaderBackToHome';

