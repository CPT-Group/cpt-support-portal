import type { FieldConfig, RequestTypeConfig, FormFieldMapping } from '@/types/formConfig';
import { FORM_FIELDS } from '@/constants/formFields';
import { getRequestTypes } from '@/constants/requestTypes';

/**
 * Consolidates fields from multiple selected request types.
 * Deduplicates fields based on normalized field IDs.
 * Returns separated required and optional field arrays.
 */
export function consolidateFields(
  selectedRequestTypeIds: string[],
  requestTypesConfig?: RequestTypeConfig[]
): {
  required: FieldConfig[];
  optional: FieldConfig[];
} {
  if (selectedRequestTypeIds.length === 0) {
    return { required: [], optional: [] };
  }

  // Use provided config or fetch from constants
  const requestTypes = requestTypesConfig || getRequestTypes(selectedRequestTypeIds);

  // Collect all field IDs from selected request types
  const requiredFieldIds = new Set<string>();
  const optionalFieldIds = new Set<string>();

  requestTypes.forEach((requestType) => {
    requestType.requiredFields.forEach((fieldId) => requiredFieldIds.add(fieldId));
    requestType.optionalFields.forEach((fieldId) => optionalFieldIds.add(fieldId));
  });

  // Remove optional fields that are also required (required takes precedence)
  optionalFieldIds.forEach((fieldId) => {
    if (requiredFieldIds.has(fieldId)) {
      optionalFieldIds.delete(fieldId);
    }
  });

  // Map field IDs to FieldConfig objects
  const requiredFields: FieldConfig[] = [];
  const optionalFields: FieldConfig[] = [];

  requiredFieldIds.forEach((fieldId) => {
    const fieldConfig = FORM_FIELDS[fieldId];
    if (fieldConfig) {
      requiredFields.push(fieldConfig);
    }
  });

  optionalFieldIds.forEach((fieldId) => {
    const fieldConfig = FORM_FIELDS[fieldId];
    if (fieldConfig) {
      optionalFields.push(fieldConfig);
    }
  });

  // Sort fields by label for consistent display order
  requiredFields.sort((a, b) => a.label.localeCompare(b.label));
  optionalFields.sort((a, b) => a.label.localeCompare(b.label));

  return { required: requiredFields, optional: optionalFields };
}

/**
 * Gets all unique field IDs (both required and optional) from selected request types.
 */
export function getAllFieldIds(selectedRequestTypeIds: string[]): string[] {
  const { required, optional } = consolidateFields(selectedRequestTypeIds);
  const allIds = new Set<string>();
  required.forEach((field) => allIds.add(field.id));
  optional.forEach((field) => allIds.add(field.id));
  return Array.from(allIds);
}

/**
 * Checks if a field is required for the selected request types.
 */
export function isFieldRequired(
  fieldId: string,
  selectedRequestTypeIds: string[]
): boolean {
  const { required } = consolidateFields(selectedRequestTypeIds);
  return required.some((field) => field.id === fieldId);
}

