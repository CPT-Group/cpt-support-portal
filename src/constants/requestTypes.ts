import type { RequestTypeConfig } from '@/types/formConfig';
import { normalizeFieldName } from './formFields';

// Request type configurations based on SUPPORT-FORM-FIELDS.csv
export const REQUEST_TYPES: RequestTypeConfig[] = [
  {
    id: '1',
    label: 'Address Update',
    requiredFields: ['name', 'cptId', 'previousAddress', 'newAddress', 'phone'],
    optionalFields: ['supportingDocs'],
    notes: 'Standard address change request',
  },
  {
    id: '2',
    label: 'Name Change',
    requiredFields: ['name', 'cptId', 'previousName', 'newName', 'phone'],
    optionalFields: ['supportingDocs'],
    notes: 'Legal name change request',
  },
  {
    id: '3',
    label: 'Notice Packet Request',
    requiredFields: ['name', 'cptId', 'email', 'mailingAddress', 'phone'],
    optionalFields: [],
    notes: 'Request for physical notice packet',
  },
  {
    id: '4',
    label: 'Passcode Request',
    faqReference: 'How to find on notice',
    requiredFields: ['name', 'cptId', 'email', 'phone'],
    optionalFields: [],
    notes: 'FAQ reference: How to find passcode on notice',
  },
  {
    id: '5',
    label: 'Requests to Be Added',
    requiredFields: ['name', 'cptId', 'reason', 'address', 'phone'],
    optionalFields: ['supportingDocs'],
    notes: 'Request to be added to case/class',
  },
  {
    id: '6',
    label: 'Check Reissue Request',
    requiredFields: ['name', 'cptId', 'reason', 'previousAddress', 'newAddress', 'email', 'phone'],
    optionalFields: [],
    notes: 'Request for check reissue due to address change',
  },
  {
    id: '7',
    label: 'Dispute Work Weeks/Shifts',
    requiredFields: ['name', 'cptId', 'reason', 'address', 'phone'],
    optionalFields: ['supportingDocs'],
    notes: 'Dispute regarding work weeks or shifts',
  },
  {
    id: '8',
    label: 'Deceased Class Member',
    requiredFields: ['name', 'cptId', 'beneficiaryName', 'beneficiaryAddress', 'beneficiaryEmail', 'phone'],
    optionalFields: ['supportingDocs'],
    notes: 'Notification of deceased class member',
  },
  {
    id: '9',
    label: 'Deficiency Response',
    requiredFields: ['name', 'cptId', 'detailedResponse', 'phone'],
    optionalFields: ['supportingDocs'],
    notes: 'Response to deficiency notice',
  },
  {
    id: '10',
    label: 'Tax Form Request',
    requiredFields: ['name', 'cptId', 'email', 'mailingAddress', 'phone'],
    optionalFields: [],
    notes: 'Request for tax forms (1099, etc.)',
  },
  {
    id: '11',
    label: 'Copy of Cashed Check',
    requiredFields: ['name', 'cptId', 'email', 'mailingAddress', 'phone'],
    optionalFields: [],
    notes: 'Request for copy of cashed check',
  },
  {
    id: '12',
    label: 'Request Fraud Affidavit',
    requiredFields: ['name', 'cptId', 'email', 'mailingAddress', 'phone'],
    optionalFields: [],
    notes: 'Request for fraud affidavit form',
  },
  {
    id: '13',
    label: 'SSN Response',
    requiredFields: ['name', 'cptId', 'email', 'mailingAddress', 'ssnTaxId', 'phone'],
    optionalFields: [],
    notes: 'Response with SSN/Tax ID information',
  },
  {
    id: '14',
    label: 'What is my settlement amount',
    faqReference: 'How to find on notice',
    requiredFields: ['phone'],
    optionalFields: [],
    notes: 'FAQ reference: Settlement amount lookup - may resolve without submission',
  },
  {
    id: '15',
    label: 'When will I receive my check',
    faqReference: 'How to find on notice',
    requiredFields: ['phone'],
    optionalFields: [],
    notes: 'FAQ reference: Check timing - may resolve without submission',
  },
  {
    id: '16',
    label: 'Did you receive my claim form/response',
    requiredFields: ['phone'],
    optionalFields: [],
    notes: 'Status inquiry - may resolve without submission',
  },
  {
    id: '17',
    label: 'Have you received my supporting documents',
    requiredFields: ['phone'],
    optionalFields: [],
    notes: 'Status inquiry - may resolve without submission',
  },
];

// Helper function to get request type by ID
export function getRequestType(id: string): RequestTypeConfig | undefined {
  return REQUEST_TYPES.find((rt) => rt.id === id);
}

// Helper function to get request types by IDs
export function getRequestTypes(ids: string[]): RequestTypeConfig[] {
  return REQUEST_TYPES.filter((rt) => ids.includes(rt.id));
}

