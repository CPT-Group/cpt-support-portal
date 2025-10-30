'use client';

import { useState, useCallback } from 'react';
import type { SupportRequestFormData, StepIndex } from '@/types';

const initialFormData: SupportRequestFormData = {
  caseId: null,
  firstName: '',
  lastName: '',
  email: '',
  issueTypes: [],
  confirmationEmail: null,
  approximateTime: null,
  description: '',
  files: [],
};

export const useSupportRequestForm = () => {
  const [formData, setFormData] = useState<SupportRequestFormData>(initialFormData);
  const [activeStep, setActiveStep] = useState<StepIndex>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = useCallback((updates: Partial<SupportRequestFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setErrors({});
  }, []);

  const validateStep1 = useCallback((): boolean => {
    if (!formData.caseId) {
      setErrors({ caseId: 'Please select a case' });
      return false;
    }
    setErrors({});
    return true;
  }, [formData.caseId]);

  const validateStep2 = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [formData.firstName, formData.lastName, formData.email]);

  const validateStep3 = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (formData.issueTypes.length === 0) {
      newErrors.issueTypes = 'Please select at least one issue type';
    }
    if (!formData.confirmationEmail) {
      newErrors.confirmationEmail = 'Please select an option';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [formData.issueTypes, formData.confirmationEmail]);

  const validateStep4 = useCallback((): boolean => {
    if (!formData.description.trim()) {
      setErrors({ description: 'Description is required' });
      return false;
    }
    setErrors({});
    return true;
  }, [formData.description]);

  const goToNextStep = useCallback((): boolean => {
    let isValid = false;
    switch (activeStep) {
      case 0:
        isValid = validateStep1();
        break;
      case 1:
        isValid = validateStep2();
        break;
      case 2:
        isValid = validateStep3();
        break;
      case 3:
        isValid = validateStep4();
        break;
    }
    if (isValid && activeStep < 3) {
      setActiveStep((prev) => (prev + 1) as StepIndex);
    }
    return isValid;
  }, [activeStep, validateStep1, validateStep2, validateStep3, validateStep4]);

  const goToPreviousStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prev) => (prev - 1) as StepIndex);
      setErrors({});
    }
  }, [activeStep]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setActiveStep(0);
    setErrors({});
  }, []);

  return {
    formData,
    activeStep,
    errors,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    resetForm,
    validateStep4,
    canGoNext: activeStep < 3,
    canGoPrevious: activeStep > 0,
  };
};

