import { NextRequest } from 'next/server';
import {
  sfFetchWithStoredToken,
  readStoredTokens,
} from '@/services/api/salesforceOAuth';
import { notifySupportSubmissionTeams } from '@/utils/webhooks';
import { REQUEST_TYPES } from '@/constants/requestTypes';

export const dynamic = 'force-dynamic';

const SOBJECT = 'Support_Channel__c';

/**
 * Map portal form / submission keys to Support_Channel__c API names.
 * Portal-specific fields (First_Name__c, Last_Name__c, etc.) are created via CLI:
 * see salesforce-metadata/ and scripts/deploy-support-channel-fields.*
 */
const PORTAL_TO_SF_FIELD: Record<string, string> = {
  reason: 'Website_Detail_Summary__c',
  description: 'Website_Detail_Summary__c',
  email: 'Case_Email__c',
  contact_email: 'Case_Email__c',
  phone: 'Case_Phone__c',
  address: 'Address__c',
  caseCaseID: 'Case_No__c',
  caseId: 'Case_No__c',
  caseName: 'Case_Name__c',
  requestTypeLabels: 'Type__c',
  requestTypes: 'Type__c',
  // Portal-only fields (deploy from salesforce-metadata/ first)
  firstName: 'First_Name__c',
  lastName: 'Last_Name__c',
  cptId: 'CPT_ID__c',
  previousAddress: 'Previous_Address__c',
  newAddress: 'New_Address__c',
  previousName: 'Previous_Name__c',
  newName: 'New_Name__c',
  ssnTaxId: 'SSN_Tax_ID__c',
  beneficiaryName: 'Beneficiary_Name__c',
  beneficiaryAddress: 'Beneficiary_Address__c',
  beneficiaryEmail: 'Beneficiary_Email__c',
  additionalDescription: 'Additional_Description__c',
};

interface DescribeField {
  name: string;
  type: string;
  createable?: boolean;
  nillable?: boolean;
  picklistValues?: Array<{ value: string; label: string }>;
}

async function getCreateableFields(): Promise<Set<string>> {
  const raw = await sfFetchWithStoredToken<{ fields: DescribeField[] }>(
    `/sobjects/${SOBJECT}/describe`
  );
  const fields = (raw.fields ?? []) as DescribeField[];
  return new Set(
    fields.filter((f) => f.createable !== false).map((f) => f.name)
  );
}

/** Result of Type__c picklist describe: lookup key (lowercase) -> API value, and set of all valid API values. */
interface TypePicklistResult {
  labelOrValueToApiValue: Map<string, string>;
  validApiValues: Set<string>;
}

/**
 * Fetches Type__c picklist from describe. Builds a map so we can resolve portal labels to SF API values.
 * Keys: both SF label (lowercase) and SF value (lowercase), so we match whether the org uses same label as value or not.
 * Also returns the set of valid API values for fallback (e.g. "Request_Passcode" when label doesn't match).
 */
async function getTypePicklistResult(): Promise<TypePicklistResult> {
  const raw = await sfFetchWithStoredToken<{ fields: DescribeField[] }>(
    `/sobjects/${SOBJECT}/describe`
  );
  const fields = (raw.fields ?? []) as DescribeField[];
  const typeField = fields.find((f) => f.name === 'Type__c');
  const labelOrValueToApiValue = new Map<string, string>();
  const validApiValues = new Set<string>();
  if (typeField?.picklistValues) {
    for (const pv of typeField.picklistValues) {
      if (pv.value == null || pv.value === '') continue;
      validApiValues.add(pv.value);
      const keyLabel = pv.label?.trim().toLowerCase() ?? '';
      const keyValue = pv.value.trim().toLowerCase();
      if (keyLabel) labelOrValueToApiValue.set(keyLabel, pv.value);
      labelOrValueToApiValue.set(keyValue, pv.value);
    }
  }
  return { labelOrValueToApiValue, validApiValues };
}

/**
 * Portal request type labels (all 17 from REQUEST_TYPES). Type__c in Salesforce should have these
 * as labels or API values (e.g. "Request_Passcode") so resolution works for every option.
 */
const PORTAL_REQUEST_TYPE_LABELS = new Set(
  REQUEST_TYPES.map((rt) => rt.label.trim())
);

/**
 * Resolves request type label(s) from body to a Type__c API value. Tries each label in order.
 * Only considers labels that are in our portal list (all 17 options). Matches by: SF label (case-insensitive),
 * SF value (case-insensitive), or canonical form (spaces -> underscores) if that value exists in the picklist.
 */
function resolveTypeApiValue(
  labels: string[],
  result: TypePicklistResult
): string | null {
  const { labelOrValueToApiValue, validApiValues } = result;
  const toTry = labels.map((l) => l.trim()).filter((l) => l && PORTAL_REQUEST_TYPE_LABELS.has(l));
  for (const label of toTry.length > 0 ? toTry : labels.map((l) => l.trim()).filter(Boolean)) {
    const byLabel = labelOrValueToApiValue.get(label.toLowerCase());
    if (byLabel != null) return byLabel;
    const canonicalValue = label.replace(/\s+/g, '_');
    if (validApiValues.has(canonicalValue)) return canonicalValue;
  }
  return null;
}

/**
 * POST /api/support-request
 * Body: JSON with portal fields (subject, description, email, reason, caseId, ...).
 * Creates a Support_Channel__c record; returns { success, id }.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  if (!body || typeof body !== 'object') {
    return Response.json(
      { success: false, message: 'Body must be a JSON object' },
      { status: 400 }
    );
  }

  const createable = await getCreateableFields();
  const typePicklistResult = await getTypePicklistResult();
  const payload: Record<string, unknown> = {};
  const bodyKeysSentToSf = new Set<string>();

  for (const [key, value] of Object.entries(body)) {
    if (value === undefined || value === null) continue;
    const apiName = PORTAL_TO_SF_FIELD[key] ?? key;
    if (!createable.has(apiName)) continue;
    // Type__c is a restricted picklist: resolve portal label to SF API value, not in the loop
    if (apiName === 'Type__c' && (key === 'requestTypeLabels' || key === 'requestTypes')) continue;
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) continue;
      payload[apiName] = value.join(', ');
    } else {
      payload[apiName] = value;
    }
    bodyKeysSentToSf.add(key);
  }

  // Resolve Type__c from request type label(s) to picklist API value. Tries each selected label until one matches.
  // Supports all 17 portal options: match by SF label, SF value, or canonical "Label_With_Underscores".
  const labels = Array.isArray(body.requestTypeLabels)
    ? (body.requestTypeLabels as string[]).filter((l): l is string => typeof l === 'string')
    : typeof body.requestTypeLabels === 'string'
      ? [body.requestTypeLabels]
      : [];
  if (labels.length > 0 && createable.has('Type__c')) {
    const apiValue = resolveTypeApiValue(labels, typePicklistResult);
    if (apiValue != null) {
      payload['Type__c'] = apiValue;
      bodyKeysSentToSf.add('requestTypeLabels');
    }
    // If no match, omit Type__c (field is nillable) so create still succeeds
  }

  const notSent = Object.keys(body).filter((k) => !bodyKeysSentToSf.has(k));
  if (notSent.length > 0) {
    console.log('[support-request] Not sent to Salesforce (no mapping or not createable):', notSent.join(', '));
  }

  const projectId = process.env.SUPPORT_CHANNEL_DEFAULT_PROJECT_ID?.trim();
  if (!projectId) {
    return Response.json(
      { success: false, message: 'SUPPORT_CHANNEL_DEFAULT_PROJECT_ID is not set (required for Support_Channel__c.Project__c)' },
      { status: 500 }
    );
  }
  payload['Project__c'] = projectId;

  const userinfo = await sfFetchWithStoredToken<{ user_id?: string }>('/services/oauth2/userinfo');
  const ownerId = userinfo?.user_id;
  if (!ownerId) {
    return Response.json(
      { success: false, message: 'Could not get OwnerId from Salesforce userinfo' },
      { status: 500 }
    );
  }
  payload['OwnerId'] = ownerId;

  if (Object.keys(payload).length === 0) {
    return Response.json(
      {
        success: false,
        message:
          'No createable fields in body. Call GET /api/sf/describe/support-channel for allowed fields.',
      },
      { status: 400 }
    );
  }

  const tokens = readStoredTokens();
  const apiVersion = process.env.SF_API_VERSION || 'v60.0';
  const url = `${tokens.instance_url}/services/data/${apiVersion}/sobjects/${SOBJECT}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    let msg = `Salesforce create error ${res.status}: ${res.statusText}`;
    try {
      const err = JSON.parse(text);
      if (Array.isArray(err)) msg = err.map((e: { message?: string }) => e.message).join('; ');
      else if (err.message) msg = err.message;
    } catch {
      if (text) msg += ` - ${text.slice(0, 200)}`;
    }
    console.error('[support-request]', msg);
    return Response.json({ success: false, message: msg }, { status: 500 });
  }

  const result = (await res.json()) as { id: string };
  const id = result.id;
  console.log('[support-request] Create success, new record id:', id);

  // Fire-and-forget: notify Teams channel (never block or fail the request)
  const webhookUrl = process.env.SUPPORT_SUBMISSION_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    const caseName =
      typeof body.caseName === 'string'
        ? body.caseName
        : typeof body.caseProjectName === 'string'
          ? body.caseProjectName
          : body.caseId ?? 'Unknown case';
    const requestTypes = Array.isArray(body.requestTypeLabels)
      ? (body.requestTypeLabels as string[]).join(', ')
      : typeof body.requestTypeLabels === 'string'
        ? body.requestTypeLabels
        : '—';
    notifySupportSubmissionTeams(webhookUrl, { caseName, requestTypes });
  }

  return Response.json({ success: true, id });
}
