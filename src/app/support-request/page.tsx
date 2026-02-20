'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SupportRequestStepper } from '@/components';
import { useHeader } from '@/providers/HeaderProvider';
import { useCases } from '@/providers/CasesProvider';
import { parseAndValidateURLParams } from '@/utils/urlParams';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

const SupportRequestContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cases } = useCases();
  const { valid, errors, formData: initialData } = parseAndValidateURLParams(searchParams, {
    caseList: cases,
  });
  const { setIsFormActive } = useHeader();

  if (!valid && errors.length > 0) {
    return (
      <div className="flex flex-column gap-3 p-4 max-w-2xl mx-auto">
        <Message severity="error" className="w-full">
          <div className="flex flex-column gap-2">
            <strong>Invalid URL parameters</strong>
            <ul className="mb-0 pl-3">
              {errors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
            <p className="mb-0 mt-2">
              You can continue with the form below by fixing the URL, or start fresh without
              parameters.
            </p>
          </div>
        </Message>
        <div className="flex gap-2">
          <Button
            label="Start fresh"
            icon="pi pi-refresh"
            className="p-button-outlined"
            onClick={() => router.push('/support-request')}
          />
          <Button
            label="Back to home"
            icon="pi pi-home"
            className="p-button-outlined"
            onClick={() => router.push('/')}
          />
        </div>
        <SupportRequestStepper
          initialData={{}}
          onStepChange={(step) => setIsFormActive(step > 0)}
        />
      </div>
    );
  }

  return (
    <SupportRequestStepper
      initialData={initialData}
      onStepChange={(step) => setIsFormActive(step > 0)}
    />
  );
};

const LoadingFallback = () => (
  <div className="flex flex-column align-items-center justify-content-center min-h-screen">
    <ProgressSpinner />
  </div>
);

export default function SupportRequestPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SupportRequestContent />
    </Suspense>
  );
}
