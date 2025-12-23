'use client';

import { useMemo } from 'react';
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
import { organizeFieldsBySection } from '@/utils/fieldConsolidation';
import { FORM_FIELDS } from '@/constants/formFields';

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

  // Organize required fields by sections
  const requiredFieldsBySection = useMemo(() => {
    return organizeFieldsBySection(requiredFields);
  }, [requiredFields]);

  // Organize optional fields by sections
  // Note: supportingDocumentation and additionalDescription are now required fields when needed,
  // so they will appear in requiredFields, not optionalFields
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

    // Special handling for firstName and lastName - render them side by side
    if (fieldId === 'firstName') {
      const lastNameField = requiredFields.find(f => f.id === 'lastName') || optionalFields.find(f => f.id === 'lastName');
      const lastNameValue = formData.lastName;
      const lastNameError = errors.lastName;
      const lastNameFieldValue = typeof lastNameValue === 'string' ? lastNameValue : '';

      return (
        <div key="name-row" className="flex flex-column md:flex-row gap-2">
          <div className="flex flex-column gap-2 flex-1">
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
          {lastNameField && (
            <div className="flex flex-column gap-2 flex-1">
              <label htmlFor="lastName" className="font-semibold">
                {lastNameField.label}
                {lastNameField.required && <span className="text-red-500"> *</span>}
              </label>
              <CPTInputText
                id="lastName"
                value={lastNameFieldValue}
                onChange={(e: { target: { value: string } }) => {
                  onFieldChange('lastName', e.target.value);
                }}
                onBlur={onFieldBlur
                  ? () => {
                      if (typeof lastNameValue === 'string') {
                        onFieldBlur('lastName', lastNameValue);
                      }
                    }
                  : undefined}
                className={`w-full ${lastNameError ? 'p-invalid' : ''}`}
                placeholder={lastNameField.placeholder}
                aria-required={lastNameField.required}
                aria-invalid={!!lastNameError}
                aria-describedby={lastNameError ? 'lastName-error' : undefined}
              />
              {lastNameField.helpText && (
                <small className="text-color-secondary">{lastNameField.helpText}</small>
              )}
              {lastNameError && (
                <CPTMessage
                  id="lastName-error"
                  severity="error"
                  text={lastNameError}
                  className="mt-1"
                />
              )}
            </div>
          )}
        </div>
      );
    }

    // Skip rendering lastName if we already rendered it with firstName
    if (fieldId === 'lastName') {
      return null;
    }

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
            <label htmlFor={fieldId} className="font-semibold">
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500"> *</span>}
            </label>
            {fieldConfig.helpText && (
              <small className="text-color-secondary">{fieldConfig.helpText}</small>
            )}
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
    <CPTCard className="mt-4" style={{ height: 'auto', overflow: 'visible' }}>
      <div className="flex flex-column gap-4" style={{ height: 'auto', overflow: 'visible' }}>
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
            <CPTPanel header="Optional Fields" toggleable collapsed style={{ overflow: 'visible' }}>
              <div className="flex flex-column gap-3 pt-3" style={{ overflow: 'visible' }}>
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

