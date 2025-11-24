'use client';

import { CPTButton } from '@cpt-group/cpt-prime-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export const HomeHero = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRequestSupport = () => {
    startTransition(() => {
      router.push('/support-request');
    });
  };

  const handleFAQ = () => {
    startTransition(() => {
      router.push('/faq');
    });
  };

  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to CPT Support Portal</h1>
        <p className="text-xl text-color-secondary mb-6">
          Submit support requests and get the help you need
        </p>
        <div className="flex gap-3 justify-content-center flex-wrap">
          <CPTButton
            label="Request Support"
            icon="pi pi-arrow-right"
            iconPos="right"
            size="large"
            onClick={handleRequestSupport}
            loading={isPending}
            className="p-button-primary"
          />
          <CPTButton
            label="FAQ"
            icon="pi pi-question-circle"
            iconPos="left"
            size="large"
            onClick={handleFAQ}
            className="p-button-outlined"
          />
        </div>
      </div>
    </div>
  );
};

