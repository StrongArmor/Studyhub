import { Router } from 'express';
import { db } from '../config/db.js';
import { httpError } from '../utils/errors.js';
import { sendSuccess } from '../utils/responses.js';
import { generateToken, authenticate, authorize } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import {
  mapActivity,
  mapApplication,
  mapBooking,
  mapCertificate,
  mapDocument,
  mapReport,
  mapTutor,
  mapTutorProfile,
  mapUser,
  mapWallet,
  mapWalletTransaction
} from '../utils/serializers.js';

import {
  createTutor,
  updateTutor,
  deleteTutor,
  getTutors as serviceGetTutors,
  getTutorById
} from '../services/tutors.service.js';
import { deleteApplication, getApplications as serviceGetApplications } from '../services/applications.service.js';
import { deleteCertificate, deleteDocument, getProfile as serviceGetProfile } from '../services/profile.service.js';
import { insertActivity as addActivity, getActivities as serviceGetActivities } from '../services/activity.service.js';
import {
  createBooking,
  cancelBooking,
  completeBooking,
  addReview
} from '../controllers/bookings.controller.js';
import { createReport } from '../controllers/reports.controller.js';
import {
  getWallet as getWalletController,
  topup as topupController,
  withdraw as withdrawController
} from '../controllers/wallet.controller.js';
import {
  getTutorProfile,
  patchTutorProfile,
  addCertificate,
  addDocument,
  deleteCertificateHandler,
  deleteDocumentHandler
} from '../controllers/profile.controller.js';
import {
  getAdminTutors,
  createAdminTutor,
  patchAdminTutor,
  deleteAdminTutor
} from '../controllers/tutors.controller.js';
import {
  createApplication,
  getAdminApplications,
  patchApplicationStatus,
  deleteAdminApplication
} from '../controllers/applications.controller.js';

const router = Router();
const revenueSeries = [
  { label: 'T2', value: 8.2 },
  { label: 'T3', value: 9.5 },
  { label: 'T4', value: 11.0 },
  { label: 'T5', value: 10.1 },
  { label: 'T6', value: 12.4 },
  { label: 'T7', value: 13.2 },
  { label: 'CN', value: 15.0 }
];
const bookingStatus = [
  { label: 'Đã xác nhận', value: 52 },
  { label: 'Hoàn thành', value: 31 },
  { label: 'Đã hủy', value: 7 },
  { label: 'Chờ xử lý', value: 10 }
];

const normalizeText = (value) => String(value ?? '').trim();
const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const nowIso = () => new Date().toISOString();
const nowLabel = () => 'Vừa xong';
const wrap = (handler) => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
const query = (text, params = []) => db.query(text, params);
const rows = async (text, params = []) => (await query(text, params)).rows;
const row = async (text, params = []) => (await query(text, params)).rows[0];

const getTutors = async () => (await serviceGetTutors()).map(mapTutor);
const getBookings = async () => (await rows('SELECT * FROM bookings ORDER BY id DESC')).map(mapBooking);
const getApplications = async () => (await serviceGetApplications()).map(mapApplication);
const getActivities = async () => (await serviceGetActivities()).map(mapActivity);
const getReports = async () => (await rows('SELECT * FROM reports ORDER BY id DESC')).map(mapReport);
const getUsers = async () => (await rows('SELECT * FROM users ORDER BY id')).map(mapUser);
const getWalletTransactions = async () => (await rows('SELECT * FROM wallet_transactions ORDER BY id DESC')).map(mapWalletTransaction);
const getCertificates = async () => (await rows('SELECT * FROM tutor_certificates ORDER BY id DESC')).map(mapCertificate);
const getDocuments = async () => (await rows('SELECT * FROM tutor_documents ORDER BY id DESC')).map(mapDocument);
const getOtpSession = async (email) => row('SELECT * FROM otp_sessions WHERE email = $1', [email]);

const getWallet = async () => {
  const walletRow = await row('SELECT * FROM wallet WHERE id = 1');
  return { ...mapWallet(walletRow), transactions: await getWalletTransactions() };
};

const getProfile = async (userId = null) => {
  const { profileRow, certificates, documents } = await serviceGetProfile(userId);
  return mapTutorProfile(profileRow, certificates, documents);
};

// activities are handled by activity.service -> use `addActivity(type, title, detail)`

const buildAdminStats = async () => {
  const totalUsers = Number((await row('SELECT COUNT(*) AS count FROM users')).count);
  const activeTutors = Number((await row("SELECT COUNT(*) AS count FROM users WHERE role = 'tutor' AND status = 'active'")).count);
  const pendingApplications = Number((await row("SELECT COUNT(*) AS count FROM applications WHERE status = 'pending'")).count);
  const totalBookings = Number((await row('SELECT COUNT(*) AS count FROM bookings')).count);
  const onlineTutors = Number((await row("SELECT COUNT(*) AS count FROM tutors WHERE status = 'Online'")).count);
  const approvedApplications = Number((await row("SELECT COUNT(*) AS count FROM applications WHERE status = 'approved'")).count);
  const applicationCount = Number((await row('SELECT COUNT(*) AS count FROM applications')).count);

  return {
    totalUsers,
    activeTutors,
    pendingApplications,
    todayRevenue: 12400000,
    totalBookings,
    onlineTutors,
    approvalRate: applicationCount === 0 ? 0 : Math.round((approvedApplications / applicationCount) * 100),
    avgRating: 4.87
  };
};

router.get('/health', wrap(async (_req, res) => {
  sendSuccess(res, { service: 'StudyHub API', timestamp: nowIso() }, 'Lấy dữ liệu thành công');
}));

router.get('/subjects', wrap(async (_req, res) => {
  const tutors = await getTutors();
  const subjects = [...new Set(tutors.flatMap((tutor) => tutor.subjects))].sort();
  sendSuccess(res, { subjects }, 'Lấy dữ liệu thành công');
}));

router.get('/dashboard', wrap(async (_req, res) => {
  const tutors = await getTutors();
  const bookings = await getBookings();
  const applications = await getApplications();

  sendSuccess(res, {
    stats: {
      tutors: tutors.length,
      bookings: bookings.length,
      onlineNow: tutors.filter((tutor) => tutor.status === 'Online').length,
      applications: applications.length
    },
    featuredTutors: tutors.slice(0, 4),
    bookings,
    applications
  }, 'Lấy dữ liệu thành công');
}));

router.get('/tutors', wrap(async (req, res) => {
  const search = normalizeText(req.query.search).toLowerCase();
  const subject = normalizeText(req.query.subject);
  const minRating = toNumber(req.query.minRating, 0);
  const maxPrice = toNumber(req.query.maxPrice, Number.POSITIVE_INFINITY);
  const tutors = (await getTutors()).filter((tutor) => {
    const haystack = `${tutor.name} ${tutor.subjects.join(' ')}`.toLowerCase();
    return (!search || haystack.includes(search))
      && (!subject || tutor.subjects.includes(subject))
      && tutor.rating >= minRating
      && tutor.price <= maxPrice;
  });

  sendSuccess(res, { tutors }, 'Lấy dữ liệu thành công');
}));

router.get('/bookings', wrap(async (_req, res) => {
  sendSuccess(res, { bookings: await getBookings() }, 'Lấy dữ liệu thành công');
}));

router.post('/bookings', authenticate, wrap(createBooking));

router.patch('/bookings/:id/cancel', authenticate, wrap(cancelBooking));

router.patch('/bookings/:id/complete', authenticate, wrap(completeBooking));

router.post('/bookings/:id/reviews', authenticate, wrap(addReview));

router.post('/reports', authenticate, wrap(createReport));

router.get('/wallet', authenticate, wrap(getWalletController));

router.get('/wallet/transactions', wrap(async (_req, res) => {
  sendSuccess(res, { transactions: await getWalletTransactions() }, 'Lấy dữ liệu thành công');
}));

router.post('/wallet/topup', authenticate, wrap(topupController));

router.post('/wallet/withdraw', authenticate, wrap(withdrawController));

router.get('/tutor/profile', authenticate, wrap(getTutorProfile));

router.patch('/tutor/profile', authenticate, authorize('tutor'), wrap(patchTutorProfile));

router.post('/tutor/profile/certificates', authenticate, authorize('tutor'), wrap(addCertificate));

router.post('/tutor/profile/documents', authenticate, authorize('tutor'), wrap(addDocument));

router.post('/auth/otp/send', wrap(async (req, res) => {
  const email = normalizeText(req.body?.email);
  if (!email) {
    throw httpError(400, 'Thiếu email');
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 5 * 60 * 1000;
  await query('INSERT INTO otp_sessions (email, code, expires_at, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at, created_at = EXCLUDED.created_at', [email, code, expiresAt, nowIso()]);
  sendSuccess(res, { email, code, expiresIn: 300 }, 'OTP đã được gửi');
}));

router.post('/auth/otp/verify', wrap(async (req, res) => {
  const email = normalizeText(req.body?.email);
  const otp = normalizeText(req.body?.otp);
  if (!email || !otp) {
    throw httpError(400, 'Thiếu email hoặc OTP');
  }

  const session = await getOtpSession(email);
  if (!session || session.code !== otp || session.expires_at < Date.now()) {
    throw httpError(401, 'OTP không hợp lệ');
  }

  await query('DELETE FROM otp_sessions WHERE email = $1', [email]);
  sendSuccess(res, null, 'Xác thực OTP thành công');
}));

router.post('/login', wrap(async (req, res) => {
  const email = normalizeText(req.body?.email);
  const password = normalizeText(req.body?.password);
  const user = await row('SELECT * FROM users WHERE email = $1', [email]);

  if (!user) {
    throw httpError(401, 'Email hoặc mật khẩu không đúng');
  }

  // compare hashed password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw httpError(401, 'Email hoặc mật khẩu không đúng');
  }

  if (user.status === 'blocked') {
    throw httpError(403, 'Tài khoản đã bị khóa');
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  sendSuccess(res, { access_token: token, user: mapUser(user) }, 'Đăng nhập thành công');
}));

router.patch('/users/me', authenticate, wrap(async (req, res) => {
  const { name, avatar } = req.body ?? {};
  const sets = [];
  const params = [];
  if (name !== undefined) sets.push(`name = $${params.push(String(name).trim())}`);
  if (avatar !== undefined) sets.push(`avatar = $${params.push(String(avatar).trim())}`);
  if (!sets.length) throw httpError(400, 'Không có dữ liệu cần cập nhật');
  params.push(req.user.id);
  const updated = await row(`UPDATE users SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`, params);
  sendSuccess(res, { user: mapUser(updated) }, 'Cập nhật thành công');
}));

router.post('/register', wrap(async (req, res) => {
  const name = normalizeText(req.body?.name);
  const email = normalizeText(req.body?.email);
  const password = normalizeText(req.body?.password);
  const role = ['user', 'tutor', 'admin'].includes(normalizeText(req.body?.role)) ? normalizeText(req.body?.role) : 'user';

  if (!name || !email || !password) {
    throw httpError(400, 'Thiếu thông tin đăng ký');
  }

  if (await row('SELECT 1 FROM users WHERE email = $1', [email])) {
    throw httpError(409, 'Email đã tồn tại');
  }

  // hash password before storing
  const hashed = await bcrypt.hash(password, 10);
  const created = await row('INSERT INTO users (email, password, role, name, status) VALUES ($1, $2, $3, $4, $5) RETURNING *', [email, hashed, role, name, 'active']);
  await query('INSERT INTO wallet (user_id, balance, banks_json) VALUES ($1, 200000, $2) ON CONFLICT (user_id) DO NOTHING', [created.id, '[]']);
  await addActivity('user', 'Tài khoản mới được tạo', email);
  const token = generateToken({ id: created.id, email: created.email, role: created.role });
  sendSuccess(res, { token, user: { id: created.id, name: created.name, email: created.email, role: created.role } }, 'Đăng ký thành công', 201);
}));

router.post('/applications', wrap(createApplication));

router.get('/admin/overview', authenticate, authorize('admin'), wrap(async (_req, res) => {
  sendSuccess(res, { stats: await buildAdminStats(), revenueSeries, bookingStatus, activities: await getActivities() }, 'Lấy dữ liệu thành công');
}));

router.get('/admin/users', authenticate, authorize('admin'), wrap(async (_req, res) => {
  sendSuccess(res, { users: await getUsers() }, 'Lấy dữ liệu thành công');
}));

router.get('/admin/tutors', authenticate, authorize('admin'), wrap(getAdminTutors));

router.get('/admin/applications', authenticate, authorize('admin'), wrap(getAdminApplications));

router.get('/admin/reports', authenticate, authorize('admin'), wrap(async (_req, res) => {
  sendSuccess(res, {
    stats: await buildAdminStats(),
    revenueSeries,
    bookingStatus,
    activities: await getActivities(),
    applications: await getApplications(),
    users: await getUsers(),
    tutors: await getTutors(),
    reports: await getReports()
  }, 'Lấy dữ liệu thành công');
}));

router.get('/admin/activities', authenticate, authorize('admin'), wrap(async (_req, res) => {
  sendSuccess(res, { activities: await getActivities() }, 'Lấy dữ liệu thành công');
}));

router.patch('/admin/applications/:id', authenticate, authorize('admin'), wrap(patchApplicationStatus));

router.patch('/admin/users/:email/status', authenticate, authorize('admin'), wrap(async (req, res) => {
  const updated = await row('UPDATE users SET status = $1 WHERE email = $2 RETURNING *', [normalizeText(req.body?.status) || 'active', req.params.email]);
  if (!updated) {
    throw httpError(404, 'Không tìm thấy người dùng');
  }

  sendSuccess(res, { user: mapUser(updated) }, 'Cập nhật người dùng thành công');
}));

// --- Tutors CRUD (admin) ---
router.post('/admin/tutors', authenticate, authorize('admin'), wrap(createAdminTutor));

router.patch('/admin/tutors/:id', authenticate, authorize('admin'), wrap(patchAdminTutor));

router.delete('/admin/tutors/:id', authenticate, authorize('admin'), wrap(deleteAdminTutor));

// --- Applications: delete (admin) already has patch to update status ---
router.delete('/admin/applications/:id', authenticate, authorize('admin'), wrap(deleteAdminApplication));

// --- Tutor profile: remove certificate / document ---
router.delete('/tutor/profile/certificates/:id', wrap(deleteCertificateHandler));

router.delete('/tutor/profile/documents/:id', wrap(deleteDocumentHandler));

export { router as apiRouter };
