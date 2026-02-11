'use client';

import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputMask } from 'primereact/inputmask';
import { Message } from 'primereact/message';
import type { InputMaskChangeEvent } from 'primereact/inputmask';
import type { FieldConfig } from '@/types/formConfig';
import type { DynamicFormData } from '@/types/supportRequest';
import { SupportFileUpload } from '@/components/common/SupportFileUpload';
import { CPTAddressBlock } from '@/components/inputs';

interface SupportRequestFieldProps {
  fieldConfig: FieldConfig;
  formData: DynamicFormData;
  errors: Record<string, string>;
  onFieldChange: (fieldId: string, value: string | File[]) => void;
  onFieldBlur?: (fieldId: string, value: string) => void;
  requiredFields: FieldConfig[];
  optionalFields: FieldConfig[];
}

const buildCommonProps = (
  fieldId: string,
  fieldValue: string,
  error: string | undefined,
  fieldConfig: FieldConfig,
  onFieldChange: (fieldId: string, value: string | File[]) => void,
  onFieldBlur?: (fieldId: string, value: string) => void
) => ({
  id: fieldId,
  value: fieldValue,
  onChange: (e: { target: { value: string } }) => onFieldChange(fieldId, e.target.value),
  onBlur: onFieldBlur ? () => onFieldBlur(fieldId, fieldValue) : undefined,
  className: `w-full ${error ? 'p-invalid' : ''}`,
  placeholder: fieldConfig.placeholder,
  'aria-required': fieldConfig.required,
  'aria-invalid': !!error,
  'aria-describedby': error ? `${fieldId}-error` : undefined,
});

const FieldLabel = ({
  fieldId,
  label,
  required,
}: {
  fieldId: string;
  label: string;
  required: boolean;
}) => (
  <label htmlFor={fieldId} className="font-semibold">
    {label}
    {required && <span className="text-red-500"> *</span>}
  </label>
);

const FieldError = ({ fieldId, error }: { fieldId: string; error: string }) => (
  <Message id={`${fieldId}-error`} severity="error" text={error} className="mt-1" />
);

export const SupportRequestField = ({
  fieldConfig,
  formData,
  errors,
  onFieldChange,
  onFieldBlur,
  requiredFields,
  optionalFields,
}: SupportRequestFieldProps) => {
  const fieldId = fieldConfig.id;
  const value = formData[fieldId];
  const error = errors[fieldId];
  const fieldValue = typeof value === 'string' ? value : '';
  const commonProps = buildCommonProps(
    fieldId,
    fieldValue,
    error,
    fieldConfig,
    onFieldChange,
    onFieldBlur
  );

  if (fieldId === 'firstName') {
    const lastNameField =
      requiredFields.find((f) => f.id === 'lastName') ||
      optionalFields.find((f) => f.id === 'lastName');
    const lastNameValue = formData.lastName;
    const lastNameError = errors.lastName;
    const lastNameFieldValue = typeof lastNameValue === 'string' ? lastNameValue : '';

    return (
      <div key="name-row" className="flex flex-column md:flex-row gap-2">
        <div className="flex flex-column gap-2 flex-1">
          <FieldLabel fieldId={fieldId} label={fieldConfig.label} required={!!fieldConfig.required} />
          <InputText {...commonProps} />
          {fieldConfig.helpText && (
            <small className="text-color-secondary">{fieldConfig.helpText}</small>
          )}
          {error && <FieldError fieldId={fieldId} error={error} />}
        </div>
        {lastNameField && (
          <div className="flex flex-column gap-2 flex-1">
            <FieldLabel
              fieldId="lastName"
              label={lastNameField.label}
              required={!!lastNameField.required}
            />
            <InputText
              id="lastName"
              value={lastNameFieldValue}
              onChange={(e: { target: { value: string } }) => onFieldChange('lastName', e.target.value)}
              onBlur={
                onFieldBlur
                  ? () => {
                      if (typeof lastNameValue === 'string') {
                        onFieldBlur('lastName', lastNameValue);
                      }
                    }
                  : undefined
              }
              className={`w-full ${lastNameError ? 'p-invalid' : ''}`}
              placeholder={lastNameField.placeholder}
              aria-required={lastNameField.required}
              aria-invalid={!!lastNameError}
              aria-describedby={lastNameError ? 'lastName-error' : undefined}
            />
            {lastNameField.helpText && (
              <small className="text-color-secondary">{lastNameField.helpText}</small>
            )}
            {lastNameError && <FieldError fieldId="lastName" error={lastNameError} />}
          </div>
        )}
      </div>
    );
  }

  if (fieldId === 'lastName') {
    return null;
  }

  if (fieldId === 'email') {
    const phoneField =
      requiredFields.find((f) => f.id === 'phone') || optionalFields.find((f) => f.id === 'phone');
    const phoneValue = formData.phone;
    const phoneError = errors.phone;
    const phoneFieldValue = typeof phoneValue === 'string' ? phoneValue : '';

    return (
      <div key="email-phone-row" className="flex flex-column md:flex-row gap-2">
        <div className="flex flex-column gap-2 flex-1 min-w-0">
          <FieldLabel fieldId={fieldId} label={fieldConfig.label} required={!!fieldConfig.required} />
          <InputText {...commonProps} type="email" />
          {fieldConfig.helpText && (
            <small className="text-color-secondary">{fieldConfig.helpText}</small>
          )}
          {error && <FieldError fieldId={fieldId} error={error} />}
        </div>
        {phoneField && (
          <div className="flex flex-column gap-2 flex-shrink-0" style={{ width: '14rem' }}>
            <FieldLabel
              fieldId="phone"
              label={phoneField.label}
              required={!!phoneField.required}
            />
            <InputMask
              id="phone"
              value={phoneFieldValue}
              onChange={(e: InputMaskChangeEvent) => {
                const newValue = typeof e.value === 'string' ? e.value : '';
                onFieldChange('phone', newValue);
              }}
              onBlur={
                onFieldBlur
                  ? () => {
                      if (typeof phoneValue === 'string') {
                        onFieldBlur('phone', phoneValue);
                      }
                    }
                  : undefined
              }
              mask="(999) 999-9999"
              placeholder="(123) 456-7890"
              className={`w-full ${phoneError ? 'p-invalid' : ''}`}
              aria-required={phoneField.required}
              aria-invalid={!!phoneError}
              aria-describedby={phoneError ? 'phone-error' : undefined}
            />
            {phoneField.helpText && (
              <small className="text-color-secondary">{phoneField.helpText}</small>
            )}
            {phoneError && <FieldError fieldId="phone" error={phoneError} />}
          </div>
        )}
      </div>
    );
  }

  if (fieldId === 'phone') {
    const emailInSection =
      requiredFields.some((f) => f.id === 'email') || optionalFields.some((f) => f.id === 'email');
    if (emailInSection) return null;
    return (
      <div key={fieldId} className="flex flex-column gap-2" style={{ width: '14rem' }}>
        <FieldLabel fieldId={fieldId} label={fieldConfig.label} required={!!fieldConfig.required} />
        <InputMask
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
        {error && <FieldError fieldId={fieldId} error={error} />}
      </div>
    );
  }

  const fieldWrapper = (content: React.ReactNode) => (
    <div key={fieldId} className="flex flex-column gap-2">
      <FieldLabel fieldId={fieldId} label={fieldConfig.label} required={!!fieldConfig.required} />
      {content}
      {fieldConfig.helpText && (
        <small className="text-color-secondary">{fieldConfig.helpText}</small>
      )}
      {error && <FieldError fieldId={fieldId} error={error} />}
    </div>
  );

  switch (fieldConfig.type) {
    case 'textarea':
      return fieldWrapper(
        <InputTextarea {...commonProps} rows={4} autoResize />
      );

    case 'ssn':
      return fieldWrapper(
        <InputMask
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
      );

    case 'address':
      return fieldWrapper(
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
          hideLabel
        />
      );

    case 'file': {
      const fileValue =
        Array.isArray(value) && value[0] instanceof File ? (value as File[]) : [];
      return (
        <div key={fieldId} className="flex flex-column gap-2">
          <FieldLabel fieldId={fieldId} label={fieldConfig.label} required={!!fieldConfig.required} />
          {fieldConfig.helpText && (
            <small className="text-color-secondary">{fieldConfig.helpText}</small>
          )}
          <SupportFileUpload
            files={fileValue}
            onFilesChange={(files) => onFieldChange(fieldId, files)}
            label={fieldConfig.label}
            maxFileSize={5000000}
            accept="*/*"
            multiple
          />
          {error && <FieldError fieldId={fieldId} error={error} />}
        </div>
      );
    }

    case 'text':
    default:
      return fieldWrapper(<InputText {...commonProps} />);
  }
};
