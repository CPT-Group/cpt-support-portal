import type {
  DynamicFormData,
  NormalizedSubmissionData,
  FileMetadata,
} from '@/types/supportRequest';
import type { CaseOption } from '@/types/supportRequest';
import { REQUEST_TYPES } from '@/constants/requestTypes';
import { FORM_FIELDS } from '@/constants/formFields';

/**
 * Converts File objects to FileMetadata for JSON serialization.
 */
function convertFilesToMetadata(files: File[]): FileMetadata[] {
  return files.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  }));
}

/**
 * Generates normalized JSON output from form data.
 * All fields use consistent normalized names for API integration.
 */
export function generateSubmissionJSON(
  formData: DynamicFormData,
  selectedCase: CaseOption | null
): NormalizedSubmissionData {
  const submission: NormalizedSubmissionData = {
    caseId: formData.caseId,
    requestTypes: formData.requestTypes || [],
    requestTypeLabels: [],
  };

  // Add case information if available
  if (selectedCase) {
    submission.caseName = selectedCase.name;
    submission.caseLabel = selectedCase.label;
    submission.caseProjectName = selectedCase.projectName;
    submission.caseCaseID = selectedCase.caseID;
  }

  // Get request type labels
  if (formData.requestTypes && formData.requestTypes.length > 0) {
    submission.requestTypeLabels = formData.requestTypes
      .map((id) => {
        const requestType = REQUEST_TYPES.find((rt) => rt.id === id);
        return requestType?.label || id;
      })
      .filter(Boolean);
  }

  // Process all form fields (excluding system fields)
  const systemFields = new Set(['caseId', 'requestTypes']);
  
  Object.keys(formData).forEach((key) => {
    if (systemFields.has(key)) {
      return; // Skip system fields
    }

    const value = formData[key];
    
    // Skip null/undefined values
    if (value === null || value === undefined) {
      return;
    }

    // Handle File arrays
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      submission[key] = convertFilesToMetadata(value as File[]);
      return;
    }

    // Handle string arrays
    if (Array.isArray(value)) {
      submission[key] = value as string[];
      return;
    }

    // Handle strings
    if (typeof value === 'string' && value.trim() !== '') {
      submission[key] = value;
      return;
    }
  });

  return submission;
}

/**
 * Validates that all required fields for selected request types are present.
 * Returns array of missing required field IDs.
 */
export function validateRequiredFields(
  formData: DynamicFormData,
  selectedRequestTypeIds: string[]
): string[] {
  if (selectedRequestTypeIds.length === 0) {
    return [];
  }

  const missingFields: string[] = [];
  const requestTypes = REQUEST_TYPES.filter((rt) =>
    selectedRequestTypeIds.includes(rt.id)
  );

  requestTypes.forEach((requestType) => {
    requestType.requiredFields.forEach((fieldId) => {
      // Check if field exists and has a value
      const value = formData[fieldId];
      const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty && !missingFields.includes(fieldId)) {
        missingFields.push(fieldId);
      }
    });
  });

  return missingFields;
}

/**
 * Gets field labels for missing required fields.
 */
export function getMissingFieldLabels(missingFieldIds: string[]): string[] {
  return missingFieldIds
    .map((fieldId) => {
      const fieldConfig = FORM_FIELDS[fieldId];
      return fieldConfig?.label || fieldId;
    })
    .filter(Boolean);
}

