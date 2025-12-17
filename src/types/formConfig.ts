// Field types with strict typing
export type FieldType = 'text' | 'email' | 'phone' | 'textarea' | 'file' | 'ssn' | 'address';

export interface FieldValidation {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string) => string | null; // Returns error message or null if valid
}

export interface FieldConfig {
  id: string; // Field ID (e.g., 'firstName', 'cptId', 'email')
  label: string; // Display label (e.g., 'First Name', 'CPT ID')
  type: FieldType;
  required: boolean;
  validation?: FieldValidation;
  placeholder?: string;
  helpText?: string;
  order?: number; // Display order within section (lower numbers appear first)
  section?: string; // Section name (e.g., 'identity', 'request-specific', 'beneficiary')
}

export interface RequestTypeConfig {
  id: string;
  label: string;
  faqLink?: string; // UUID to specific FAQ item (null/undefined = no FAQ)
  requiredFields: string[]; // Array of field IDs
  optionalFields: string[]; // Array of field IDs
  notes?: string;
}

export interface FormFieldMapping {
  [fieldId: string]: FieldConfig;
}

