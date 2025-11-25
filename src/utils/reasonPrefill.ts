import type { DynamicFormData } from '@/types/supportRequest';
import type { CaseOption } from '@/types/supportRequest';
import { REQUEST_TYPES } from '@/constants/requestTypes';

/**
 * Generates a pre-filled reason text based on selected request types and case information.
 * Format: "[Request Type] issue for case: [Case Name] caseid: [Case ID]"
 */
export function generateReasonPrefill(
  formData: DynamicFormData,
  selectedCase: CaseOption | null
): string {
  if (!formData.requestTypes || formData.requestTypes.length === 0) {
    return '';
  }

  const requestTypeLabels = formData.requestTypes
    .map((id) => {
      const requestType = REQUEST_TYPES.find((rt) => rt.id === id);
      return requestType?.label || id;
    })
    .filter(Boolean);

  const requestTypesText =
    requestTypeLabels.length === 1
      ? requestTypeLabels[0]
      : requestTypeLabels.join(', ');

  const parts: string[] = [];

  if (requestTypesText) {
    parts.push(`${requestTypesText} issue`);
  }

  if (selectedCase) {
    parts.push(`for case: ${selectedCase.label}`);
    if (selectedCase.caseID) {
      parts.push(`caseid: ${selectedCase.caseID}`);
    }
  }

  return parts.join(' ');
}

