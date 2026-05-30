import { mapTutor } from '../utils/serializers.js';
import { createTutor, updateTutor, deleteTutor, getTutors as serviceGetTutors, getTutorById } from '../services/tutors.service.js';
import { insertActivity as addActivity } from '../services/activity.service.js';
import { sendError, sendSuccess } from '../utils/responses.js';

export const getAdminTutors = async (_req, res) => {
  const tutors = (await serviceGetTutors()).map(mapTutor);
  sendSuccess(res, { tutors }, 'Lấy dữ liệu thành công');
};

export const createAdminTutor = async (req, res) => {
  const body = req.body || {};
  const name = String(body.name ?? '').trim();
  const subjects = Array.isArray(body.subjects) ? body.subjects.filter(Boolean) : [];
  if (!name || subjects.length === 0) {
    sendError(res, 400, 'Thiếu tên hoặc môn học cho gia sư');
    return;
  }

  const created = await createTutor({
    name,
    initials: String(body.initials ?? '').trim(),
    subjects,
    rating: Number(body.rating ?? 0),
    reviews: Number(body.reviews ?? 0),
    price: Number(body.price ?? 0),
    sessions: Number(body.sessions ?? 0),
    status: String(body.status ?? 'Offline'),
    bio: String(body.bio ?? ''),
    desc: String(body.desc ?? ''),
    color: String(body.color ?? ''),
    timeSlot: String(body.timeSlot ?? ''),
    availableSlots: Array.isArray(body.availableSlots) ? body.availableSlots : [],
    active: Boolean(body.active ?? true)
  });

  await addActivity('tutor', 'Gia sư mới được thêm', name);
  sendSuccess(res, { tutor: mapTutor(created) }, 'Tạo gia sư thành công', 201);
};

export const patchAdminTutor = async (req, res) => {
  const id = Number(req.params.id);
  const existing = await getTutorById(id);
  if (!existing) {
    sendError(res, 404, 'Không tìm thấy gia sư');
    return;
  }

  const updated = await updateTutor(id, req.body || {}, existing);
  sendSuccess(res, { tutor: mapTutor(updated) }, 'Cập nhật gia sư thành công');
};

export const deleteAdminTutor = async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await deleteTutor(id);
  if (!deleted) {
    sendError(res, 404, 'Không tìm thấy gia sư');
    return;
  }

  await addActivity('tutor', 'Gia sư bị xóa', deleted.name || `ID:${id}`);
  sendSuccess(res, { tutor: mapTutor(deleted) }, 'Xóa gia sư thành công');
};
