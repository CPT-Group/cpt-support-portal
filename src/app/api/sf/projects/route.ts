import { sfFetchWithStoredToken } from '@/services/api/salesforceOAuth';
import type { CaseOption } from '@/types/supportRequest';

export const dynamic = 'force-dynamic';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let cache: { at: number; cases: CaseOption[] } | null = null;

interface DescribeField {
  name: string;
  type: string;
  referenceTo?: string[];
}

/**
 * GET /api/sf/projects
 * Returns Project__c records as the case list (CaseOption shape) for the support portal.
 * Source of truth for cases; cached server-side to reduce Salesforce API calls.
 * Also used to pick SUPPORT_CHANNEL_DEFAULT_PROJECT_ID (one Support project Id in .env).
 */
export async function GET() {
  try {
    const now = Date.now();
    if (cache && now - cache.at < CACHE_TTL_MS) {
      return Response.json({
        success: true,
        cases: cache.cases,
        totalSize: cache.cases.length,
        cached: true,
      });
    }

    const describe = await sfFetchWithStoredToken<{ fields: DescribeField[] }>(
      '/sobjects/Support_Channel__c/describe'
    );
    const projectField = (describe.fields ?? []).find((f) => f.name === 'Project__c');
    const refTo = projectField?.referenceTo?.[0];
    const objectName = refTo ?? 'Project__c';

    const soql = `SELECT Id, Name FROM ${objectName} ORDER BY Name LIMIT 500`;
    const encoded = encodeURIComponent(soql);
    const result = await sfFetchWithStoredToken<{
      totalSize: number;
      records: Array<{ Id: string; Name?: string }>;
    }>(`/query?q=${encoded}`);

    const records = result.records ?? [];
    const cases: CaseOption[] = records.map((r) => ({
      id: r.Id,
      label: r.Name ?? r.Id,
      name: r.Name ?? r.Id,
      projectName: r.Name ?? '',
      caseID: r.Id,
    }));

    cache = { at: now, cases };

    return Response.json({
      success: true,
      cases,
      totalSize: cases.length,
      objectName,
      cached: false,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[api/sf/projects]', message);
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
