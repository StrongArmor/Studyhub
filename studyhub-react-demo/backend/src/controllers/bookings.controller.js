import { db } from '../config/db.js';
import { mapBooking, mapTutor } from '../utils/serializers.js';
import { insertActivity as addActivity } from '../services/activity.service.js';
import { sendError, sendSuccess } from '../utils/responses.js';
import { createGoogleMeetEvent, isGoogleMeetConfigured } from '../services/googleMeet.service.js';

const query = (text, params = []) => db.query(text, params);

const generateFallbackMeetLink = () => {
  const seg = () => Math.random().toString(36).slice(2, 5);
  return `https://meet.google.com/${seg()}-${seg()}${seg().slice(0,1)}-${seg()}`;
};

export const createBooking = async (req, res) => {
  const body = req.body || {};
  const tutorId = Number(body.tutorId || body.tutor || null);
  const studentId = Number(body.studentId || body.student || req.user?.id || null);
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

  const userId = req.user?.id;
  if (userId && price > 0) {
    await query('INSERT INTO wallet (user_id, balance, banks_json) VALUES ($1, 0, $2) ON CONFLICT (user_id) DO NOTHING', [userId, '[]']);
    const walletRow = (await query('SELECT * FROM wallet WHERE user_id = $1', [userId])).rows[0];
    if (!walletRow || walletRow.balance < price) {
      sendError(res, 400, 'Số dư ví không đủ để đặt lịch học. Vui lòng nạp thêm tiền.');
      return;
    }
    await query('UPDATE wallet SET balance = balance - $1 WHERE user_id = $2', [price, userId]);
    await query('INSERT INTO wallet_transactions (user_id, label, amount, type, time, created_at) VALUES ($1, $2, $3, $4, $5, $6)', [userId, `Thanh toán buổi học - ${subject}`, price, 'out', 'Vừa xong', new Date().toISOString()]);
  }

  let resolvedTutorName = tutorName;
  let resolvedTutorInitials = body.tutorInitials || null;
  let resolvedTutorColor = body.tutorColor || null;
  if (Number.isFinite(tutorId)) {
    const u = (await query("SELECT name FROM users WHERE id = $1 AND role = 'tutor'", [tutorId])).rows[0];
    if (u) resolvedTutorName = u.name;
  }
  if (!resolvedTutorInitials) resolvedTutorInitials = resolvedTutorName ? resolvedTutorName.split(' ').map((p) => p[0]).join('').slice(0, 3).toUpperCase() : 'TUT';
  if (!resolvedTutorColor) resolvedTutorColor = '#3B5BDB';

  let meetLink = generateFallbackMeetLink();
  if (isGoogleMeetConfigured()) {
    try {
      // Format datetime đúng: YYYY-MM-DDTHH:MM:SS (Google Calendar sẽ apply timezone từ env)
      const startDT = `${date}T${time}:00`;

      // Tính end time bằng cách parse date string + thêm duration
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);

      const startDate = new Date(year, month - 1, day, hours, minutes, 0);
      const endDate = new Date(startDate.getTime() + duration * 60000); // duration in minutes

      const endDT = endDate.getFullYear() + '-' +
                    String(endDate.getMonth() + 1).padStart(2, '0') + '-' +
                    String(endDate.getDate()).padStart(2, '0') + 'T' +
                    String(endDate.getHours()).padStart(2, '0') + ':' +
                    String(endDate.getMinutes()).padStart(2, '0') + ':00';

      const meetResult = await createGoogleMeetEvent({
        summary: `StudyHub: ${subject} - ${resolvedTutorName}`,
        description: `Buổi học ${subject} giữa gia sư ${resolvedTutorName} và học viên.`,
        startDateTime: startDT,
        endDateTime: endDT,
      });
      if (meetResult?.meetLink) meetLink = meetResult.meetLink;
    } catch (_err) {
      // fallback link already set
      console.error('Error creating Google Meet:', _err.message);
    }
  }

  const created = (await query('INSERT INTO bookings (tutor_id, student_id, tutor_name, tutor_initials, tutor_color, subject, date, time, duration, price, status, review_json, meet_link, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *', [Number.isFinite(tutorId) ? tutorId : null, Number.isFinite(studentId) ? studentId : null, resolvedTutorName, resolvedTutorInitials, resolvedTutorColor, subject, date, time, duration, price, 'confirmed', null, meetLink, new Date().toISOString()])).rows[0];

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

export const completeBooking = async (req, res) => {
  const updated = (await query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', ['completed', Number(req.params.id)])).rows[0];
  if (!updated) {
    sendError(res, 404, 'Không tìm thấy booking');
    return;
  }

  const booking = mapBooking(updated);
  await addActivity('booking', 'Lịch học hoàn thành', `${booking.tutorName} - ${booking.subject}`);
  sendSuccess(res, { booking }, 'Hoàn thành lịch học');
};

export const addReview = async (req, res) => {
  const existing = (await query('SELECT * FROM bookings WHERE id = $1', [Number(req.params.id)])).rows[0];
  if (!existing) {
    sendError(res, 404, 'Không tìm thấy booking');
    return;
  }
  // only allow reviews after a completed session
  if ((existing.status || '').toLowerCase() !== 'completed') {
    sendError(res, 400, 'Chỉ có thể đánh giá khi buổi học đã hoàn thành');
    return;
  }

  const rating = Number(req.body?.rating);
  const comment = String(req.body?.comment ?? '').trim();
  if (!Number.isFinite(rating) || rating < 1 || rating > 5 || !comment) {
    sendError(res, 400, 'Thiếu nội dung đánh giá');
    return;
  }

  const tutorUserId = existing.tutor_id;
  if (!tutorUserId) {
    sendError(res, 400, 'Không có gia sư để đánh giá');
    return;
  }

  // find tutor profile row (tutors.user_id references users.id)
  const tutorRow = (await query('SELECT * FROM tutors WHERE user_id = $1', [tutorUserId])).rows[0];
  if (!tutorRow) {
    sendError(res, 404, 'Không tìm thấy hồ sơ gia sư');
    return;
  }

  // persist the individual review
  const inserted = (await query('INSERT INTO tutor_reviews (tutor_user_id, student_id, booking_id, rating, comment, created_at) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [tutorUserId, existing.student_id || null, existing.id, rating, comment, new Date().toISOString()])).rows[0];

  // recompute aggregated rating and review count from tutor_reviews to avoid drift
  const agg = (await query('SELECT COUNT(*) AS count, AVG(rating) AS avg FROM tutor_reviews WHERE tutor_user_id = $1', [tutorUserId])).rows[0];
  const newCount = Number(agg.count || 0);
  const avgRating = Number(agg.avg || 0);
  // round to one decimal place
  const newRating = Math.round(avgRating * 10) / 10;

  const updatedTutorRow = (await query('UPDATE tutors SET rating = $1, reviews = $2 WHERE user_id = $3 RETURNING *', [newRating, newCount, tutorUserId])).rows[0];
  const tutor = mapTutor(updatedTutorRow);

  const booking = mapBooking(existing);
  await addActivity('booking', 'Có đánh giá gia sư mới', `${booking.tutorName} - ${rating} sao`);
  sendSuccess(res, { review: inserted, tutor }, 'Thêm đánh giá thành công', 201);
};
