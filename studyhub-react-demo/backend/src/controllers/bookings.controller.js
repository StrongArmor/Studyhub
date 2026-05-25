import { db } from '../config/db.js';
import { mapBooking } from '../utils/serializers.js';
import { insertActivity as addActivity } from '../services/activity.service.js';
import { sendError, sendSuccess } from '../utils/responses.js';

const query = (text, params = []) => db.query(text, params);

export const createBooking = async (req, res) => {
  const body = req.body || {};
  const tutorId = Number(body.tutorId || body.tutor || null);
  const studentId = Number(body.studentId || body.student || null);
  const tutorName = String(body.tutorName || '').trim();
  const subject = String(body.subject ?? '').trim();
  const date = String(body.date ?? '').trim();
  const time = String(body.time ?? '').trim();
  const duration = Number(body.duration);
  const price = Number(body.price);

  if ((!tutorName && !Number.isFinite(tutorId)) || !subject || !date || !time || !Number.isFinite(duration) || !Number.isFinite(price)) {
    sendError(res, 400, 'Thiếu thông tin đặt lịch');
    return;
  }
  // resolve tutor info if id provided
  let resolvedTutorName = tutorName;
  let resolvedTutorInitials = body.tutorInitials || null;
  let resolvedTutorColor = body.tutorColor || null;
  if (Number.isFinite(tutorId)) {
    const u = (await query('SELECT name FROM users WHERE id = $1', [tutorId])).rows[0];
    if (u) resolvedTutorName = u.name;
  }
  if (!resolvedTutorInitials) resolvedTutorInitials = resolvedTutorName ? resolvedTutorName.split(' ').map((p) => p[0]).join('').slice(0, 3).toUpperCase() : 'TUT';
  if (!resolvedTutorColor) resolvedTutorColor = '#3B5BDB';

  const created = (await query('INSERT INTO bookings (tutor_id, student_id, tutor_name, tutor_initials, tutor_color, subject, date, time, duration, price, status, review_json, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *', [Number.isFinite(tutorId) ? tutorId : null, Number.isFinite(studentId) ? studentId : null, resolvedTutorName, resolvedTutorInitials, resolvedTutorColor, subject, date, time, duration, price, 'confirmed', null, new Date().toISOString()])).rows[0];

  const booking = mapBooking(created);
  await addActivity('booking', 'Lịch học mới được tạo', `${booking.tutorName} - ${booking.subject}`);
  sendSuccess(res, { booking }, 'Tạo lịch học thành công', 201);
};

export const cancelBooking = async (req, res) => {
  const updated = (await query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', ['cancelled', Number(req.params.id)])).rows[0];
  if (!updated) {
    sendError(res, 404, 'Không tìm thấy booking');
    return;
  }

  const booking = mapBooking(updated);
  await addActivity('booking', 'Lịch học bị hủy', `${booking.tutorName} - ${booking.subject}`);
  sendSuccess(res, { booking }, 'Hủy lịch học thành công');
};

export const addReview = async (req, res) => {
  const existing = (await query('SELECT * FROM bookings WHERE id = $1', [Number(req.params.id)])).rows[0];
  if (!existing) {
    sendError(res, 404, 'Không tìm thấy booking');
    return;
  }

  const rating = Number(req.body?.rating);
  const comment = String(req.body?.comment ?? '').trim();
  if (!Number.isFinite(rating) || rating < 1 || rating > 5 || !comment) {
    sendError(res, 400, 'Thiếu nội dung đánh giá');
    return;
  }

  const review = { rating, comment, createdAt: new Date().toISOString() };
  const updated = (await query('UPDATE bookings SET review_json = $1 WHERE id = $2 RETURNING *', [JSON.stringify(review), existing.id])).rows[0];
  const booking = mapBooking(updated);
  await addActivity('booking', 'Có đánh giá mới', `${booking.tutorName} - ${rating} sao`);
  sendSuccess(res, { review, booking }, 'Thêm đánh giá thành công', 201);
};
