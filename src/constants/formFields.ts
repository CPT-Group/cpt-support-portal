import type { FieldConfig, FormFieldMapping } from '@/types/formConfig';

// Field definitions with validation rules
export const FORM_FIELDS: FormFieldMapping = {
  name: {
    id: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 100,
    },
    placeholder: 'Enter your full name',
  },
  cptId: {
    id: 'cptId',
    label: 'CPT ID',
    type: 'text',
    required: true,
    validation: {
      minLength: 1,
      maxLength: 50,
    },
    placeholder: 'Enter your CPT ID',
  },
  email: {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    placeholder: 'Enter your email address',
  },
  phone: {
    id: 'phone',
    label: 'Phone',
    type: 'phone',
    required: true,
    validation: {
      pattern: /^[\d\s\-\(\)]+$/,
      minLength: 10,
    },
    placeholder: 'Enter your phone number',
  },
  mailingAddress: {
    id: 'mailingAddress',
    label: 'Mailing Address',
    type: 'textarea',
    required: true,
    validation: {
      minLength: 5,
      maxLength: 500,
    },
    placeholder: 'Enter your mailing address',
  },
  previousAddress: {
    id: 'previousAddress',
    label: 'Previous Address',
    type: 'textarea',
    required: true,
    validation: {
      minLength: 5,
      maxLength: 500,
    },
    placeholder: 'Enter your previous address',
  },
  newAddress: {
    id: 'newAddress',
    label: 'New Address',
    type: 'textarea',
    required: true,
    validation: {
      minLength: 5,
      maxLength: 500,
    },
    placeholder: 'Enter your new address',
  },
  previousName: {
    id: 'previousName',
    label: 'Previous Name',
    type: 'text',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 100,
    },
    placeholder: 'Enter your previous name',
  },
  newName: {
    id: 'newName',
    label: 'New Name',
    type: 'text',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 100,
    },
    placeholder: 'Enter your new name',
  },
  reason: {
    id: 'reason',
    label: 'Reason',
    type: 'textarea',
    required: true,
    validation: {
      minLength: 10,
      maxLength: 1000,
    },
    placeholder: 'Please provide a reason for your request',
  },
  address: {
    id: 'address',
    label: 'Address',
    type: 'textarea',
    required: true,
    validation: {
      minLength: 5,
      maxLength: 500,
    },
    placeholder: 'Enter your address',
  },
  beneficiaryName: {
    id: 'beneficiaryName',
    label: 'Beneficiary Name',
    type: 'text',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 100,
    },
    placeholder: 'Enter beneficiary name',
  },
  beneficiaryAddress: {
    id: 'beneficiaryAddress',
    label: 'Beneficiary Address',
    type: 'textarea',
    required: true,
    validation: {
      minLength: 5,
      maxLength: 500,
    },
    placeholder: 'Enter beneficiary address',
  },
  beneficiaryEmail: {
    id: 'beneficiaryEmail',
    label: 'Beneficiary Email',
    type: 'email',
    required: true,
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    placeholder: 'Enter beneficiary email address',
  },
  detailedResponse: {
    id: 'detailedResponse',
    label: 'Detailed Response',
    type: 'textarea',
    required: true,
    validation: {
      minLength: 10,
      maxLength: 2000,
    },
    placeholder: 'Please provide a detailed response',
  },
  ssnTaxId: {
    id: 'ssnTaxId',
    label: 'SSN/Tax ID',
    type: 'ssn',
    required: true,
    validation: {
      pattern: /^[\d\-]+$/,
      minLength: 9,
      maxLength: 11,
    },
    placeholder: 'Enter SSN or Tax ID',
    helpText: 'Format: XXX-XX-XXXX or XXXXXXXXX',
  },
  supportingDocs: {
    id: 'supportingDocs',
    label: 'Supporting Documents',
    type: 'file',
    required: false,
    helpText: 'Upload supporting documents (optional)',
  },
};

// Helper function to get field config by normalized ID
export function getFieldConfig(fieldId: string): FieldConfig | undefined {
  return FORM_FIELDS[fieldId];
}

// Helper function to normalize CSV field name to ID
export function normalizeFieldName(csvFieldName: string): string {
  const normalizedMap: Record<string, string> = {
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
  return normalizedMap[csvFieldName.trim()] || csvFieldName.toLowerCase().replace(/\s+/g, '');
}

