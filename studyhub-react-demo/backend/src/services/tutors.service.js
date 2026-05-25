import { db } from '../config/db.js';

const query = (text, params = []) => db.query(text, params);

export const getTutors = async () => (await query('SELECT * FROM tutors ORDER BY id')).rows;
export const getTutorById = async (id) => (await query('SELECT * FROM tutors WHERE id = $1', [id])).rows[0];

export const createTutor = async (payload) => {
  const {
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
    active = true
  } = payload;

  const res = await query(
    'INSERT INTO tutors (name, initials, subjects_json, rating, reviews, price, sessions, status, bio, "desc", color, time_slot, available_slots_json, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
    [name, initials, JSON.stringify(subjects), Number(rating), Number(reviews), Number(price), Number(sessions), status, bio, desc, color, timeSlot, JSON.stringify(availableSlots), Boolean(active)]
  );

  return res.rows[0];
};

export const updateTutor = async (id, payload, existing) => {
  const body = payload || {};
  const subjects = Array.isArray(body.subjects) ? JSON.stringify(body.subjects.filter(Boolean)) : existing.subjects_json;
  const available = Array.isArray(body.availableSlots) ? JSON.stringify(body.availableSlots) : existing.available_slots_json;

  const res = await query(
    'UPDATE tutors SET name = $1, initials = $2, subjects_json = $3, rating = $4, reviews = $5, price = $6, sessions = $7, status = $8, bio = $9, "desc" = $10, color = $11, time_slot = $12, available_slots_json = $13, active = $14 WHERE id = $15 RETURNING *',
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
      id
    ]
  );

  return res.rows[0];
};

export const deleteTutor = async (id) => (await query('DELETE FROM tutors WHERE id = $1 RETURNING *', [id])).rows[0];
