import type { FieldConfig, RequestTypeConfig, FormFieldMapping } from '@/types/formConfig';
import { FORM_FIELDS, SECTION_ORDER, SECTION_LABELS } from '@/constants/formFields';
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

  // Sort fields by order (if specified), then by label for consistent display order
  requiredFields.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return a.label.localeCompare(b.label);
  });
  optionalFields.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return a.label.localeCompare(b.label);
  });

  return { required: requiredFields, optional: optionalFields };
}

/**
 * Organizes fields by sections with proper ordering.
 * Returns fields grouped by section, with sections ordered according to SECTION_ORDER.
 */
export function organizeFieldsBySection(
  fields: FieldConfig[]
): Array<{ section: string; label: string; fields: FieldConfig[] }> {
  // Group fields by section
  const fieldsBySection: Record<string, FieldConfig[]> = {};
  
  fields.forEach((field) => {
    const section = field.section || 'other';
    if (!fieldsBySection[section]) {
      fieldsBySection[section] = [];
    }
    fieldsBySection[section].push(field);
  });

  // Sort fields within each section by order
  Object.keys(fieldsBySection).forEach((section) => {
    fieldsBySection[section].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return a.label.localeCompare(b.label);
    });
  });

  // Convert to array and sort by section order
  const sections = Object.keys(fieldsBySection).map((section) => ({
    section,
    label: SECTION_LABELS[section] || section,
    fields: fieldsBySection[section],
  }));

  sections.sort((a, b) => {
    const orderA = SECTION_ORDER[a.section] ?? 999;
    const orderB = SECTION_ORDER[b.section] ?? 999;
    return orderA - orderB;
  });

  return sections;
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

