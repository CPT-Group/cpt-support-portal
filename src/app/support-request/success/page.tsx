'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CPTCard, CPTButton, CPTProgressSpinner } from '@cpt-group/cpt-prime-react';
import type { SubmissionData } from '@/types';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const firstName = searchParams.get('firstName') || '';
  const caseName = searchParams.get('caseName') || '';
  const issueTypes = searchParams.get('issueTypes') || '';
  const submissionDataParam = searchParams.get('submissionData') || '';

  let submissionData: SubmissionData | null = null;
  try {
    if (submissionDataParam) {
      submissionData = JSON.parse(atob(submissionDataParam)) as SubmissionData;
    }
  } catch (error) {
    console.error('Failed to parse submission data:', error);
  }

  const handleSubmitAnother = () => {
    router.push('/support-request');
  };

  const handleCopyToClipboard = async () => {
    if (!submissionData) return;

    try {
      const jsonString = JSON.stringify(submissionData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
      <div className="w-full max-w-screen-md">
        <CPTCard className="text-center">
          <div className="flex flex-column align-items-center gap-4">
            <i className="pi pi-check-circle text-6xl text-primary" />
            <h1 className="text-4xl font-bold">Thank you, {firstName}!</h1>
            <p className="text-xl text-color-secondary line-height-3">
              Your support request has been submitted. We will confirm once your request has been completed or if additional information is needed.
            </p>
            <div className="flex gap-3 justify-content-center flex-wrap mt-4">
              <CPTButton
                label="View FAQ"
                icon="pi pi-question-circle"
                iconPos="left"
                onClick={() => router.push('/faq')}
                className="p-button-outlined"
              />
              {/* <CPTButton
                label="Submit Another Ticket"
                icon="pi pi-plus"
                iconPos="right"
                onClick={handleSubmitAnother}
                className="p-button-primary"
              /> */}
            </div>
            <p className="text-sm text-color-secondary mt-4" style={{ fontStyle: 'italic' }}>
              Please be advised, making more than one ticket for the same request will slow down support response time.
            </p>
          </div>
        </CPTCard>

        {submissionData && (
          <CPTCard className="mt-4">
            <div className="flex flex-column gap-3">
              <div className="flex justify-content-between align-items-center">
                <h2 className="text-2xl font-bold m-0">Submission Data (Prototype)</h2>
                <CPTButton
                  label={copied ? 'Copied!' : 'Copy JSON'}
                  icon={copied ? 'pi pi-check' : 'pi pi-copy'}
                  iconPos="left"
                  onClick={handleCopyToClipboard}
                  className={copied ? 'p-button-success' : 'p-button-secondary'}
                  size="small"
                />
              </div>
              <pre className="p-3 border-round surface-ground text-color overflow-auto text-sm line-height-3" style={{ maxHeight: '500px' }}>
                {JSON.stringify(submissionData, null, 2)}
              </pre>
            </div>
          </CPTCard>
        )}
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
