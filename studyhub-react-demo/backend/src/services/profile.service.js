import { db } from '../config/db.js';

const query = (text, params = []) => db.query(text, params);

export const getProfile = async (userId = null) => {
  let uid = userId;
  if (!Number.isFinite(uid)) {
    const r = (await query("SELECT user_id FROM tutors WHERE user_id IS NOT NULL ORDER BY id LIMIT 1")).rows[0];
    uid = r ? Number(r.user_id) : null;
  }
  const profileRow = uid ? (await query('SELECT * FROM tutors WHERE user_id = $1 LIMIT 1', [uid])).rows[0] : null;
  const certificates = uid ? (await query('SELECT * FROM tutor_certificates WHERE user_id = $1 ORDER BY id DESC', [uid])).rows : [];
  const documents = uid ? (await query('SELECT * FROM tutor_documents WHERE user_id = $1 ORDER BY id DESC', [uid])).rows : [];
  return { profileRow, certificates, documents };
};

export const deleteCertificate = async (id) => (await query('DELETE FROM tutor_certificates WHERE id = $1 RETURNING *', [id])).rows[0];
export const deleteDocument = async (id) => (await query('DELETE FROM tutor_documents WHERE id = $1 RETURNING *', [id])).rows[0];
