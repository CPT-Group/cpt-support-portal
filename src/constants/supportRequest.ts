import type { IssueTypeOption, ConfirmationEmailOption } from '@/types';

export const ISSUE_TYPE_OPTIONS: IssueTypeOption[] = [
  { id: 'submission', label: 'Submission' },
  { id: 'login', label: 'Login' },
  { id: 'confirmation-number', label: 'Confirmation Number' },
];

export const CONFIRMATION_EMAIL_OPTIONS: ConfirmationEmailOption[] = [
  { id: 'yes', label: 'Yes', value: 'yes' },
  { id: 'no', label: 'No', value: 'no' },
];

