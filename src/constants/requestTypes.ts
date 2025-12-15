import type { RequestTypeConfig } from '@/types/formConfig';
import { normalizeFieldName } from './formFields';

// Request type configurations based on updated CSV from QA/Project Owners
// Note: cptId is optional for all request types (added to optionalFields)
// Note: reason field is auto-generated, so requirement is satisfied by generation
export const REQUEST_TYPES: RequestTypeConfig[] = [
  {
    id: '1',
    label: 'Update Contact Information',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'previousAddress', 'newAddress', 'address'],
    optionalFields: ['cptId'],
    notes: 'Update contact information including address changes',
  },
  {
    id: '2',
    label: 'Name Change',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'previousName', 'newName', 'address', 'supportingDocs', 'additionalDescription'],
    optionalFields: ['cptId'],
    notes: 'Legal name change request - reason is auto-generated',
  },
  {
    id: '3',
    label: 'Request Notice Packet',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'address'],
    optionalFields: ['cptId'],
    notes: 'Request for physical notice packet',
  },
  {
    id: '4',
    label: 'Request Passcode',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'address'],
    optionalFields: ['cptId'],
    faqReference: 'How to find on notice',
    notes: 'FAQ reference: How to find passcode on notice',
  },
  {
    id: '5',
    label: 'Request to Be Added to Case',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'address', 'supportingDocs', 'additionalDescription'],
    optionalFields: ['cptId'],
    notes: 'Request to be added to case/class - reason is auto-generated',
  },
  {
    id: '6',
    label: 'Request Check Reissue',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'previousAddress', 'newAddress', 'address'],
    optionalFields: ['cptId'],
    notes: 'Request for check reissue due to address change - reason is auto-generated',
  },
  {
    id: '7',
    label: 'Respond to Dispute Notice',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'address', 'supportingDocs'],
    optionalFields: ['cptId'],
    notes: 'Response to dispute notice - reason is auto-generated',
  },
  {
    id: '8',
    label: 'Deceased Class Member',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'address', 'ssnTaxId', 'beneficiaryName', 'beneficiaryAddress', 'beneficiaryEmail', 'supportingDocs', 'additionalDescription'],
    optionalFields: ['cptId'],
    notes: 'Notification of deceased class member',
  },
  {
    id: '9',
    label: 'Respond to Deficient Notice',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'address', 'detailedResponse', 'supportingDocs'],
    optionalFields: ['cptId'],
    notes: 'Response to deficiency notice',
  },
  {
    id: '10',
    label: 'Request Tax Forms',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'address', 'ssnTaxId'],
    optionalFields: ['cptId'],
    notes: 'Request for tax forms (1099, etc.)',
  },
  {
    id: '11',
    label: 'Request Cashed Check Copy',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'address'],
    optionalFields: ['cptId'],
    notes: 'Request for copy of cashed check',
  },
  {
    id: '12',
    label: 'Request Fraud Affidavit Packet',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'address'],
    optionalFields: ['cptId'],
    notes: 'Request for fraud affidavit form',
  },
  {
    id: '13',
    label: 'Respond to SSN/W9 Request',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'mailingAddress', 'address', 'ssnTaxId'],
    optionalFields: ['cptId'],
    notes: 'Response with SSN/Tax ID information',
  },
  {
    id: '14',
    label: 'Did you Receive my Response?',
    requiredFields: ['email', 'phone', 'mailingAddress', 'address'],
    optionalFields: ['cptId', 'firstName', 'lastName'], // name not required per CSV, but show as optional in UI
    notes: 'Status inquiry - may resolve without submission',
  },
  {
    id: '15',
    label: 'Have you Received my Supporting Documents?',
    requiredFields: ['email', 'phone', 'mailingAddress', 'address'],
    optionalFields: ['cptId', 'firstName', 'lastName'], // name not required per CSV, but show as optional in UI
    notes: 'Status inquiry - may resolve without submission',
  },
  {
    id: '16',
    label: 'What is my Settlement Amount?',
    requiredFields: ['email', 'phone', 'mailingAddress', 'address'],
    optionalFields: ['cptId', 'firstName', 'lastName'], // name not required per CSV, but show as optional in UI
    faqReference: 'How to find on notice',
    notes: 'FAQ reference: Settlement amount lookup - may resolve without submission',
  },
  {
    id: '17',
    label: 'When will I Receive my Check?',
    requiredFields: ['email', 'phone', 'mailingAddress', 'address'],
    optionalFields: ['cptId', 'firstName', 'lastName'], // name not required per CSV, but show as optional in UI
    faqReference: 'How to find on notice',
    notes: 'FAQ reference: Check timing - may resolve without submission',
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

