'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CPTCard, CPTButton, CPTProgressSpinner } from '@/components/input';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const firstName = searchParams.get('firstName') || '';
  const caseName = searchParams.get('caseName') || '';
  const issueTypes = searchParams.get('issueTypes') || '';

  const handleSubmitAnother = () => {
    router.push('/support-request');
  };

  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
      <div className="w-full max-w-screen-md">
        <CPTCard className="text-center">
          <div className="flex flex-column align-items-center gap-4">
            <i className="pi pi-check-circle text-6xl text-green-500" />
            <h1 className="text-4xl font-bold">Thank you, {firstName}!</h1>
            <p className="text-xl text-color-secondary line-height-3">
              Your issue for <strong>{issueTypes}</strong> has been submitted for{' '}
              <strong>{caseName}</strong> and our representative will get back to you
              shortly.
            </p>
            <CPTButton
              label="Submit Another Ticket"
              icon="pi pi-plus"
              iconPos="right"
              onClick={handleSubmitAnother}
              className="p-button-primary mt-4"
            />
          </div>
        </CPTCard>
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="flex flex-column align-items-center justify-content-center min-h-screen">
    <CPTProgressSpinner />
  </div>
);

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
