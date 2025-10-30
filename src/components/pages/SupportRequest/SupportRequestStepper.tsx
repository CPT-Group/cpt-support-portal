'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CPTSteps, CPTButton } from '@/components/input';
import { useSupportRequestForm } from '@/hooks';
import {
  StepCaseSelection,
  StepPersonalInfo,
  StepIssueDetails,
  StepDescriptionUpload,
} from './';
import type { CaseOption, ConfirmationEmailOption } from '@/types';
import { CASE_LIST, ISSUE_TYPE_OPTIONS } from '@/constants';

export const SupportRequestStepper = () => {
  const router = useRouter();
  const [stepOpacity, setStepOpacity] = useState(1);
  const {
    formData,
    activeStep,
    errors,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    validateStep4,
    validateField,
    canGoPrevious,
  } = useSupportRequestForm();

  useEffect(() => {
    setStepOpacity(0);
    const timer = setTimeout(() => setStepOpacity(1), 50);
    return () => clearTimeout(timer);
  }, [activeStep]);

  const steps = [
    { label: 'Case Selection' },
    { label: 'Personal Information' },
    { label: 'Issue Details' },
    { label: 'Description & Upload' },
  ];

  const handleCaseChange = (caseOption: CaseOption | null) => {
    updateFormData({ caseId: caseOption?.id || null });
  };

  const handleFieldChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleIssueTypesChange = (selectedIds: string[]) => {
    updateFormData({ issueTypes: selectedIds });
  };

  const handleConfirmationEmailChange = (option: ConfirmationEmailOption | null) => {
    updateFormData({ confirmationEmail: option?.value || null });
  };

  const handleApproximateTimeChange = (date: Date | null) => {
    updateFormData({ approximateTime: date });
  };

  const handleDescriptionChange = (value: string) => {
    updateFormData({ description: value });
  };

  const handleFilesChange = (files: File[]) => {
    updateFormData({ files });
  };

  const handleSubmit = () => {
    const selectedCase = CASE_LIST.find((c) => c.id === formData.caseId);
    const issueTypesLabels = formData.issueTypes
      .map((id) => {
        const option = ISSUE_TYPE_OPTIONS.find((opt) => opt.id === id);
        return option?.label;
      })
      .filter(Boolean)
      .join(', ');

    const params = new URLSearchParams({
      firstName: formData.firstName,
      caseName: selectedCase?.label || '',
      issueTypes: issueTypesLabels,
    });

    router.push(`/support-request/success?${params.toString()}`);
  };

  const renderCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepCaseSelection
            selectedCaseId={formData.caseId}
            error={errors.caseId}
            onCaseChange={handleCaseChange}
          />
        );
      case 1:
        return (
          <StepPersonalInfo
            firstName={formData.firstName}
            lastName={formData.lastName}
            email={formData.email}
            errors={errors}
            onFieldChange={handleFieldChange}
            onFieldBlur={validateField}
          />
        );
      case 2:
        return (
          <StepIssueDetails
            issueTypes={formData.issueTypes}
            confirmationEmail={formData.confirmationEmail}
            approximateTime={formData.approximateTime}
            errors={errors}
            onIssueTypesChange={handleIssueTypesChange}
            onConfirmationEmailChange={handleConfirmationEmailChange}
            onApproximateTimeChange={handleApproximateTimeChange}
          />
        );
      case 3:
        return (
          <StepDescriptionUpload
            description={formData.description}
            files={formData.files}
            error={errors.description}
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
                const isValid = validateStep4();
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

