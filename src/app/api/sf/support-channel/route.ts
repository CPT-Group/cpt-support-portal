import { NextRequest } from 'next/server';
import { sfFetchWithStoredToken } from '@/services/api/salesforceOAuth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/sf/support-channel
 * Read-only: returns existing Support_Channel__c records (same list the portal POSTs to).
 * Use to check if the list is empty or to confirm new records after submit.
 *
 * GET /api/sf/support-channel?id={recordId}
 * Returns the full record (all fields) for that Support_Channel__c Id.
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')?.trim();
  if (id) {
    const record = await sfFetchWithStoredToken<Record<string, unknown>>(
      `/sobjects/Support_Channel__c/${id}`
    );
    return Response.json({ success: true, record });
  }

  const soql = 'SELECT Id, Name, CreatedDate FROM Support_Channel__c ORDER BY CreatedDate DESC LIMIT 50';
  const encoded = encodeURIComponent(soql);
  const result = await sfFetchWithStoredToken<{
    totalSize: number;
    done: boolean;
    records: Array<{ Id: string; Name?: string; CreatedDate?: string }>;
  }>(`/query?q=${encoded}`);

  return Response.json({
    success: true,
    totalSize: result.totalSize ?? 0,
    records: result.records ?? [],
    message: result.totalSize === 0 ? 'No Support_Channel__c records yet (list is empty).' : undefined,
  });
}
