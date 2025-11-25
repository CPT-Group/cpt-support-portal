// Field types with strict typing
export type FieldType = 'text' | 'email' | 'phone' | 'textarea' | 'file' | 'ssn';

export interface FieldValidation {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string) => string | null; // Returns error message or null if valid
}

export interface FieldConfig {
  id: string; // Normalized ID (e.g., 'name', 'cptId', 'email')
  label: string; // Display label (e.g., 'Name', 'CPT ID')
  type: FieldType;
  required: boolean;
  validation?: FieldValidation;
  placeholder?: string;
  helpText?: string;
}

export interface RequestTypeConfig {
  id: string;
  label: string;
  faqReference?: string;
  requiredFields: string[]; // Array of normalized field IDs
  optionalFields: string[]; // Array of normalized field IDs
  notes?: string;
}

export interface FormFieldMapping {
  [normalizedId: string]: FieldConfig;
}

// Field normalization map: CSV field names → Normalized IDs
export const FIELD_NORMALIZATION_MAP: Record<string, string> = {
  'Name': 'name',
  'CPT ID': 'cptId',
  'Email Address': 'email',
  'Phone': 'phone',
  'Mailing Address': 'mailingAddress',
  'Previous Address': 'previousAddress',
  'New Address': 'newAddress',
  'Previous Name': 'previousName',
  'New Name': 'newName',
  'Reason': 'reason',
  'Address': 'address',
  'Beneficiary Name': 'beneficiaryName',
  'Beneficiary Address': 'beneficiaryAddress',
  'Beneficiary Email': 'beneficiaryEmail',
  'Detailed Response': 'detailedResponse',
  'SSN/Tax ID': 'ssnTaxId',
  'Upload Supporting Docs': 'supportingDocs',
};

// Reverse map for display purposes
export const NORMALIZED_TO_DISPLAY: Record<string, string> = {
  'name': 'Name',
  'cptId': 'CPT ID',
  'email': 'Email Address',
  'phone': 'Phone',
  'mailingAddress': 'Mailing Address',
  'previousAddress': 'Previous Address',
  'newAddress': 'New Address',
  'previousName': 'Previous Name',
  'newName': 'New Name',
  'reason': 'Reason',
  'address': 'Address',
  'beneficiaryName': 'Beneficiary Name',
  'beneficiaryAddress': 'Beneficiary Address',
  'beneficiaryEmail': 'Beneficiary Email',
  'detailedResponse': 'Detailed Response',
  'ssnTaxId': 'SSN/Tax ID',
  'supportingDocs': 'Supporting Documents',
};

