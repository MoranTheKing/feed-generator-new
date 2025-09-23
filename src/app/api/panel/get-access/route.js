

import { getAccessList } from '../../../panel/access-db.js';

export async function GET() {
  try {
    const data = await getAccessList();
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    // Always return an array, even on error
    return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
