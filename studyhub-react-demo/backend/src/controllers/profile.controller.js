import { mapCertificate, mapDocument, mapTutorProfile } from '../utils/serializers.js';
import { getProfile as serviceGetProfile, deleteCertificate, deleteDocument } from '../services/profile.service.js';
import { insertActivity as addActivity } from '../services/activity.service.js';
import { db } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/responses.js';
import { upsertTutorByUserId } from '../services/tutors.service.js';

const query = (text, params = []) => db.query(text, params);

export const getTutorProfile = async (_req, res) => {
  const userId = Number(_req.user?.id ?? _req.query?.userId ?? null);
  const { profileRow, certificates, documents } = await serviceGetProfile(userId);
  sendSuccess(res, { profile: mapTutorProfile(profileRow, certificates, documents) }, 'Lấy dữ liệu thành công');
};

export const patchTutorProfile = async (req, res) => {
  const userId = Number(req.user?.id ?? req.query?.userId ?? null);
  const { profileRow, certificates, documents } = await serviceGetProfile(userId);
  const body = req.body || {};
  const updated = await upsertTutorByUserId(profileRow?.user_id ?? userId, {
    bio: body.bio ?? profileRow?.bio,
    skills: Array.isArray(body.skills) ? body.skills : [],
    coverImage: body.coverImage ?? profileRow?.cover_image,
    totalHours: body.totalHours ?? profileRow?.total_hours,
    totalStudents: body.totalStudents ?? profileRow?.total_students,
    rating: body.rating ?? profileRow?.rating,
    scheduleSlots: Array.isArray(body.scheduleSlots) ? body.scheduleSlots : [],
    selectedSlots: Array.isArray(body.selectedSlots) ? body.selectedSlots : [],
    declineCount: body.declineCount ?? profileRow?.decline_count
  });

  sendSuccess(res, { profile: mapTutorProfile(updated, certificates, documents) }, 'Cập nhật hồ sơ thành công');
};

export const addCertificate = async (req, res) => {
  const name = String(req.body?.name || req.body?.fileName || req.body?.certificate || '').trim();
  if (!name) {
    sendError(res, 400, 'Thiếu tên chứng chỉ');
    return;
  }

  const userId = Number(req.user?.id ?? req.query?.userId ?? null) || null;
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

  const userId = Number(req.user?.id ?? req.query?.userId ?? null) || null;
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

  const userId = Number(req.user?.id ?? req.query?.userId ?? null);
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

  const userId = Number(req.user?.id ?? req.query?.userId ?? null);
  const { profileRow, certificates, documents } = await serviceGetProfile(userId);
  sendSuccess(res, { document: mapDocument(deleted), profile: mapTutorProfile(profileRow, certificates, documents) }, 'Xóa tài liệu thành công');
};
