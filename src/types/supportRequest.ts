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

export interface SubmissionData {
  case: {
    id: string | null;
    name: string;
    label: string;
    projectName: string;
    caseID: string;
  };
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  issueDetails: {
    issueTypes: Array<{
      id: string;
      label: string;
    }>;
    confirmationEmail: string | null;
    approximateTime: string | null;
  };
  description: string;
  files: Array<{
    name: string;
    size: number;
    type: string;
    lastModified: number;
  }>;
}

