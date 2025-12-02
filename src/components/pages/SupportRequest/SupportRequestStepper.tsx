'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CPTSteps, CPTButton } from '@cpt-group/cpt-prime-react';
import { Toast } from 'primereact/toast';
import { useSupportRequestForm } from '@/hooks';
import {
  StepRequestTypeSelection,
  StepCaseSelection,
  StepRequestData,
} from './';
import type { CaseOption, DynamicFormData } from '@/types';
import { CASE_LIST } from '@/constants';
import { generateSubmissionJSON } from '@/utils/jsonGenerator';
import { generateReasonPrefill } from '@/utils/reasonPrefill';
import { REQUEST_TYPES } from '@/constants/requestTypes';

interface SupportRequestStepperProps {
  initialData?: Partial<DynamicFormData>;
  onStepChange?: (step: number) => void;
}

export const SupportRequestStepper = ({ initialData, onStepChange }: SupportRequestStepperProps) => {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [stepOpacity, setStepOpacity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    
    // Pre-fill reason field when request types are selected and case is already selected
    if (selectedIds.length > 0 && formData.caseId) {
      const selectedCase = CASE_LIST.find((c) => c.id === formData.caseId);
      if (selectedCase) {
        const updatedFormData = { ...formData, requestTypes: selectedIds };
        const reasonText = generateReasonPrefill(updatedFormData, selectedCase);
        if (reasonText && !formData.reason) {
          updateFormData({ reason: reasonText });
        }
      }
    }
  };

  const handleCaseChange = (caseOption: CaseOption | null) => {
    updateFormData({ caseId: caseOption?.id || null });
    
    // Pre-fill reason field when case is selected and request types are already selected
    if (caseOption && formData.requestTypes && formData.requestTypes.length > 0) {
      const reasonText = generateReasonPrefill(formData, caseOption);
      if (reasonText && !formData.reason) {
        updateFormData({ reason: reasonText });
      }
    }
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
        firstName: typeof formData.name === 'string' ? formData.name.split(' ')[0] || '' : '',
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
    </div>
  );
};
