

import { addAccessCode } from '../../../../../lib/access-db.js';
import { pool } from '../../../../../lib/db.js';

export async function POST(request) {
  try {
    const codes = await request.json();
    // Remove all existing codes
    await pool.query('DELETE FROM access_codes');
    // Add new codes
    for (const code of codes) {
      await addAccessCode(code.code, code.role, code.panels, code.editableByLeader || false);
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
