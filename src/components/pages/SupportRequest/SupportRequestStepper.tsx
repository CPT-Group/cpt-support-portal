'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CPTSteps, CPTButton } from '@cpt-group/cpt-prime-react';
import { useSupportRequestForm } from '@/hooks';
import {
  StepRequestTypeSelection,
  StepCaseSelection,
  StepRequestData,
  StepAdditionalDocumentation,
} from './';
import type { CaseOption, DynamicFormData } from '@/types';
import { CASE_LIST } from '@/constants';
import { generateSubmissionJSON } from '@/utils/jsonGenerator';
import { generateReasonPrefill } from '@/utils/reasonPrefill';
import { REQUEST_TYPES } from '@/constants/requestTypes';

interface SupportRequestStepperProps {
  initialData?: Partial<DynamicFormData>;
}

export const SupportRequestStepper = ({ initialData }: SupportRequestStepperProps) => {
  const router = useRouter();
  const [stepOpacity, setStepOpacity] = useState(1);
  const {
    formData,
    activeStep,
    errors,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    validateField,
    canGoPrevious,
    consolidatedFields,
  } = useSupportRequestForm(initialData);

  useEffect(() => {
    setStepOpacity(0);
    const timer = setTimeout(() => setStepOpacity(1), 50);
    return () => clearTimeout(timer);
  }, [activeStep]);

  const steps = [
    { label: 'Support Request Selection' },
    { label: 'Select Case' },
    { label: 'Support Request Data' },
    { label: 'Additional Documentation' },
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

  const handleFieldChange = (fieldId: string, value: string | File[]) => {
    updateFormData({ [fieldId]: value });
  };

  const handleFieldBlur = (fieldId: string, value: string) => {
    validateField(fieldId, value);
  };

  const handleDescriptionChange = (value: string) => {
    updateFormData({ additionalDescription: value });
  };

  const handleFilesChange = (files: File[]) => {
    updateFormData({ additionalFiles: files });
  };

  const handleSubmit = () => {
    const selectedCase = CASE_LIST.find((c) => c.id === formData.caseId);
    const submissionData = generateSubmissionJSON(formData, selectedCase || null);

    const params = new URLSearchParams({
      firstName: typeof formData.name === 'string' ? formData.name.split(' ')[0] || '' : '',
      caseName: selectedCase?.label || '',
      requestTypes: submissionData.requestTypeLabels?.join(', ') || '',
      submissionData: btoa(JSON.stringify(submissionData)),
    });

    router.push(`/support-request/success?${params.toString()}`);
  };

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
              selectedRequestTypeLabels.length > 0
                ? `Please provide the following information for: ${selectedRequestTypeLabels.join(', ')}`
                : undefined
            }
            selectedCase={selectedCase || null}
          />
        );
      case 3:
        return (
          <StepAdditionalDocumentation
            formData={formData}
            onDescriptionChange={handleDescriptionChange}
            onFilesChange={handleFilesChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-column align-items-center p-4">
      <div className="w-full max-w-screen-lg">
        <CPTSteps model={steps} activeIndex={activeStep} />
        <div
          className="mt-4"
          style={{
            opacity: stepOpacity,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          {renderCurrentStep()}
        </div>
        <div className="flex justify-content-between mt-4">
          <CPTButton
            label="Previous"
            icon="pi pi-arrow-left"
            iconPos="left"
            onClick={goToPreviousStep}
            disabled={!canGoPrevious}
            className="p-button-secondary"
          />
          {activeStep === 3 ? (
            <CPTButton
              label="Submit"
              icon="pi pi-check"
              iconPos="right"
              onClick={() => {
                const isValid = goToNextStep();
                if (isValid) {
                  handleSubmit();
                }
              }}
              className="p-button-primary"
            />
          ) : (
            <CPTButton
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={goToNextStep}
              className="p-button-primary"
            />
          )}
        </div>
      </div>
    </div>
  );
};
