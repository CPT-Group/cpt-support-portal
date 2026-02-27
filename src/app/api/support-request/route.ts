import { NextRequest } from 'next/server';
import { sfFetchWithStoredToken } from '@/services/api/salesforceOAuth';
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
  // Member email/phone → dedicated class member fields (Email__c, Phone__c)
  email: 'Email__c',
  contact_email: 'Email__c',
  phone: 'Phone__c',
  // Case email/phone → auto-populated from selected Project record
  caseEmail: 'Case_Email__c',
  casePhone: 'Case_Phone__c',
  address: 'Address__c',
  caseCaseID: 'Case_No__c',
  caseId: 'Case_No__c',
  requestTypeLabels: 'Request_Type__c',
  requestTypes: 'Request_Type__c',
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
  picklistValues?: Array<{ value: string; label: string; active?: boolean }>;
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

/** Result of Request_Type__c picklist describe: lookup key (lowercase) -> API value, and set of all valid API values. */
interface RequestTypePicklistResult {
  labelOrValueToApiValue: Map<string, string>;
  validApiValues: Set<string>;
}

/**
 * Fetches Request_Type__c (multipicklist) from describe. Builds a map so we can resolve portal labels to SF API values.
 * Keys: both SF label (lowercase) and SF value (lowercase), so we match whether the org uses same label as value or not.
 * Also returns the set of valid API values for fallback (e.g. "Request_Passcode" when label doesn't match).
 */
async function getRequestTypePicklistResult(): Promise<RequestTypePicklistResult> {
  const raw = await sfFetchWithStoredToken<{ fields: DescribeField[] }>(
    `/sobjects/${SOBJECT}/describe`
  );
  const fields = (raw.fields ?? []) as DescribeField[];
  const typeField = fields.find((f) => f.name === 'Request_Type__c');
  const labelOrValueToApiValue = new Map<string, string>();
  const validApiValues = new Set<string>();
  if (typeField?.picklistValues) {
    for (const pv of typeField.picklistValues) {
      if (pv.value == null || pv.value === '') continue;
      if (pv.active === false) continue;
      validApiValues.add(pv.value);
      const keyLabel = pv.label?.trim().toLowerCase() ?? '';
      const keyValue = pv.value.trim().toLowerCase();
      if (keyLabel) labelOrValueToApiValue.set(keyLabel, pv.value);
      labelOrValueToApiValue.set(keyValue, pv.value);
    }
  }
  console.log('[support-request] Request_Type__c active picklist values:', [...validApiValues].join(', '));
  return { labelOrValueToApiValue, validApiValues };
}

/**
 * Portal request type labels (all 17 from REQUEST_TYPES). Request_Type__c in Salesforce should have
 * these as labels or API values (e.g. "Request_Passcode") so resolution works for every option.
 */
const PORTAL_REQUEST_TYPE_LABELS = new Set(
  REQUEST_TYPES.map((rt) => rt.label.trim())
);

/**
 * Resolves request type labels from body to Request_Type__c API values.
 * Returns ALL matched values joined with semicolons (Salesforce multipicklist format).
 * Only considers labels that are in our portal list (all 17 options). Matches by: SF label (case-insensitive),
 * SF value (case-insensitive), or canonical form (spaces -> underscores) if that value exists in the picklist.
 */
function resolveRequestTypeApiValues(
  labels: string[],
  result: RequestTypePicklistResult
): string | null {
  const { labelOrValueToApiValue, validApiValues } = result;
  const toTry = labels.map((l) => l.trim()).filter((l) => l && PORTAL_REQUEST_TYPE_LABELS.has(l));
  const candidates = toTry.length > 0 ? toTry : labels.map((l) => l.trim()).filter(Boolean);
  const resolved: string[] = [];
  for (const label of candidates) {
    const byLabel = labelOrValueToApiValue.get(label.toLowerCase());
    if (byLabel != null) { resolved.push(byLabel); continue; }
    const canonicalValue = label.replace(/\s+/g, '_');
    if (validApiValues.has(canonicalValue)) { resolved.push(canonicalValue); }
  }
  return resolved.length > 0 ? resolved.join(';') : null;
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

  try {
    return await handleSupportRequestCreate(body);
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : String(err ?? 'Support request submission failed');
    console.error('[support-request]', msg);
    const body = { success: false, message: msg };
    return new Response(JSON.stringify(body), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleSupportRequestCreate(body: Record<string, unknown>): Promise<Response> {
  const createable = await getCreateableFields();
  const requestTypePicklistResult = await getRequestTypePicklistResult();
  const payload: Record<string, unknown> = {};
  const bodyKeysSentToSf = new Set<string>();

  for (const [key, value] of Object.entries(body)) {
    if (value === undefined || value === null) continue;
    const apiName = PORTAL_TO_SF_FIELD[key] ?? key;
    if (!createable.has(apiName)) continue;
    // Request_Type__c is a multipicklist: resolve portal labels to SF API values outside the loop
    if (apiName === 'Request_Type__c' && (key === 'requestTypeLabels' || key === 'requestTypes')) continue;
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) continue;
      payload[apiName] = value.join(', ');
    } else {
      payload[apiName] = value;
    }
    bodyKeysSentToSf.add(key);
  }

  // Resolve Request_Type__c from request type labels to multipicklist API values (semicolon-separated).
  // Supports all 17 portal options: match by SF label, SF value, or canonical "Label_With_Underscores".
  const labels = Array.isArray(body.requestTypeLabels)
    ? (body.requestTypeLabels as string[]).filter((l): l is string => typeof l === 'string')
    : typeof body.requestTypeLabels === 'string'
      ? [body.requestTypeLabels]
      : [];
  if (labels.length > 0 && createable.has('Request_Type__c')) {
    const apiValue = resolveRequestTypeApiValues(labels, requestTypePicklistResult);
    if (apiValue != null) {
      console.log(`[support-request] Resolved Request_Type__c: "${apiValue}" from labels: ${JSON.stringify(labels)}`);
      payload['Request_Type__c'] = apiValue;
      bodyKeysSentToSf.add('requestTypeLabels');
    } else {
      console.log(`[support-request] No Request_Type__c match for labels: ${JSON.stringify(labels)} – omitting (nillable)`);
    }
  }

  // Case_Name__c is a formula (from Project__c) and not writable. Prepend the
  // selected case name to the description so it's visible on the record.
  const caseName = typeof body.caseName === 'string' ? body.caseName.trim() : '';
  if (caseName && payload['Website_Detail_Summary__c']) {
    payload['Website_Detail_Summary__c'] = `[Case: ${caseName}]\n${payload['Website_Detail_Summary__c']}`;
    bodyKeysSentToSf.add('caseName');
  } else if (caseName) {
    payload['Website_Detail_Summary__c'] = `[Case: ${caseName}]`;
    bodyKeysSentToSf.add('caseName');
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

  const recordTypeId = process.env.SUPPORT_CHANNEL_RECORD_TYPE_ID?.trim();
  if (recordTypeId) {
    payload['RecordTypeId'] = recordTypeId;
  }

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

  let result: { id: string };
  try {
    result = await sfFetchWithStoredToken<{ id: string }>(`/sobjects/${SOBJECT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (createErr) {
    const errMsg = createErr instanceof Error ? createErr.message : String(createErr);
    if (payload['Request_Type__c'] && /restricted picklist|INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST/i.test(errMsg)) {
      console.warn(`[support-request] bad value for restricted picklist field: ${payload['Request_Type__c']} – retrying without Request_Type__c`);
      delete payload['Request_Type__c'];
      result = await sfFetchWithStoredToken<{ id: string }>(`/sobjects/${SOBJECT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      throw createErr;
    }
  }
  const id = result.id;
  console.log('[support-request] Create success, new record id:', id);

  // Fire-and-forget: notify Teams channel (never block or fail the request)
  const webhookUrl = process.env.SUPPORT_SUBMISSION_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    const caseName: string =
      typeof body.caseName === 'string'
        ? body.caseName
        : typeof body.caseProjectName === 'string'
          ? body.caseProjectName
          : typeof body.caseId === 'string'
            ? body.caseId
            : 'Unknown case';
    const requestTypes: string = Array.isArray(body.requestTypeLabels)
      ? (body.requestTypeLabels as string[]).join(', ')
      : typeof body.requestTypeLabels === 'string'
        ? body.requestTypeLabels
        : '—';
    notifySupportSubmissionTeams(webhookUrl, { caseName, requestTypes });
  }

  return Response.json({ success: true, id });
}
