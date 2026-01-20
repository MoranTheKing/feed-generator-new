
import { pool } from '../lib/db.js';

async function main() {
    try {
        const code = '1234';
        const role = 'admin';
        const panels = JSON.stringify(['feed', 'eruhim', 'admin']);

        console.log(`Adding admin code: ${code}...`);

        await pool.query(
            "INSERT INTO access_codes (code, role, panels, editableByLeader) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE role = VALUES(role), panels = VALUES(panels)",
            [code, role, panels, 0]
        );

        console.log('Admin code added successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error adding admin code:', err);
        process.exit(1);
    }
}

main();
