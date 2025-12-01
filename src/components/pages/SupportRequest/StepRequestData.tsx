'use client';

import { useMemo, useEffect } from 'react';
import {
  CPTCard,
  CPTFieldset,
  CPTInputText,
  CPTInputTextarea,
  CPTInputMask,
  CPTMessage,
  CPTPanel,
  CPTDivider,
} from '@cpt-group/cpt-prime-react';
import type { InputMaskChangeEvent } from 'primereact/inputmask';
import type { FieldConfig } from '@/types/formConfig';
import type { DynamicFormData, CaseOption } from '@/types/supportRequest';
import { SupportFileUpload } from '@/components/common/SupportFileUpload';
import { CPTAddressBlock } from '@/components/inputs';
import { generateReasonPrefill } from '@/utils/reasonPrefill';
import { organizeFieldsBySection } from '@/utils/fieldConsolidation';
import { CASE_LIST } from '@/constants';

interface StepRequestDataProps {
  formData: DynamicFormData;
  requiredFields: FieldConfig[];
  optionalFields: FieldConfig[];
  errors: Record<string, string>;
  onFieldChange: (fieldId: string, value: string | File[]) => void;
  onFieldBlur?: (fieldId: string, value: string) => void;
  title?: string;
  description?: string;
  selectedCase?: CaseOption | null;
}

export const StepRequestData = ({
  formData,
  requiredFields,
  optionalFields,
  errors,
  onFieldChange,
  onFieldBlur,
  title,
  description,
  selectedCase,
}: StepRequestDataProps) => {
  // Pre-fill reason field if it's required and empty, and we have both request types and case
  useEffect(() => {
    const reasonField = requiredFields.find((f) => f.id === 'reason');
    if (
      reasonField &&
      (!formData.reason || (typeof formData.reason === 'string' && formData.reason.trim() === '')) &&
      formData.requestTypes &&
      formData.requestTypes.length > 0 &&
      formData.caseId
    ) {
      const caseOption = selectedCase || CASE_LIST.find((c) => c.id === formData.caseId);
      if (caseOption) {
        const reasonText = generateReasonPrefill(formData, caseOption);
        if (reasonText) {
          onFieldChange('reason', reasonText);
        }
      }
    }
  }, [formData.requestTypes, formData.caseId, requiredFields, selectedCase, formData.reason, onFieldChange]);

  // Organize required fields by sections
  const requiredFieldsBySection = useMemo(() => {
    return organizeFieldsBySection(requiredFields);
  }, [requiredFields]);

  // Organize optional fields by sections
  const optionalFieldsBySection = useMemo(() => {
    return organizeFieldsBySection(optionalFields);
  }, [optionalFields]);

  const renderField = (fieldConfig: FieldConfig) => {
    const fieldId = fieldConfig.id;
    const value = formData[fieldId];
    const error = errors[fieldId];
    const fieldValue = typeof value === 'string' ? value : '';

    const commonProps = {
      id: fieldId,
      value: fieldValue,
      onChange: (e: { target: { value: string } }) => {
        onFieldChange(fieldId, e.target.value);
      },
      onBlur: onFieldBlur
        ? () => {
            if (typeof value === 'string') {
              onFieldBlur(fieldId, value);
            }
          }
        : undefined,
      className: `w-full ${error ? 'p-invalid' : ''}`,
      placeholder: fieldConfig.placeholder,
      'aria-required': fieldConfig.required,
      'aria-invalid': !!error,
      'aria-describedby': error ? `${fieldId}-error` : undefined,
    };

    switch (fieldConfig.type) {
      case 'email':
        return (
          <div key={fieldId} className="flex flex-column gap-2">
            <label htmlFor={fieldId} className="font-semibold">
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500"> *</span>}
            </label>
            <CPTInputText {...commonProps} type="email" />
            {fieldConfig.helpText && (
              <small className="text-color-secondary">{fieldConfig.helpText}</small>
            )}
            {error && (
              <CPTMessage
                id={`${fieldId}-error`}
                severity="error"
                text={error}
                className="mt-1"
              />
            )}
          </div>
        );

      case 'phone':
        return (
          <div key={fieldId} className="flex flex-column gap-2">
            <label htmlFor={fieldId} className="font-semibold">
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500"> *</span>}
            </label>
            <CPTInputMask
              id={fieldId}
              value={fieldValue}
              onChange={(e: InputMaskChangeEvent) => {
                const newValue = typeof e.value === 'string' ? e.value : '';
                onFieldChange(fieldId, newValue);
              }}
              onBlur={onFieldBlur ? () => onFieldBlur(fieldId, fieldValue) : undefined}
              mask="(999) 999-9999"
              placeholder="(123) 456-7890"
              className={`w-full ${error ? 'p-invalid' : ''}`}
              aria-required={fieldConfig.required}
              aria-invalid={!!error}
              aria-describedby={error ? `${fieldId}-error` : undefined}
            />
            {fieldConfig.helpText && (
              <small className="text-color-secondary">{fieldConfig.helpText}</small>
            )}
            {error && (
              <CPTMessage
                id={`${fieldId}-error`}
                severity="error"
                text={error}
                className="mt-1"
              />
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={fieldId} className="flex flex-column gap-2">
            <label htmlFor={fieldId} className="font-semibold">
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500"> *</span>}
            </label>
            <CPTInputTextarea
              {...commonProps}
              rows={4}
              autoResize
            />
            {fieldConfig.helpText && (
              <small className="text-color-secondary">{fieldConfig.helpText}</small>
            )}
            {error && (
              <CPTMessage
                id={`${fieldId}-error`}
                severity="error"
                text={error}
                className="mt-1"
              />
            )}
          </div>
        );

      case 'ssn':
        return (
          <div key={fieldId} className="flex flex-column gap-2">
            <label htmlFor={fieldId} className="font-semibold">
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500"> *</span>}
            </label>
            <CPTInputMask
              id={fieldId}
              value={fieldValue}
              onChange={(e: InputMaskChangeEvent) => {
                const newValue = typeof e.value === 'string' ? e.value : '';
                onFieldChange(fieldId, newValue);
              }}
              onBlur={onFieldBlur ? () => onFieldBlur(fieldId, fieldValue) : undefined}
              mask="999-99-9999"
              placeholder="XXX-XX-XXXX"
              className={`w-full ${error ? 'p-invalid' : ''}`}
              aria-required={fieldConfig.required}
              aria-invalid={!!error}
              aria-describedby={error ? `${fieldId}-error` : undefined}
            />
            {fieldConfig.helpText && (
              <small className="text-color-secondary">{fieldConfig.helpText}</small>
            )}
            {error && (
              <CPTMessage
                id={`${fieldId}-error`}
                severity="error"
                text={error}
                className="mt-1"
              />
            )}
          </div>
        );

      case 'address':
        return (
          <div key={fieldId} className="flex flex-column gap-2">
            <CPTAddressBlock
              id={fieldId}
              value={fieldValue}
              onChange={(address) => onFieldChange(fieldId, address)}
              onBlur={onFieldBlur ? () => onFieldBlur(fieldId, fieldValue) : undefined}
              label={fieldConfig.label}
              required={fieldConfig.required}
              placeholder={fieldConfig.placeholder}
              error={error}
              helpText={fieldConfig.helpText}
            />
          </div>
        );

      case 'file':
        const fileValue = Array.isArray(value) && value[0] instanceof File ? (value as File[]) : [];
        return (
          <div key={fieldId} className="flex flex-column gap-2">
            <SupportFileUpload
              files={fileValue}
              onFilesChange={(files) => onFieldChange(fieldId, files)}
              label={fieldConfig.label}
              maxFileSize={5000000} // 5MB
              accept="*/*"
              multiple
            />
            {error && (
              <CPTMessage
                id={`${fieldId}-error`}
                severity="error"
                text={error}
                className="mt-1"
              />
            )}
          </div>
        );

      case 'text':
      default:
        return (
          <div key={fieldId} className="flex flex-column gap-2">
            <label htmlFor={fieldId} className="font-semibold">
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500"> *</span>}
            </label>
            <CPTInputText {...commonProps} />
            {fieldConfig.helpText && (
              <small className="text-color-secondary">{fieldConfig.helpText}</small>
            )}
            {error && (
              <CPTMessage
                id={`${fieldId}-error`}
                severity="error"
                text={error}
                className="mt-1"
              />
            )}
          </div>
        );
    }
  };

  return (
    <CPTCard className="mt-4">
      <div className="flex flex-column gap-4">
        {(title || description) && (
          <div className="mb-3">
            {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
            {description && (
              <p className="text-color-secondary line-height-3">{description}</p>
            )}
          </div>
        )}

        {/* Required Fields by Section */}
        {requiredFieldsBySection.map((section, sectionIndex) => {
          if (section.fields.length === 0) return null;

          return (
            <div key={section.section}>
              {sectionIndex > 0 && <CPTDivider />}
              <CPTFieldset legend={section.label}>
                <div className="flex flex-column gap-3">
                  {section.fields.map((field) => renderField(field))}
                </div>
              </CPTFieldset>
            </div>
          );
        })}

        {/* Optional Fields by Section */}
        {optionalFieldsBySection.length > 0 && (
          <>
            {requiredFieldsBySection.length > 0 && <CPTDivider />}
            <CPTPanel header="Optional Fields" toggleable collapsed>
              <div className="flex flex-column gap-3 pt-3">
                {optionalFieldsBySection.map((section) => (
                  <div key={section.section} className="flex flex-column gap-3">
                    {section.fields.length > 0 && section.section !== 'optional' && (
                      <h4 className="text-lg font-semibold mt-0 mb-2">{section.label}</h4>
                    )}
                    {section.fields.map((field) => renderField(field))}
                  </div>
                ))}
              </div>
            </CPTPanel>
          </>
        )}

        {/* General Error Message */}
        {errors._general && (
          <CPTMessage severity="error" text={errors._general} className="mt-2" />
        )}
      </div>
    </CPTCard>
  );
};

