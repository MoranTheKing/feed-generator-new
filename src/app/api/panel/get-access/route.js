import { getAccessList } from '../../../../../lib/access-db.js';

export async function GET() {
  try {
    const data = await getAccessList();
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('[get-access] Access list is empty or invalid:', data);
    } else {
      console.log('[get-access] Access List:', JSON.stringify(data));
    }
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('[get-access] Error:', err);
    return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
