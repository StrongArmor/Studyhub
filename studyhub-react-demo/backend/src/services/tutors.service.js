import { db } from '../config/db.js';

const query = (text, params = []) => db.query(text, params);

const buildInitials = (name) => String(name || '')
  .trim()
  .split(/\s+/)
  .filter(Boolean)
  .map((part) => part[0])
  .join('')
  .slice(0, 3)
  .toUpperCase() || 'TUT';

const toJson = (value, fallback = []) => Array.isArray(value) ? JSON.stringify(value) : JSON.stringify(fallback);

export const getTutors = async () => (await query('SELECT * FROM tutors ORDER BY id')).rows;
export const getTutorById = async (id) => (await query('SELECT * FROM tutors WHERE id = $1', [id])).rows[0];
export const getTutorByUserId = async (userId) => (await query('SELECT * FROM tutors WHERE user_id = $1 LIMIT 1', [userId])).rows[0];

export const createTutor = async (payload) => {
  const {
    userId = null,
    name,
    initials,
    subjects,
    rating = 0,
    reviews = 0,
    price = 0,
    sessions = 0,
    status = 'Offline',
    bio = '',
    desc = '',
    color = '',
    timeSlot = '',
    availableSlots = [],
    active = true,
    skills = [],
    coverImage = '',
    totalHours = 0,
    totalStudents = 0,
    scheduleSlots = [],
    selectedSlots = [],
    declineCount = 0
  } = payload;

  const res = await query(
    'INSERT INTO tutors (user_id, name, initials, subjects_json, rating, reviews, price, sessions, status, bio, "desc", color, time_slot, available_slots_json, active, skills_json, cover_image, total_hours, total_students, schedule_slots_json, selected_slots_json, decline_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *',
    [userId, name, initials || buildInitials(name), JSON.stringify(subjects), Number(rating), Number(reviews), Number(price), Number(sessions), status, bio, desc, color, timeSlot, JSON.stringify(availableSlots), Boolean(active), toJson(skills), coverImage, Number(totalHours), Number(totalStudents), toJson(scheduleSlots), toJson(selectedSlots), Number(declineCount)]
  );

  return res.rows[0];
};

export const updateTutor = async (id, payload, existing) => {
  const body = payload || {};
  const subjects = Array.isArray(body.subjects) ? JSON.stringify(body.subjects.filter(Boolean)) : existing.subjects_json;
  const available = Array.isArray(body.availableSlots) ? JSON.stringify(body.availableSlots) : existing.available_slots_json;
  const skills = Array.isArray(body.skills) ? JSON.stringify(body.skills.filter(Boolean)) : existing.skills_json;
  const scheduleSlots = Array.isArray(body.scheduleSlots) ? JSON.stringify(body.scheduleSlots) : existing.schedule_slots_json;
  const selectedSlots = Array.isArray(body.selectedSlots) ? JSON.stringify(body.selectedSlots) : existing.selected_slots_json;

  const res = await query(
    'UPDATE tutors SET name = $1, initials = $2, subjects_json = $3, rating = $4, reviews = $5, price = $6, sessions = $7, status = $8, bio = $9, "desc" = $10, color = $11, time_slot = $12, available_slots_json = $13, active = $14, skills_json = $15, cover_image = $16, total_hours = $17, total_students = $18, schedule_slots_json = $19, selected_slots_json = $20, decline_count = $21 WHERE id = $22 RETURNING *',
    [
      body.name ?? existing.name,
      body.initials ?? existing.initials,
      subjects,
      Number(body.rating ?? existing.rating),
      Number(body.reviews ?? existing.reviews),
      Number(body.price ?? existing.price),
      Number(body.sessions ?? existing.sessions),
      body.status ?? existing.status,
      body.bio ?? existing.bio,
      body.desc ?? existing.desc,
      body.color ?? existing.color,
      body.timeSlot ?? existing.time_slot,
      available,
      Boolean(body.active ?? existing.active),
      skills,
      body.coverImage ?? existing.cover_image ?? '',
      Number(body.totalHours ?? existing.total_hours ?? 0),
      Number(body.totalStudents ?? existing.total_students ?? 0),
      scheduleSlots,
      selectedSlots,
      Number(body.declineCount ?? existing.decline_count ?? 0),
      id
    ]
  );

  return res.rows[0];
};

export const upsertTutorByUserId = async (userId, payload = {}) => {
  const existing = await getTutorByUserId(userId);
  if (existing) {
    return updateTutor(existing.id, payload, existing);
  }

  const user = Number.isFinite(Number(userId)) ? (await query('SELECT name FROM users WHERE id = $1 LIMIT 1', [userId])).rows[0] : null;
  return createTutor({
    userId,
    name: payload.name ?? user?.name ?? 'Tutor',
    initials: payload.initials ?? buildInitials(payload.name ?? user?.name ?? 'Tutor'),
    subjects: payload.subjects ?? [],
    rating: payload.rating ?? 0,
    reviews: payload.reviews ?? 0,
    price: payload.price ?? 0,
    sessions: payload.sessions ?? 0,
    status: payload.status ?? 'Offline',
    bio: payload.bio ?? '',
    desc: payload.desc ?? '',
    color: payload.color ?? '',
    timeSlot: payload.timeSlot ?? '',
    availableSlots: payload.availableSlots ?? [],
    active: payload.active ?? true,
    skills: payload.skills ?? [],
    coverImage: payload.coverImage ?? '',
    totalHours: payload.totalHours ?? 0,
    totalStudents: payload.totalStudents ?? 0,
    scheduleSlots: payload.scheduleSlots ?? [],
    selectedSlots: payload.selectedSlots ?? [],
    declineCount: payload.declineCount ?? 0
  });
};

export const deleteTutor = async (id) => (await query('DELETE FROM tutors WHERE id = $1 RETURNING *', [id])).rows[0];
