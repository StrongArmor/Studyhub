import { db } from '../config/db.js';

const query = (text, params = []) => db.query(text, params);

export const getProfile = async (userId = null) => {
  let uid = userId;
  if (!Number.isFinite(uid)) {
    const r = (await query("SELECT id FROM users WHERE role = 'tutor' LIMIT 1")).rows[0];
    uid = r ? r.id : null;
  }
  const profileRow = uid ? (await query('SELECT * FROM tutor_profile WHERE user_id = $1', [uid])).rows[0] : null;
  const certificates = uid ? (await query('SELECT * FROM tutor_certificates WHERE user_id = $1 ORDER BY id DESC', [uid])).rows : [];
  const documents = uid ? (await query('SELECT * FROM tutor_documents WHERE user_id = $1 ORDER BY id DESC', [uid])).rows : [];
  return { profileRow, certificates, documents };
};

export const deleteCertificate = async (id) => (await query('DELETE FROM tutor_certificates WHERE id = $1 RETURNING *', [id])).rows[0];
export const deleteDocument = async (id) => (await query('DELETE FROM tutor_documents WHERE id = $1 RETURNING *', [id])).rows[0];
