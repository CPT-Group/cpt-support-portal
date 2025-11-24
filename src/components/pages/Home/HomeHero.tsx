'use client';

import { CPTButton } from '@cpt-group/cpt-prime-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export const HomeHero = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleBeginClick = () => {
    startTransition(() => {
      router.push('/support-request');
    });
  };

  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to CPT Support Portal</h1>
        <p className="text-xl text-color-secondary mb-6">
          Submit support requests and get the help you need
        </p>
        <CPTButton
          label="Begin"
          icon="pi pi-arrow-right"
          iconPos="right"
          size="large"
          onClick={handleBeginClick}
          loading={isPending}
          className="p-button-primary"
        />
      </div>
    </div>
  );
};

