'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SupportRequestStepper } from '@/components';
import { useHeader } from '@/providers/HeaderProvider';
import { parseURLParams } from '@/utils/urlParams';
import { ProgressSpinner } from 'primereact/progressspinner';

const SupportRequestContent = () => {
  const searchParams = useSearchParams();
  const initialData = parseURLParams(searchParams);
  const { setIsFormActive } = useHeader();

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
