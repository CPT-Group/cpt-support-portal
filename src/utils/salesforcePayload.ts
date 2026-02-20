import type { NormalizedSubmissionData } from '@/types/supportRequest';

/**
 * Build payload for POST /api/support-request from portal submission data.
 * Returns the full submission so all portal fields are sent to the API.
 * The API maps to Support_Channel__c and only sends createable fields;
 * unmapped/non-createable fields are logged server-side, not dropped from our data.
 */
export function buildSupportRequestPayload(
  submission: NormalizedSubmissionData
): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(submission)) {
    if (value !== undefined && value !== null) raw[key] = value;
  }
  return raw;
}
