'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useSupportRequestForm } from '@/hooks';
import {
  StepRequestTypeSelection,
  StepCaseSelection,
  StepRequestData,
  FAQFeedbackDialog,
} from './';
import type { FAQDialogView } from './FAQFeedbackDialog';
import type { CaseOption, DynamicFormData } from '@/types';
import { FAQ_DATA } from '@/constants';
import { useCases } from '@/providers/CasesProvider';
import { generateSubmissionJSON } from '@/utils/jsonGenerator';
import { buildSupportRequestPayload } from '@/utils/salesforcePayload';
import { getSupportRequestQueryString } from '@/utils/urlParams';
import { REQUEST_TYPES } from '@/constants/requestTypes';
import type { FAQItem } from '@/constants/faqData';
import { sendFAQFeedbackWebhook } from '@/utils/webhooks';
import { useHeader } from '@/providers/HeaderProvider';

interface SupportRequestStepperProps {
  initialData?: Partial<DynamicFormData>;
  onStepChange?: (step: number) => void;
}

const STEPS = [
  { label: 'Support Request Selection' },
  { label: 'Select Case' },
  { label: 'Support Request Data' },
];

const scrollToTopIfMobile = () => {
  if (window.innerWidth <= 768) {
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  }
};

export const SupportRequestStepper = ({ initialData, onStepChange }: SupportRequestStepperProps) => {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { cases, loading: casesLoading, error: casesError, loadOnce, refetch: refetchCases } = useCases();
  const { setIsFaqDialogOpen } = useHeader();
  const [stepOpacity, setStepOpacity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faqDialogVisible, setFaqDialogVisible] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQItem | null>(null);
  const [faqDialogView, setFaqDialogView] = useState<FAQDialogView>('faq');
  const [faqRating, setFaqRating] = useState<number>(0);
  const [faqComments, setFaqComments] = useState<string>('');
  const [faqFeedbackError, setFaqFeedbackError] = useState<string | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const {
    formData,
    activeStep,
    errors,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    validateField,
    validateStep,
    canGoPrevious,
    consolidatedFields,
  } = useSupportRequestForm(initialData);

  useEffect(() => {
    setStepOpacity(0);
    const timer = setTimeout(() => setStepOpacity(1), 50);
    if (window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onStepChange?.(activeStep);
    return () => clearTimeout(timer);
  }, [activeStep, onStepChange]);

  // Keep the URL in sync with current step: step 0 = requestType only; step 1 = + case/caseName; step 2 = + form fields (back button removes later params)
  useEffect(() => {
    const query = getSupportRequestQueryString(formData, { step: activeStep, caseList: cases });
    const newUrl = query ? `/support-request?${query}` : '/support-request';
    router.replace(newUrl, { scroll: false });
  }, [formData, activeStep, router, cases]);

  // When user reaches the case list step, fetch and cache the list (once per session)
  useEffect(() => {
    if (activeStep === 1) loadOnce();
  }, [activeStep, loadOnce]);

  const handleRequestTypesChange = useCallback(
    (selectedIds: string[]) => updateFormData({ requestTypes: selectedIds }),
    [updateFormData]
  );

  const handleCaseChange = useCallback(
    (caseOption: CaseOption | null) => updateFormData({ caseId: caseOption?.id || null }),
    [updateFormData]
  );

  const handleFieldChange = useCallback(
    (fieldId: string, value: string | File[]) => updateFormData({ [fieldId]: value }),
    [updateFormData]
  );

  const handleFieldBlur = useCallback(
    (fieldId: string, value: string) => validateField(fieldId, value),
    [validateField]
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!validateStep(2)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly before submitting.',
        life: 5000,
      });
      return;
    }
    setIsSubmitting(true);
    try {
      toast.current?.show({
        severity: 'info',
        summary: 'Submitting',
        detail: 'Please wait while we process your request...',
        life: 3000,
      });
      const selectedCase = cases.find((c) => c.id === formData.caseId);
      const submissionData = generateSubmissionJSON(formData, selectedCase || null);
      const payload = buildSupportRequestPayload(submissionData);
      const res = await fetch('/api/support-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.current?.show({
          severity: 'error',
          summary: 'Submission Failed',
          detail: (data.message as string) || `Request failed (${res.status}). Please try again.`,
          life: 6000,
        });
        setIsSubmitting(false);
        return;
      }
      const sfId = data.id as string | undefined;
      const params = new URLSearchParams({
        firstName: typeof formData.firstName === 'string' ? formData.firstName : '',
        caseName: selectedCase?.label ?? '',
        requestTypes: submissionData.requestTypeLabels?.join(', ') ?? '',
        submissionData: btoa(JSON.stringify(submissionData)),
      });
      if (sfId) params.set('sfId', sfId);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Your support request has been submitted successfully!',
        life: 3000,
      });
      setTimeout(() => router.push(`/support-request/success?${params.toString()}`), 1000);
    } catch (err) {
      console.error('Support request submit error:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Submission Failed',
        detail: 'An error occurred while submitting your request. Please try again.',
        life: 5000,
      });
      setIsSubmitting(false);
    }
  }, [formData, validateStep, router, isSubmitting]);

  const handleNextClick = useCallback(() => {
    if (activeStep === 0 && formData.requestTypes?.length) {
      const requestTypeWithFaq = REQUEST_TYPES.find(
        (rt) => formData.requestTypes?.includes(rt.id) && rt.faqLink
      );
      if (requestTypeWithFaq?.faqLink) {
        const faq = FAQ_DATA.find((f) => f.id === requestTypeWithFaq.faqLink);
        if (faq) {
          setSelectedFaq(faq);
          setFaqDialogView('faq');
          setFaqRating(0);
          setFaqComments('');
          setFaqFeedbackError(null);
          setFaqDialogVisible(true);
          setIsFaqDialogOpen(true);
          return;
        }
      }
    }
    const isValid = goToNextStep();
    if (isValid) scrollToTopIfMobile();
  }, [activeStep, formData.requestTypes, goToNextStep, setIsFaqDialogOpen]);

  const resetFaqDialog = useCallback(() => {
    setFaqDialogView('faq');
    setFaqRating(0);
    setFaqComments('');
    setFaqFeedbackError(null);
  }, []);

  const onFaqHide = useCallback(() => {
    setFaqDialogVisible(false);
    setIsFaqDialogOpen(false);
    resetFaqDialog();
  }, [setIsFaqDialogOpen, resetFaqDialog]);

  const onFaqThumbsDown = useCallback(() => {
    setFaqDialogVisible(false);
    setIsFaqDialogOpen(false);
    resetFaqDialog();
    const isValid = goToNextStep();
    if (isValid) scrollToTopIfMobile();
  }, [goToNextStep, setIsFaqDialogOpen, resetFaqDialog]);

  const onFaqThumbsUp = useCallback(() => setFaqDialogView('rating'), []);

  const onFaqCloseWithoutFeedback = useCallback(async () => {
    if (selectedFaq) {
      await sendFAQFeedbackWebhook({
        faqId: selectedFaq.id,
        faqQuestion: selectedFaq.question,
        timestamp: new Date().toISOString(),
      });
    }
    setFaqDialogVisible(false);
    setIsFaqDialogOpen(false);
    resetFaqDialog();
  }, [selectedFaq, setIsFaqDialogOpen, resetFaqDialog]);

  const onFaqSubmitFeedback = useCallback(async () => {
    if (faqRating === 0) {
      setFaqFeedbackError('Please provide a rating');
      return;
    }
    setIsSubmittingFeedback(true);
    setFaqFeedbackError(null);
    try {
      if (selectedFaq) {
        await sendFAQFeedbackWebhook({
          faqId: selectedFaq.id,
          faqQuestion: selectedFaq.question,
          timestamp: new Date().toISOString(),
          rating: faqRating,
          comments: faqComments.trim() || undefined,
        });
      }
      setFaqDialogView('confirmation');
    } catch (err) {
      setFaqFeedbackError('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  }, [selectedFaq, faqRating, faqComments]);

  const onFaqBackToHome = useCallback(() => {
    setFaqDialogVisible(false);
    setIsFaqDialogOpen(false);
    resetFaqDialog();
    router.push('/');
  }, [router, setIsFaqDialogOpen, resetFaqDialog]);

  const onFaqViewFaq = useCallback(() => {
    setFaqDialogVisible(false);
    setIsFaqDialogOpen(false);
    resetFaqDialog();
    router.push('/faq');
  }, [router, setIsFaqDialogOpen, resetFaqDialog]);

  const selectedRequestTypeLabels = (formData.requestTypes || [])
    .map((id) => REQUEST_TYPES.find((rt) => rt.id === id)?.label)
    .filter(Boolean);

  const selectedCase = cases.find((c) => c.id === formData.caseId);

  const renderCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepRequestTypeSelection
            selectedRequestTypes={formData.requestTypes || []}
            error={errors.requestTypes}
            onRequestTypesChange={handleRequestTypesChange}
            title="Support Request Selection"
            description="Please select one or more request types that best describe your support needs."
          />
        );
      case 1:
        return (
          <div className="relative w-full">
            {(casesLoading || (cases.length === 0 && !casesError)) && (
              <div
                className="absolute inset-0 flex flex-column align-items-center justify-content-center gap-2 z-1"
                style={{
                  background: 'var(--maskbg, rgba(0,0,0,0.4))',
                  borderRadius: 'var(--border-radius)',
                  minHeight: '200px',
                }}
              >
                <ProgressSpinner />
                <span className="text-color" style={{ fontWeight: 500 }}>
                  Loading case list...
                </span>
              </div>
            )}
            {casesError && cases.length === 0 && (
              <div className="flex flex-column gap-2 p-3 surface-100 border-round mb-2">
                <span className="text-color-secondary">Could not load case list.</span>
                <span className="text-sm text-color-secondary">{casesError}</span>
                <Button
                  label="Retry"
                  icon="pi pi-refresh"
                  size="small"
                  onClick={() => refetchCases()}
                />
              </div>
            )}
            <StepCaseSelection
              selectedCaseId={formData.caseId}
              error={errors.caseId}
              onCaseChange={handleCaseChange}
              title={selectedCase ? selectedCase.label : 'Select Case'}
              description={
                selectedRequestTypeLabels.length > 0
                  ? `Request types: ${selectedRequestTypeLabels.join(', ')}`
                  : undefined
              }
            />
          </div>
        );
      case 2:
        return (
          <StepRequestData
            formData={formData}
            requiredFields={consolidatedFields.required}
            optionalFields={consolidatedFields.optional}
            errors={errors}
            onFieldChange={handleFieldChange}
            onFieldBlur={handleFieldBlur}
            title={selectedCase ? selectedCase.label : 'Request Data'}
            description="Please provide the following information for your support request."
            selectedCase={selectedCase ?? null}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-column align-items-center page-responsive-padding"
      style={{
        minHeight: 'calc(100vh - var(--header-offset) - 1rem)',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'visible',
        boxSizing: 'border-box',
      }}
    >
      {isSubmitting && (
        <div
          className="loading-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--maskbg)',
            color: 'var(--text-color)',
          }}
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex flex-column align-items-center gap-3">
            <ProgressSpinner
              style={{ width: '3rem', height: '3rem' }}
              strokeWidth="4"
            />
            <span className="font-medium">Submitting your request...</span>
          </div>
        </div>
      )}
      <Toast ref={toast} position="bottom-right" />
      <div className="w-full" style={{ maxWidth: 'var(--support-form-max-width)', height: 'auto', overflow: 'visible' }}>
        <Steps model={STEPS} activeIndex={activeStep} />
        <div
          className="mt-2"
          style={{
            opacity: stepOpacity,
            transition: 'opacity 0.3s ease-in-out',
            height: 'auto',
            overflow: 'visible',
          }}
        >
          {renderCurrentStep()}
        </div>
        <div className="flex justify-content-between mt-2">
          {activeStep > 0 && (
            <Button
              label="Previous"
              icon="pi pi-arrow-left"
              iconPos="left"
              onClick={goToPreviousStep}
              disabled={!canGoPrevious}
              className="p-button-secondary"
            />
          )}
          {activeStep === 0 && <div />}
          {activeStep === 2 ? (
            <Button
              label="Submit"
              icon="pi pi-check"
              iconPos="right"
              onClick={handleSubmit}
              className="p-button-primary"
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          ) : (
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={handleNextClick}
              className="p-button-primary"
            />
          )}
        </div>
      </div>

      <FAQFeedbackDialog
        visible={faqDialogVisible}
        selectedFaq={selectedFaq}
        view={faqDialogView}
        rating={faqRating}
        comments={faqComments}
        feedbackError={faqFeedbackError}
        isSubmittingFeedback={isSubmittingFeedback}
        onHide={onFaqHide}
        onThumbsDown={onFaqThumbsDown}
        onThumbsUp={onFaqThumbsUp}
        onRatingChange={setFaqRating}
        onCommentsChange={setFaqComments}
        onCloseWithoutFeedback={onFaqCloseWithoutFeedback}
        onSubmitFeedback={onFaqSubmitFeedback}
        onBackToHome={onFaqBackToHome}
        onViewFaq={onFaqViewFaq}
      />
    </div>
  );
};
