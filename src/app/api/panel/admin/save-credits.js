import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.json();
    const filePath = path.join(process.cwd(), 'public/panel/admin/credits.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
