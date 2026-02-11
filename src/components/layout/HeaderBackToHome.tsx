'use client';

import { Button } from 'primereact/button';
import { useRouter, usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Only show confirmation if we're actually on the support request form
  const isOnSupportRequestForm = pathname === '/support-request';
  const shouldShowConfirmation = isFormActive && isOnSupportRequestForm;

  const handleBackToHome = useCallback(() => {
    if (shouldShowConfirmation) {
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
  }, [shouldShowConfirmation, router, onNavigate]);

  const isMobile = variant === 'mobile';

  if (isMobile) {
    return (
      <Button
        label="Home"
        icon="pi pi-home"
        iconPos="left"
        onClick={handleBackToHome}
        className="p-button-text w-full justify-content-start"
        loading={isPending}
        aria-label="Home"
      />
    );
  }

  return (
    <Button
      label="Home"
      icon="pi pi-home"
      iconPos="left"
      onClick={handleBackToHome}
      className="p-button-text"
      tooltip="Home"
      tooltipOptions={{ position: 'bottom' }}
      aria-label="Home"
      loading={isPending}
    />
  );
});

HeaderBackToHome.displayName = 'HeaderBackToHome';

