

import { addAccessCode, removeAccessCode, getAccessList } from '../../../panel/access.js';

export async function POST(request) {
  try {
    const codes = await request.json();
    // Remove all existing codes
    const list = getAccessList();
    while (list.length > 0) list.pop();
    // Add new codes
    for (const code of codes) {
      addAccessCode(code.code, code.role, code.panels);
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
