'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CPTSteps, CPTButton, CPTDialog } from '@cpt-group/cpt-prime-react';
import { Toast } from 'primereact/toast';
import { useSupportRequestForm } from '@/hooks';
import {
  StepRequestTypeSelection,
  StepCaseSelection,
  StepRequestData,
} from './';
import type { CaseOption, DynamicFormData } from '@/types';
import { CASE_LIST, FAQ_DATA } from '@/constants';
import { generateSubmissionJSON } from '@/utils/jsonGenerator';
import { REQUEST_TYPES } from '@/constants/requestTypes';
import type { FAQItem } from '@/constants/faqData';

interface SupportRequestStepperProps {
  initialData?: Partial<DynamicFormData>;
  onStepChange?: (step: number) => void;
}

export const SupportRequestStepper = ({ initialData, onStepChange }: SupportRequestStepperProps) => {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [stepOpacity, setStepOpacity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faqDialogVisible, setFaqDialogVisible] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQItem | null>(null);
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
    
    // Scroll to top when step changes (only on mobile/phone screens)
    if (window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Notify parent of step change
    if (onStepChange) {
      onStepChange(activeStep);
    }
    
    return () => clearTimeout(timer);
  }, [activeStep, onStepChange]);

  const steps = [
    { label: 'Support Request Selection' },
    { label: 'Select Case' },
    { label: 'Support Request Data' },
  ];

  const handleRequestTypesChange = (selectedIds: string[]) => {
    updateFormData({ requestTypes: selectedIds });
    // Reason is now auto-generated in JSON submission, no UI prefill needed
  };

  const handleCaseChange = (caseOption: CaseOption | null) => {
    updateFormData({ caseId: caseOption?.id || null });
    // Reason is now auto-generated in JSON submission, no UI prefill needed
  };

  const handleFieldChange = useCallback((fieldId: string, value: string | File[]) => {
    updateFormData({ [fieldId]: value });
  }, [updateFormData]);

  const handleFieldBlur = useCallback((fieldId: string, value: string) => {
    validateField(fieldId, value);
  }, [validateField]);


  const handleSubmit = useCallback(async () => {
    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    // Validate the final step before submitting
    const isValid = validateStep(2);
    
    if (!isValid) {
      // Show error toast for validation failures
      toast.current?.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly before submitting.',
        life: 5000,
      });
      return;
    }

    // Set loading state
    setIsSubmitting(true);

    try {
      // Show loading toast
      toast.current?.show({
        severity: 'info',
        summary: 'Submitting',
        detail: 'Please wait while we process your request...',
        life: 3000,
      });

      // Simulate a small delay to show loading state (can be removed if not needed)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const selectedCase = CASE_LIST.find((c) => c.id === formData.caseId);
      const submissionData = generateSubmissionJSON(formData, selectedCase || null);

      const params = new URLSearchParams({
        firstName: typeof formData.firstName === 'string' ? formData.firstName : '',
        caseName: selectedCase?.label || '',
        requestTypes: submissionData.requestTypeLabels?.join(', ') || '',
        submissionData: btoa(JSON.stringify(submissionData)),
      });

      // Show success toast
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Your support request has been submitted successfully!',
        life: 3000,
      });

      // Navigate to success page after a brief delay to show the toast
      setTimeout(() => {
        router.push(`/support-request/success?${params.toString()}`);
      }, 1000);
    } catch (error) {
      // Show error toast
      toast.current?.show({
        severity: 'error',
        summary: 'Submission Failed',
        detail: 'An error occurred while submitting your request. Please try again.',
        life: 5000,
      });
      setIsSubmitting(false);
    }
  }, [formData, validateStep, router, isSubmitting]);

  // Get selected request type labels for display
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
            description={
              'Please provide the following information for your support request.'
            }
            selectedCase={selectedCase || null}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-column align-items-center page-responsive-padding" style={{ paddingTop: '4rem', paddingLeft: '10rem', paddingRight: '10rem', height: 'auto', overflow: 'visible' }}>
        <Toast ref={toast} position="top-right" />
        <div className="w-full max-w-screen-lg" style={{ height: 'auto', overflow: 'visible' }}>
          <CPTSteps model={steps} activeIndex={activeStep} />
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
            <CPTButton
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
            <CPTButton
              label="Submit"
              icon="pi pi-check"
              iconPos="right"
              onClick={handleSubmit}
              className="p-button-primary"
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          ) : (
            <CPTButton
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={() => {
                // On step 0, check if any selected request type has a FAQ link
                if (activeStep === 0 && formData.requestTypes && formData.requestTypes.length > 0) {
                  // Find first request type with FAQ link
                  const requestTypeWithFaq = REQUEST_TYPES.find(
                    (rt) => formData.requestTypes?.includes(rt.id) && rt.faqLink
                  );

                  if (requestTypeWithFaq?.faqLink) {
                    // Find FAQ by UUID
                    const faq = FAQ_DATA.find((f) => f.id === requestTypeWithFaq.faqLink);
                    if (faq) {
                      setSelectedFaq(faq);
                      setFaqDialogVisible(true);
                      return; // Don't proceed to next step yet
                    }
                  }
                }

                // Normal flow - proceed to next step
                const isValid = goToNextStep();
                if (isValid) {
                  // Scroll to top after moving to next step (only on mobile/phone screens)
                  if (window.innerWidth <= 768) {
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }
                }
              }}
              className="p-button-primary"
            />
          )}
        </div>
      </div>

      {/* FAQ Dialog */}
      <CPTDialog
        header={selectedFaq?.question || 'FAQ'}
        visible={faqDialogVisible}
        onHide={() => setFaqDialogVisible(false)}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '640px': '90vw' }}
        modal
        dismissableMask
      >
        {selectedFaq && (
          <div className="flex flex-column gap-4">
            <div className="w-full">
              <div 
                className="m-0 line-height-3 text-color-secondary"
                style={{ textAlign: 'left' }}
                dangerouslySetInnerHTML={{ __html: selectedFaq.answer }}
              />
            </div>
            <div className="flex flex-column gap-3 mt-3 w-full">
              <h2 className="m-0 font-semibold text-center">Was this helpful?</h2>
              <div className="flex justify-content-center gap-2">
                <CPTButton
                  icon="pi pi-thumbs-down"
                  onClick={() => {
                    setFaqDialogVisible(false);
                    // Now proceed to next step
                    const isValid = goToNextStep();
                    if (isValid) {
                      if (window.innerWidth <= 768) {
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                      }
                    }
                  }}
                  className="p-button-primary p-button-rounded"
                  tooltip="No - Continue to form"
                  tooltipOptions={{ position: 'top' }}
                  aria-label="No - Continue to form"
                />
                <CPTButton
                  icon="pi pi-thumbs-up"
                  onClick={() => setFaqDialogVisible(false)}
                  className="p-button-secondary p-button-rounded"
                  tooltip="Yes - Close dialog"
                  tooltipOptions={{ position: 'top' }}
                  aria-label="Yes - Close dialog"
                />
              </div>
            </div>
          </div>
        )}
      </CPTDialog>
    </div>
  );
};
