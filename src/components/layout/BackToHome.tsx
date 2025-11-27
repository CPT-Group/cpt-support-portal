'use client';

import { CPTButton } from '@cpt-group/cpt-prime-react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface BackToHomeProps {
  isFormActive?: boolean;
}

export const BackToHome = ({ isFormActive = false }: BackToHomeProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleBackToHome = () => {
    if (isFormActive) {
      confirmDialog({
        message: 'You will lose all progress, are you sure?',
        header: 'Confirm Navigation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          startTransition(() => {
            router.push('/');
          });
        },
      });
    } else {
      startTransition(() => {
        router.push('/');
      });
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div
        className="fixed top-0 right-0 z-5 m-3"
        style={{
          zIndex: 1000,
        }}
      >
        <CPTButton
          label="Back To Home"
          icon="pi pi-home"
          iconPos="left"
          onClick={handleBackToHome}
          className="p-button-rounded p-button-text p-button-success"
          tooltip="Back to Home"
          tooltipOptions={{ position: 'bottom' }}
          aria-label="Back to Home"
          style={{
            fontSize: '0.75rem',
          }}
        />
      </div>
    </>
  );
};

