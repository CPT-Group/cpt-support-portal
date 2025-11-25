'use client';

import { FAQAccordion } from '@/components/pages';
import { CPTButton } from '@cpt-group/cpt-prime-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function FAQPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleBackToHome = () => {
    startTransition(() => {
      router.push('/');
    });
  };

  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
      <div className="w-full max-w-screen-lg">
        <div className="flex justify-content-between align-items-center mb-4">
          <h1 className="text-5xl font-bold m-0">FAQ</h1>
          <CPTButton
            label="Back to Home"
            icon="pi pi-home"
            iconPos="left"
            onClick={handleBackToHome}
            loading={isPending}
            className="p-button-secondary p-button-outlined"
          />
        </div>
        <p className="text-lg text-color-secondary mb-6 line-height-3">
          Find answers to commonly asked questions about support requests, case information, and settlement processes. 
          If you don't find what you're looking for, please submit a support request and our team will assist you.
        </p>
        <FAQAccordion />
      </div>
    </div>
  );
}

