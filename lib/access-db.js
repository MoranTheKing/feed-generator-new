import { pool } from "./db.js";

// קבלת כל הקודים
export async function getAccessList() {
  const [rows] = await pool.query("SELECT code, role, panels, editableByLeader FROM access_codes");
  return rows.map(row => ({
    code: row.code,
    role: row.role,
    panels: JSON.parse(row.panels),
    editableByLeader: !!row.editableByLeader,
  }));
}

// קבלת panels לפי קוד
export async function getPanelsForCode(code) {
  const [rows] = await pool.query("SELECT panels FROM access_codes WHERE code = ?", [code]);
  if (rows.length === 0) return [];
  try {
    return JSON.parse(rows[0].panels);
  } catch {
    return [];
  }
}

// קבלת role לפי קוד
export async function getRoleForCode(code) {
  const [rows] = await pool.query("SELECT role FROM access_codes WHERE code = ?", [code]);
  return rows.length ? rows[0].role : null;
}

// הוספת קוד חדש
export async function addAccessCode(newCode, role, panels, editableByLeader = false) {
  await pool.query(
    "INSERT INTO access_codes (code, role, panels, editableByLeader) VALUES (?, ?, ?, ?)",
    [newCode, role, JSON.stringify(panels), editableByLeader]
  );
}

// עדכון panels לפי קוד
export async function updatePanelsForCode(code, panels) {
  await pool.query(
    "UPDATE access_codes SET panels = ? WHERE code = ?",
    [JSON.stringify(panels), code]
  );
}

// הסרת קוד
export async function removeAccessCode(code) {
  await pool.query("DELETE FROM access_codes WHERE code = ?", [code]);
}
