import type { RequestTypeConfig } from '@/types/formConfig';

// Request type configurations based on updated CSV from QA/Project Owners
// Ordered by Sort Order (1-17) for display
// Note: cptId is optional for all request types (added to optionalFields)
// Note: reason field is auto-generated behind the scenes, so requirement is satisfied by generation
// Note: name in CSV = firstName + lastName in UI, both sent separately in JSON (not combined)
// Note: address and mailingAddress are consolidated to just 'address'
// Note: detailedResponse renamed to additionalDescription
// Note: supportingDocs renamed to supportingDocumentation
export const REQUEST_TYPES: RequestTypeConfig[] = [
  {
    id: '3',
    label: 'Request Notice Packet',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address'],
    optionalFields: ['cptId'],
    notes: 'Request for physical notice packet',
  },
  {
    id: '4',
    label: 'Request Passcode',
    requiredFields: ['firstName', 'lastName', 'email', 'phone'],
    optionalFields: ['cptId'],
    faqLink: '550e8400-e29b-41d4-a716-446655440010', // What is my ID and/or Passcode?
    notes: 'FAQ reference: How to find passcode on notice',
  },
  {
    id: '1',
    label: 'Update Mailing Address',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'previousAddress', 'newAddress'],
    optionalFields: ['cptId'],
    notes: 'Standard address change request',
  },
  {
    id: '2',
    label: 'Request Name Change',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address', 'previousName', 'newName', 'supportingDocumentation'],
    optionalFields: ['cptId', 'additionalDescription'],
    notes: 'Legal name change request - additionalDescription is optional per ASTRA notes',
  },
  {
    id: '8',
    label: 'Deceased Class Member',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address', 'ssnTaxId', 'beneficiaryName', 'beneficiaryAddress', 'beneficiaryEmail', 'supportingDocumentation'],
    optionalFields: ['cptId', 'additionalDescription'],
    notes: 'Notification of deceased class member',
  },
  {
    id: '5',
    label: 'Request to Be Added to Case',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address', 'supportingDocumentation'],
    optionalFields: ['additionalDescription'],
    notes: 'Request to be added to case/class',
  },
  {
    id: '7',
    label: 'Respond to Dispute Notice',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address', 'supportingDocumentation'],
    optionalFields: ['cptId'],
    notes: 'Dispute regarding work weeks or shifts',
  },
  {
    id: '9',
    label: 'Respond to Deficient Notice',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address', 'supportingDocumentation'],
    optionalFields: ['cptId'],
    notes: 'Response to deficiency notice',
  },
  {
    id: '13',
    label: 'Respond to SSN/W9 Request',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address', 'ssnTaxId'],
    optionalFields: ['cptId', 'supportingDocumentation', 'additionalDescription'],
    notes: 'Response with SSN/Tax ID information',
  },
  {
    id: '6',
    label: 'Request Check Reissue',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'previousAddress', 'newAddress'],
    optionalFields: ['cptId'],
    faqLink: '550e8400-e29b-41d4-a716-446655440015', // What if I Did Not Receive my Payment?
    notes: 'Request for check reissue due to address change',
  },
  {
    id: '11',
    label: 'Request Cashed Check Copy',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address'],
    optionalFields: ['cptId'],
    notes: 'Request for copy of cashed check',
  },
  {
    id: '10',
    label: 'Request Tax Forms',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address', 'ssnTaxId'],
    optionalFields: ['cptId'],
    notes: 'Request for tax forms (1099, etc.)',
  },
  {
    id: '12',
    label: 'Request Fraud Affidavit Packet',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address'],
    optionalFields: ['cptId'],
    notes: 'Request for fraud affidavit form',
  },
  {
    id: '14',
    label: 'Did you Receive my Response?',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address'],
    optionalFields: ['cptId'],
    faqLink: '550e8400-e29b-41d4-a716-446655440011', // Did you Receive my Response?
    notes: 'Status inquiry - may resolve without submission',
  },
  {
    id: '15',
    label: 'Have you Received my Supporting Documents?',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address'],
    optionalFields: ['cptId'],
    faqLink: '550e8400-e29b-41d4-a716-446655440012', // Did you Receive my Supporting Documents?
    notes: 'Status inquiry - may resolve without submission',
  },
  {
    id: '16',
    label: 'What is my Settlement Amount?',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address'],
    optionalFields: ['cptId'],
    faqLink: '550e8400-e29b-41d4-a716-446655440004', // What is my Settlement Amount?
    notes: 'Status inquiry - may resolve without submission',
  },
  {
    id: '17',
    label: 'When will I Receive my Settlement Payment?',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'address'],
    optionalFields: ['cptId'],
    faqLink: '550e8400-e29b-41d4-a716-446655440013', // When Will I Receive my Settlement Payment
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

