

import { getAccessList } from '../../../panel/access.js';

export async function GET() {
  try {
    const data = getAccessList();
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
