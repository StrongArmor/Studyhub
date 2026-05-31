import { mapApplication } from '../utils/serializers.js';
import { getApplications as serviceGetApplications, deleteApplication } from '../services/applications.service.js';
import { insertActivity as addActivity } from '../services/activity.service.js';
import { createTutor, getTutorByUserId } from '../services/tutors.service.js';
import { db } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/responses.js';
import bcrypt from 'bcryptjs';

const query = (text, params = []) => db.query(text, params);

const buildInitials = (name) => String(name || '')
  .trim()
  .split(/\s+/)
  .filter(Boolean)
  .map((part) => part[0])
  .join('')
  .slice(0, 3)
  .toUpperCase() || 'TUT';

const promoteApplicationToTutor = async (application) => {
  let userId = application.userId || (await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [application.email])).rows[0]?.id || null;
  if (!userId) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const userRow = await query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [application.name, application.email, hashedPassword, 'tutor']
    );
    userId = userRow.rows[0].id;
  } else {
    await query('UPDATE users SET role = $1 WHERE id = $2', ['tutor', userId]);
  }

  const existingTutor = await getTutorByUserId(userId);
  const tutorRow = existingTutor || await createTutor({
    userId,
    name: application.name,
    initials: buildInitials(application.name),
    subjects: application.subjects || [],
    rating: 0,
    reviews: 0,
    price: Number(application.price || 0),
    sessions: 0,
    status: 'Offline',
    bio: String(application.bio ?? ''),
    desc: String(application.experience ?? ''),
    color: '#3B5BDB',
    timeSlot: 'evening',
    availableSlots: [],
    active: true,
    skills: application.subjects || [],
    coverImage: '',
    totalHours: 0,
    totalStudents: 0,
    scheduleSlots: [],
    selectedSlots: [],
    declineCount: 0
  });

  return tutorRow;
};

export const createApplication = async (req, res) => {
  const body = req.body || {};
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const subjects = Array.isArray(body.subjects) ? body.subjects.filter(Boolean) : [];
  // try to resolve existing user by email
  const userRow = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email]);
  const userId = userRow.rows[0] ? userRow.rows[0].id : null;
  if (!name || !email || subjects.length === 0) {
    sendError(res, 400, 'Vui lòng nhập đủ thông tin và chọn ít nhất một môn học');
    return;
  }

  const created = (await query(
    'INSERT INTO applications (user_id, name, email, phone, subjects_json, education, experience, price, bio, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
    [userId, name, email, String(body.phone ?? ''), JSON.stringify(subjects), String(body.education ?? ''), String(body.experience ?? ''), body.price === undefined || body.price === null ? '' : String(body.price), String(body.bio ?? ''), 'pending', new Date().toISOString()]
  )).rows[0];

  await addActivity('application', 'Có đăng ký gia sư mới', name);
  sendSuccess(res, { application: mapApplication(created) }, 'Tạo đăng ký thành công', 201);
};

export const getAdminApplications = async (_req, res) => {
  const apps = (await serviceGetApplications()).map(mapApplication);
  sendSuccess(res, { applications: apps }, 'Lấy dữ liệu thành công');
};

export const patchApplicationStatus = async (req, res) => {
  const updated = (await query('UPDATE applications SET status = $1 WHERE id = $2 RETURNING *', [String(req.body?.status ?? 'pending'), Number(req.params.id)])).rows[0];
  if (!updated) {
    sendError(res, 404, 'Không tìm thấy đăng ký');
    return;
  }

  const application = mapApplication(updated);
  let tutor = null;
  if (application.status === 'approved') {
    await addActivity('application', 'Đăng ký gia sư được duyệt', application.name);
    tutor = await promoteApplicationToTutor(application);
  }

  sendSuccess(res, { application, tutor: tutor ? { id: tutor.id, name: tutor.name, initials: tutor.initials } : null }, 'Cập nhật đăng ký thành công');
};

export const deleteAdminApplication = async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await deleteApplication(id);
  if (!deleted) {
    sendError(res, 404, 'Không tìm thấy đăng ký');
    return;
  }

  await addActivity('application', 'Đăng ký gia sư bị xóa', deleted.name || `ID:${id}`);
  sendSuccess(res, { application: mapApplication(deleted) }, 'Xóa đăng ký thành công');
};
