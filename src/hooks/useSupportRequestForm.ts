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
    const updatedKeys = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedKeys.forEach((key) => {
        delete newErrors[key];
      });
      return newErrors;
    });
  }, []);

  const validateField = useCallback((field: string) => {
    const newErrors: Record<string, string> = {};
    switch (field) {
      case 'firstName':
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        break;
      case 'lastName':
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
        break;
      case 'email':
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
    } else {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  }, [formData.firstName, formData.lastName, formData.email]);

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
    const newErrors: Record<string, string> = {};

    switch (activeStep) {
      case 0:
        if (!formData.caseId) {
          setErrors({ caseId: 'Please select a case' });
          return false;
        }
        isValid = true;
        setErrors({});
        break;
      case 1:
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
        isValid = true;
        setErrors({});
        break;
      case 2:
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
        isValid = true;
        setErrors({});
        break;
      case 3:
        if (!formData.description.trim()) {
          setErrors({ description: 'Description is required' });
          return false;
        }
        isValid = true;
        setErrors({});
        break;
    }
    if (isValid && activeStep < 3) {
      setActiveStep((prev) => {
        const nextStep = prev + 1;
        return (Math.min(nextStep, 3)) as StepIndex;
      });
    }
    return isValid;
  }, [activeStep, formData.caseId, formData.firstName, formData.lastName, formData.email, formData.issueTypes, formData.confirmationEmail, formData.description]);

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
    validateField,
    canGoPrevious: activeStep > 0,
  };
};

