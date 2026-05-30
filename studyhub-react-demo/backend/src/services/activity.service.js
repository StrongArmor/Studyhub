import { db } from '../config/db.js';

const query = (text, params = []) => db.query(text, params);

export const insertActivity = async (type, title, detail, timeLabel = 'Vừa xong') => {
  await query('INSERT INTO activities (type, title, detail, time) VALUES ($1, $2, $3, $4)', [type, title, detail, timeLabel]);
};

export const getActivities = async () => (await query('SELECT * FROM activities ORDER BY id DESC')).rows;
