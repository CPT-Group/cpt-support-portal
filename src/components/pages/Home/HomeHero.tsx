'use client';

import { Button } from 'primereact/button';
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
    <div 
      className="flex flex-column align-items-center justify-content-center"
      style={{ 
        minHeight: 'calc(100vh - 5rem)',
        padding: '3rem 1rem',
        boxSizing: 'border-box'
      }}
    >
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to CPT Support Portal</h1>
        <p className="text-xl text-color-secondary mb-6">
          Submit support requests and get the help you need
        </p>
        <div className="flex gap-3 justify-content-center flex-wrap">
          <Button
            label="Request Support"
            icon="pi pi-arrow-right"
            iconPos="right"
            size="large"
            onClick={handleRequestSupport}
            loading={isPending}
            className="p-button-primary"
          />
          <Button
            label="FAQ"
            icon="pi pi-question-circle"
            iconPos="left"
            size="large"
            onClick={handleFAQ}
            loading={isPending}
            className="p-button-outlined"
          />
        </div>
      </div>
    </div>
  );
};

