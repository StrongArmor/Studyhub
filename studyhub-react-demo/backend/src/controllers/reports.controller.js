import { db } from '../config/db.js';
import { mapReport } from '../utils/serializers.js';
import { insertActivity as addActivity } from '../services/activity.service.js';
import { sendError, sendSuccess } from '../utils/responses.js';

const query = (text, params = []) => db.query(text, params);

export const createReport = async (req, res) => {
  const body = req.body || {};
  const bookingId = Number(body.bookingId);
  const tutorId = Number(body.tutorId ?? null);
  const studentId = Number(body.studentId ?? null);
  const issue = String(body.issue ?? 'quality').trim();
  const detail = String(body.detail ?? '').trim();

  if (!Number.isFinite(bookingId) || !Number.isFinite(tutorId) || !detail) {
    sendError(res, 400, 'Thiếu thông tin báo cáo');
    return;
  }

  // resolve names for human-readable activity
  const tutorRes = await query('SELECT name FROM users WHERE id = $1 LIMIT 1', [tutorId]);
  const tutorName = tutorRes.rows[0] ? tutorRes.rows[0].name : '';
  const studentRes = Number.isFinite(studentId) ? await query('SELECT name FROM users WHERE id = $1 LIMIT 1', [studentId]) : { rows: [] };
  const studentName = studentRes.rows[0] ? studentRes.rows[0].name : 'Học viên Demo';

  const created = (await query('INSERT INTO reports (booking_id, tutor_id, student_id, tutor_name, student_name, issue, detail, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [bookingId, tutorId, Number.isFinite(studentId) ? studentId : null, tutorName, studentName, issue, detail, 'pending', new Date().toISOString()])).rows[0];

  await addActivity('report', 'Có báo cáo mới', `${tutorName} - ${issue}`);
  sendSuccess(res, { report: mapReport(created) }, 'Tạo báo cáo thành công', 201);
};
