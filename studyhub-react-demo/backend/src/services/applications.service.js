import { db } from '../config/db.js';

const query = (text, params = []) => db.query(text, params);

export const getApplications = async () => (await query('SELECT * FROM applications ORDER BY id DESC')).rows;
export const deleteApplication = async (id) => (await query('DELETE FROM applications WHERE id = $1 RETURNING *', [id])).rows[0];
