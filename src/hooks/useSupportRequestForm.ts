'use client';

import { useState, useCallback } from 'react';
import type { DynamicFormData, StepIndex } from '@/types/supportRequest';
import { consolidateFields } from '@/utils/fieldConsolidation';
import { validateRequiredFields, getMissingFieldLabels } from '@/utils/jsonGenerator';
import { FORM_FIELDS } from '@/constants/formFields';

const createInitialFormData = (initialData?: Partial<DynamicFormData>): DynamicFormData => {
  return {
    caseId: initialData?.caseId || null,
    requestTypes: initialData?.requestTypes || [],
    ...initialData,
  };
};

export const useSupportRequestForm = (initialData?: Partial<DynamicFormData>) => {
  const [formData, setFormData] = useState<DynamicFormData>(() =>
    createInitialFormData(initialData)
  );
  const [activeStep, setActiveStep] = useState<StepIndex>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = useCallback((updates: Partial<DynamicFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedKeys = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedKeys.forEach((key) => {
        delete newErrors[key];
      });
      return newErrors;
    });
  }, []);

  const validateField = useCallback(
    (fieldId: string, value: string | string[] | File[] | null | undefined) => {
      const fieldConfig = FORM_FIELDS[fieldId];
      if (!fieldConfig) {
        return null; // Unknown field, skip validation
      }

      const errorMessages: string[] = [];

      // Check required
      if (fieldConfig.required) {
        if (
          value === null ||
          value === undefined ||
          (typeof value === 'string' && value.trim() === '') ||
          (Array.isArray(value) && value.length === 0)
        ) {
          errorMessages.push(`${fieldConfig.label} is required`);
        }
      }

      // Only validate if value exists
      if (value && typeof value === 'string' && value.trim() !== '') {
        const stringValue = value.trim();

        // Skip minLength validation for address fields - just check they exist
        if (fieldConfig.type !== 'address' && fieldConfig.validation?.minLength && stringValue.length < fieldConfig.validation.minLength) {
          errorMessages.push(
            `${fieldConfig.label} must be at least ${fieldConfig.validation.minLength} characters`
          );
        }

        // Check maxLength
        if (fieldConfig.validation?.maxLength && stringValue.length > fieldConfig.validation.maxLength) {
          errorMessages.push(
            `${fieldConfig.label} must be no more than ${fieldConfig.validation.maxLength} characters`
          );
        }

        // Check pattern (skip for address fields)
        if (fieldConfig.type !== 'address' && fieldConfig.validation?.pattern && !fieldConfig.validation.pattern.test(stringValue)) {
          if (fieldConfig.type === 'email') {
            errorMessages.push('Please enter a valid email address');
          } else if (fieldConfig.type === 'phone') {
            errorMessages.push('Please enter a valid phone number');
          } else if (fieldConfig.type === 'ssn') {
            errorMessages.push('Please enter a valid SSN or Tax ID');
          } else {
            errorMessages.push(`Please enter a valid ${fieldConfig.label.toLowerCase()}`);
          }
        }

        // Custom validation (skip for address fields)
        if (fieldConfig.type !== 'address' && fieldConfig.validation?.custom) {
          const customError = fieldConfig.validation.custom(stringValue);
          if (customError) {
            errorMessages.push(customError);
          }
        }
      }

      const errorMessage = errorMessages.length > 0 ? errorMessages[0] : null;

      setErrors((prev) => {
        if (errorMessage) {
          return { ...prev, [fieldId]: errorMessage };
        } else {
          const newErrors = { ...prev };
          delete newErrors[fieldId];
          return newErrors;
        }
      });

      return errorMessage;
    },
    []
  );

  const validateStep = useCallback(
    (step: StepIndex): boolean => {
      const newErrors: Record<string, string> = {};

      switch (step) {
        case 0: // Request Type Selection
          if (!formData.requestTypes || formData.requestTypes.length === 0) {
            newErrors.requestTypes = 'Please select at least one request type';
            setErrors(newErrors);
            return false;
          }
          break;

        case 1: // Case Selection
          if (!formData.caseId) {
            newErrors.caseId = 'Please select a case';
            setErrors(newErrors);
            return false;
          }
          break;

        case 2: // Request Data (includes optional additional documentation)
          // Validate all required fields for selected request types
          const missingFields = validateRequiredFields(formData, formData.requestTypes || []);
          if (missingFields.length > 0) {
            const missingLabels = getMissingFieldLabels(missingFields);
            newErrors._general = `Please fill in all required fields: ${missingLabels.join(', ')}`;
            
            // Also mark individual fields as required
            missingFields.forEach((fieldId) => {
              const fieldConfig = FORM_FIELDS[fieldId];
              if (fieldConfig) {
                newErrors[fieldId] = `${fieldConfig.label} is required`;
              }
            });
            
            setErrors(newErrors);
            return false;
          }

          // Validate all required fields that have values
          const { required, optional } = consolidateFields(formData.requestTypes || []);
          
          // Validate required fields
          required.forEach((fieldConfig) => {
            const value = formData[fieldConfig.id];
            const error = validateField(fieldConfig.id, value);
            if (error) {
              newErrors[fieldConfig.id] = error;
            }
          });
          
          // Validate optional fields only if they have values
          optional.forEach((fieldConfig) => {
            const value = formData[fieldConfig.id];
            // Only validate optional fields if they have a value
            if (value !== null && value !== undefined && 
                ((typeof value === 'string' && value.trim() !== '') ||
                (Array.isArray(value) && value.length > 0))) {
              const error = validateField(fieldConfig.id, value);
              if (error) {
                newErrors[fieldConfig.id] = error;
              }
            }
          });
          break;
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
      }

      setErrors({});
      return true;
    },
    [formData, validateField]
  );

  const goToNextStep = useCallback((): boolean => {
    const isValid = validateStep(activeStep);
    if (isValid && activeStep < 2) {
      setActiveStep((prev) => {
        const nextStep = prev + 1;
        return (Math.min(nextStep, 2) as StepIndex);
      });
    }
    return isValid;
  }, [activeStep, validateStep]);

  const goToPreviousStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prev) => (prev - 1) as StepIndex);
      setErrors({});
    }
  }, [activeStep]);

  const resetForm = useCallback(() => {
    setFormData(createInitialFormData());
    setActiveStep(0);
    setErrors({});
  }, []);

  // Get consolidated fields for current request types
  const consolidatedFields = consolidateFields(formData.requestTypes || []);

  return {
    formData,
    activeStep,
    errors,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    resetForm,
    validateField,
    validateStep,
    canGoPrevious: activeStep > 0,
    consolidatedFields,
  };
};

