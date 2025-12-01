import type { FieldConfig, FormFieldMapping } from '@/types/formConfig';

// Section order configuration - lower numbers appear first
export const SECTION_ORDER: Record<string, number> = {
  identity: 1, // Personal information (name, email, etc.)
  'request-specific': 2, // Request-specific fields
  beneficiary: 3, // Beneficiary information
  optional: 4, // Optional fields
};

// Section display labels
export const SECTION_LABELS: Record<string, string> = {
  identity: 'Identity Verification',
  'request-specific': 'Request-Specific Information',
  beneficiary: 'Beneficiary Information',
  optional: 'Optional Fields',
};

// Field definitions with validation rules
export const FORM_FIELDS: FormFieldMapping = {
  name: {
    id: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    section: 'identity',
    order: 1,
    validation: {
      minLength: 2,
      maxLength: 100,
    },
    placeholder: 'Enter your full name',
  },
  email: {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    section: 'identity',
    order: 2,
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    placeholder: 'Enter your email address',
  },
  cptId: {
    id: 'cptId',
    label: 'CPT ID',
    type: 'text',
    required: true,
    section: 'identity',
    order: 3,
    validation: {
      minLength: 1,
      maxLength: 50,
    },
    placeholder: 'Enter your CPT ID',
  },
  phone: {
    id: 'phone',
    label: 'Phone',
    type: 'phone',
    required: true,
    section: 'identity',
    order: 4,
    validation: {
      pattern: /^[\d\s\-\(\)]+$/,
      minLength: 10,
    },
    placeholder: 'Enter your phone number',
  },
  mailingAddress: {
    id: 'mailingAddress',
    label: 'Mailing Address',
    type: 'address',
    required: true,
    section: 'identity',
    order: 5,
    validation: {
      maxLength: 500,
    },
    placeholder: 'Enter your mailing address',
  },
  previousAddress: {
    id: 'previousAddress',
    label: 'Previous Address',
    type: 'address',
    required: true,
    section: 'request-specific',
    order: 1,
    validation: {
      maxLength: 500,
    },
    placeholder: 'Enter your previous address',
  },
  newAddress: {
    id: 'newAddress',
    label: 'New Address',
    type: 'address',
    required: true,
    section: 'request-specific',
    order: 2,
    validation: {
      maxLength: 500,
    },
    placeholder: 'Enter your new address',
  },
  previousName: {
    id: 'previousName',
    label: 'Previous Name',
    type: 'text',
    required: true,
    section: 'request-specific',
    order: 3,
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
    section: 'request-specific',
    order: 4,
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
    section: 'request-specific',
    order: 5,
    validation: {
      minLength: 10,
      maxLength: 1000,
    },
    placeholder: 'Please provide a reason for your request',
  },
  address: {
    id: 'address',
    label: 'Address',
    type: 'address',
    required: true,
    section: 'request-specific',
    order: 6,
    validation: {
      maxLength: 500,
    },
    placeholder: 'Enter your address',
  },
  detailedResponse: {
    id: 'detailedResponse',
    label: 'Detailed Response',
    type: 'textarea',
    required: true,
    section: 'request-specific',
    order: 7,
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
    section: 'request-specific',
    order: 8,
    validation: {
      pattern: /^[\d\-]+$/,
      minLength: 9,
      maxLength: 11,
    },
    placeholder: 'Enter SSN or Tax ID',
    helpText: 'Format: XXX-XX-XXXX or XXXXXXXXX',
  },
  beneficiaryName: {
    id: 'beneficiaryName',
    label: 'Beneficiary Name',
    type: 'text',
    required: true,
    section: 'beneficiary',
    order: 1,
    validation: {
      minLength: 2,
      maxLength: 100,
    },
    placeholder: 'Enter beneficiary name',
  },
  beneficiaryAddress: {
    id: 'beneficiaryAddress',
    label: 'Beneficiary Address',
    type: 'address',
    required: true,
    section: 'beneficiary',
    order: 2,
    validation: {
      maxLength: 500,
    },
    placeholder: 'Enter beneficiary address',
  },
  beneficiaryEmail: {
    id: 'beneficiaryEmail',
    label: 'Beneficiary Email',
    type: 'email',
    required: true,
    section: 'beneficiary',
    order: 3,
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    placeholder: 'Enter beneficiary email address',
  },
  supportingDocs: {
    id: 'supportingDocs',
    label: 'Supporting Documents',
    type: 'file',
    required: false,
    section: 'optional',
    order: 2,
    helpText: 'Upload supporting documents (optional)',
  },
  additionalDescription: {
    id: 'additionalDescription',
    label: 'Additional Description',
    type: 'textarea',
    required: false,
    section: 'optional',
    order: 1,
    validation: {
      maxLength: 2000,
    },
    placeholder: 'Enter any additional information or context...',
    helpText: 'If you have any additional context, notes, or information that might help us process your request, please add them here.',
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

