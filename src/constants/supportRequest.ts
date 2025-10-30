import type { CaseOption, IssueTypeOption, ConfirmationEmailOption } from '@/types';

export const CASE_OPTIONS: CaseOption[] = [
  {
    id: '1',
    label: 'John Doe (john.doe@example.com)',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  },
  {
    id: '2',
    label: 'Jane Smith (jane.smith@example.com)',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
  },
  {
    id: '3',
    label: 'Bob Johnson (bob.johnson@example.com)',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
  },
];

export const ISSUE_TYPE_OPTIONS: IssueTypeOption[] = [
  { id: 'submission', label: 'Submission' },
  { id: 'login', label: 'Login' },
  { id: 'confirmation-number', label: 'Confirmation Number' },
];

export const CONFIRMATION_EMAIL_OPTIONS: ConfirmationEmailOption[] = [
  { id: 'yes', label: 'Yes', value: 'yes' },
  { id: 'no', label: 'No', value: 'no' },
];

