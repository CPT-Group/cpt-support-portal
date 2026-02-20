import { NextRequest } from 'next/server';
import {
  sfFetchWithStoredToken,
  readStoredTokens,
} from '@/services/api/salesforceOAuth';

export const dynamic = 'force-dynamic';

const SOBJECT = 'Support_Channel__c';

/**
 * Map portal form / submission keys to Support_Channel__c API names.
 * Matched to actual describe: Website_Detail_Summary__c, Case_Email__c, Case_No__c, Type__c.
 * OwnerId and Project__c are required and set in the route from userinfo + env (Support project).
 * Body includes case identity for relations: caseId = selected case's Salesforce Project__c Id,
 * caseName, caseCaseID, caseProjectName so you can filter/link in SF; if you add a Case_Project__c
 * lookup, map caseId to it here.
 */
const PORTAL_TO_SF_FIELD: Record<string, string> = {
  reason: 'Website_Detail_Summary__c',
  description: 'Website_Detail_Summary__c',
  email: 'Case_Email__c',
  contact_email: 'Case_Email__c',
  caseCaseID: 'Case_No__c',
  caseId: 'Case_No__c',
  requestTypeLabels: 'Type__c',
  requestTypes: 'Type__c',
};

interface DescribeField {
  name: string;
  type: string;
  createable?: boolean;
  nillable?: boolean;
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
  const payload: Record<string, unknown> = {};
  const bodyKeysSentToSf = new Set<string>();

  for (const [key, value] of Object.entries(body)) {
    if (value === undefined || value === null) continue;
    const apiName = PORTAL_TO_SF_FIELD[key] ?? key;
    if (!createable.has(apiName)) continue;
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) continue;
      payload[apiName] = value.join(', ');
    } else {
      payload[apiName] = value;
    }
    bodyKeysSentToSf.add(key);
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
  return Response.json({ success: true, id });
}
