import { mapCertificate, mapDocument, mapTutorProfile } from '../utils/serializers.js';
import { getProfile as serviceGetProfile, deleteCertificate, deleteDocument } from '../services/profile.service.js';
import { insertActivity as addActivity } from '../services/activity.service.js';
import { db } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/responses.js';

const query = (text, params = []) => db.query(text, params);

export const getTutorProfile = async (_req, res) => {
  const userId = Number(_req.query?.userId ?? null);
  const { profileRow, certificates, documents } = await serviceGetProfile(userId);
  sendSuccess(res, { profile: mapTutorProfile(profileRow, certificates, documents) }, 'Lấy dữ liệu thành công');
};

export const patchTutorProfile = async (req, res) => {
  const userId = Number(req.query?.userId ?? null);
  const { profileRow, certificates, documents } = await serviceGetProfile(userId);
  const body = req.body || {};
  const uid = profileRow?.user_id ?? userId;
  const updated = (await query(
    'UPDATE tutor_profile SET bio = $1, skills_json = $2, cover_image = $3, total_hours = $4, total_students = $5, rating = $6, schedule_slots_json = $7, selected_slots_json = $8, decline_count = $9 WHERE user_id = $10 RETURNING *',
    [String(body.bio ?? profileRow?.bio), JSON.stringify(body.skills ?? JSON.parse(profileRow?.skills_json || '[]')), String(body.coverImage ?? profileRow?.cover_image), Number(body.totalHours ?? profileRow?.total_hours), Number(body.totalStudents ?? profileRow?.total_students), Number(body.rating ?? profileRow?.rating), JSON.stringify(body.scheduleSlots ?? JSON.parse(profileRow?.schedule_slots_json || '[]')), JSON.stringify(body.selectedSlots ?? JSON.parse(profileRow?.selected_slots_json || '[]')), Number(body.declineCount ?? profileRow?.decline_count), uid]
  )).rows[0];

  sendSuccess(res, { profile: mapTutorProfile(updated, certificates, documents) }, 'Cập nhật hồ sơ thành công');
};

export const addCertificate = async (req, res) => {
  const name = String(req.body?.name || req.body?.fileName || req.body?.certificate || '').trim();
  if (!name) {
    sendError(res, 400, 'Thiếu tên chứng chỉ');
    return;
  }

  const userId = Number(req.query?.userId ?? null) || null;
  const created = (await query('INSERT INTO tutor_certificates (user_id, name, url, issued_at) VALUES ($1, $2, $3, $4) RETURNING *', [userId, name, String(req.body?.url ?? ''), String(req.body?.issuedAt ?? new Date().toISOString())])).rows[0];
  const { profileRow, certificates, documents } = await serviceGetProfile(userId);
  sendSuccess(res, { certificate: mapCertificate(created), profile: mapTutorProfile(profileRow, certificates, documents) }, 'Thêm chứng chỉ thành công', 201);
};

export const addDocument = async (req, res) => {
  const name = String(req.body?.name || req.body?.fileName || req.body?.document || '').trim();
  if (!name) {
    sendError(res, 400, 'Thiếu tên tài liệu');
    return;
  }

  const userId = Number(req.query?.userId ?? null) || null;
  const created = (await query('INSERT INTO tutor_documents (user_id, name, url, uploaded_at) VALUES ($1, $2, $3, $4) RETURNING *', [userId, name, String(req.body?.url ?? ''), String(req.body?.uploadedAt ?? new Date().toISOString())])).rows[0];
  const { profileRow, certificates, documents } = await serviceGetProfile(userId);
  sendSuccess(res, { document: mapDocument(created), profile: mapTutorProfile(profileRow, certificates, documents) }, 'Thêm tài liệu thành công', 201);
};

export const deleteCertificateHandler = async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await deleteCertificate(id);
  if (!deleted) {
    sendError(res, 404, 'Không tìm thấy chứng chỉ');
    return;
  }

  const userId = Number(req.query?.userId ?? null);
  const { profileRow, certificates, documents } = await serviceGetProfile(userId);
  sendSuccess(res, { certificate: mapCertificate(deleted), profile: mapTutorProfile(profileRow, certificates, documents) }, 'Xóa chứng chỉ thành công');
};

export const deleteDocumentHandler = async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await deleteDocument(id);
  if (!deleted) {
    sendError(res, 404, 'Không tìm thấy tài liệu');
    return;
  }

  const userId = Number(req.query?.userId ?? null);
  const { profileRow, certificates, documents } = await serviceGetProfile(userId);
  sendSuccess(res, { document: mapDocument(deleted), profile: mapTutorProfile(profileRow, certificates, documents) }, 'Xóa tài liệu thành công');
};
