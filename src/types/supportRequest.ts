export type StepIndex = 0 | 1 | 2 | 3;

export interface CaseOption {
  id: string;
  label: string;
  name: string;
  projectName: string;
  caseID: string;
}

export interface IssueTypeOption {
  id: string;
  label: string;
}

export interface ConfirmationEmailOption {
  id: string;
  label: string;
  value: string;
}

export interface SupportRequestFormData {
  caseId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  issueTypes: string[];
  confirmationEmail: string | null;
  approximateTime: Date | null;
  description: string;
  files: File[];
}

