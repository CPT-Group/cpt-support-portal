'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useSupportRequestForm } from '@/hooks';
import {
  StepRequestTypeSelection,
  StepCaseSelection,
  StepRequestData,
  FAQFeedbackDialog,
} from './';
import type { FAQDialogView } from './FAQFeedbackDialog';
import type { CaseOption, DynamicFormData } from '@/types';
import { CASE_LIST, FAQ_DATA } from '@/constants';
import { generateSubmissionJSON } from '@/utils/jsonGenerator';
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      const selectedCase = CASE_LIST.find((c) => c.id === formData.caseId);
      const submissionData = generateSubmissionJSON(formData, selectedCase || null);
      const params = new URLSearchParams({
        firstName: typeof formData.firstName === 'string' ? formData.firstName : '',
        caseName: selectedCase?.label ?? '',
        requestTypes: submissionData.requestTypeLabels?.join(', ') ?? '',
        submissionData: btoa(JSON.stringify(submissionData)),
      });
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Your support request has been submitted successfully!',
        life: 3000,
      });
      setTimeout(() => router.push(`/support-request/success?${params.toString()}`), 1000);
    } catch {
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

  const selectedCase = CASE_LIST.find((c) => c.id === formData.caseId);

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
      style={{ paddingTop: '4rem', paddingLeft: '10rem', paddingRight: '10rem', height: 'auto', overflow: 'visible' }}
    >
      <Toast ref={toast} position="top-right" />
      <div className="w-full max-w-screen-lg" style={{ height: 'auto', overflow: 'visible' }}>
        <Steps model={STEPS} activeIndex={activeStep} />
        <div
          className="mt-4"
          style={{
            opacity: stepOpacity,
            transition: 'opacity 0.3s ease-in-out',
            height: 'auto',
            overflow: 'visible',
          }}
        >
          {renderCurrentStep()}
        </div>
        <div className="flex justify-content-between mt-4">
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
