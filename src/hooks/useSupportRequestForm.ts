'use client';

import { useState, useCallback } from 'react';
import type { DynamicFormData, StepIndex } from '@/types/supportRequest';
import type { FieldConfig } from '@/types/formConfig';
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

/** Derive initial step from URL params: requestType + case → step 2; requestType only → step 1; else step 0. */
function getInitialStep(initialData?: Partial<DynamicFormData>): StepIndex {
  const hasRequestTypes = (initialData?.requestTypes?.length ?? 0) > 0;
  const hasCase = initialData?.caseId != null && initialData.caseId !== '';
  if (hasRequestTypes && hasCase) return 2;
  if (hasRequestTypes) return 1;
  return 0;
}

/**
 * Pure validation: returns the first error message for a field, or null if valid.
 * No side effects — does not call setErrors.
 */
function getFieldValidationError(
  value: string | string[] | File[] | null | undefined,
  fieldConfig: FieldConfig
): string | null {
  const errorMessages: string[] = [];

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

  if (value && typeof value === 'string' && value.trim() !== '') {
    const stringValue = value.trim();

    if (fieldConfig.type !== 'address' && fieldConfig.validation?.minLength && stringValue.length < fieldConfig.validation.minLength) {
      errorMessages.push(
        `${fieldConfig.label} must be at least ${fieldConfig.validation.minLength} characters`
      );
    }

    if (fieldConfig.validation?.maxLength && stringValue.length > fieldConfig.validation.maxLength) {
      errorMessages.push(
        `${fieldConfig.label} must be no more than ${fieldConfig.validation.maxLength} characters`
      );
    }

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

    if (fieldConfig.type !== 'address' && fieldConfig.validation?.custom) {
      const customError = fieldConfig.validation.custom(stringValue);
      if (customError) {
        errorMessages.push(customError);
      }
    }
  }

  return errorMessages.length > 0 ? errorMessages[0] : null;
}

export const useSupportRequestForm = (initialData?: Partial<DynamicFormData>) => {
  const [formData, setFormData] = useState<DynamicFormData>(() =>
    createInitialFormData(initialData)
  );
  const [activeStep, setActiveStep] = useState<StepIndex>(() =>
    getInitialStep(initialData)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = useCallback((updates: Partial<DynamicFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    const updatedKeys = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedKeys.forEach((key) => {
        delete newErrors[key];
      });
      // Always clear the summary error when the user edits any field — it's stale
      // and will be regenerated on the next submit attempt if needed.
      delete newErrors._general;
      return newErrors;
    });
  }, []);

  /** Validates a single field and updates error state. Used for on-blur validation. */
  const validateField = useCallback(
    (fieldId: string, value: string | string[] | File[] | null | undefined, providedFieldConfig?: FieldConfig) => {
      const fieldConfig = providedFieldConfig || FORM_FIELDS[fieldId];
      if (!fieldConfig) {
        return null;
      }

      const errorMessage = getFieldValidationError(value, fieldConfig);

      setErrors((prev) => {
        if (errorMessage) {
          return { ...prev, [fieldId]: errorMessage };
        } else {
          const next = { ...prev };
          delete next[fieldId];
          return next;
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

        case 2: {
          const missingFields = validateRequiredFields(formData, formData.requestTypes || []);
          if (missingFields.length > 0) {
            const missingLabels = getMissingFieldLabels(missingFields);
            newErrors._general = `Please fill in all required fields: ${missingLabels.join(', ')}`;

            missingFields.forEach((fieldId) => {
              const fieldConfig = FORM_FIELDS[fieldId];
              if (fieldConfig) {
                newErrors[fieldId] = `${fieldConfig.label} is required`;
              }
            });

            setErrors(newErrors);
            return false;
          }

          // Pure validation pass — uses getFieldValidationError (no setErrors side effects)
          // so the only setErrors call is the single one at the end of this function.
          const { required, optional } = consolidateFields(formData.requestTypes || []);

          required.forEach((fieldConfig) => {
            const error = getFieldValidationError(formData[fieldConfig.id], fieldConfig);
            if (error) {
              newErrors[fieldConfig.id] = error;
            }
          });

          optional.forEach((fieldConfig) => {
            const value = formData[fieldConfig.id];
            const hasValue =
              value !== null &&
              value !== undefined &&
              ((typeof value === 'string' && value.trim() !== '') ||
                (Array.isArray(value) && value.length > 0));
            if (hasValue) {
              const error = getFieldValidationError(value, fieldConfig);
              if (error) {
                newErrors[fieldConfig.id] = error;
              }
            }
          });
          break;
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
      }

      setErrors({});
      return true;
    },
    [formData]
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

