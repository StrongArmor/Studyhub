const parseJson = (value, fallback = []) => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const mapTutor = (row) => ({
  id: Number(row.id),
  name: row.name,
  initials: row.initials,
  subjects: parseJson(row.subjects_json, []),
  rating: row.rating,
  reviews: row.reviews,
  price: row.price,
  sessions: row.sessions,
  status: row.status,
  bio: row.bio,
  desc: row.desc,
  color: row.color,
  timeSlot: row.time_slot,
  availableSlots: parseJson(row.available_slots_json, []),
  active: Boolean(row.active),
  skills: parseJson(row.skills_json, []),
  coverImage: row.cover_image ?? '',
  totalHours: row.total_hours ?? 0,
  totalStudents: row.total_students ?? 0,
  scheduleSlots: parseJson(row.schedule_slots_json, []),
  selectedSlots: parseJson(row.selected_slots_json, []),
  declineCount: row.decline_count ?? 0
});

export const mapUser = (row) => ({
  id: Number(row.id),
  email: row.email,
  role: row.role,
  name: row.name,
  status: row.status,
  avatar: row.avatar ?? null
});

export const mapBooking = (row) => ({
  id: Number(row.id),
  tutorId: row.tutor_id ? Number(row.tutor_id) : null,
  studentId: row.student_id ? Number(row.student_id) : null,
  tutor: row.tutor_name,
  tutorName: row.tutor_name,
  tutorInitials: row.tutor_initials,
  tutorColor: row.tutor_color,
  subject: row.subject,
  date: row.date,
  time: row.time,
  duration: row.duration,
  price: row.price,
  status: row.status,
  review: parseJson(row.review_json, null),
  createdAt: row.created_at
});

export const mapApplication = (row) => ({
  id: Number(row.id),
  userId: row.user_id ? Number(row.user_id) : null,
  name: row.name,
  email: row.email,
  phone: row.phone,
  subjects: parseJson(row.subjects_json, []),
  education: row.education,
  experience: row.experience,
  price: row.price,
  bio: row.bio,
  status: row.status,
  createdAt: row.created_at
});

export const mapActivity = (row) => ({
  id: Number(row.id),
  type: row.type,
  title: row.title,
  detail: row.detail,
  time: row.time
});

export const mapReport = (row) => ({
  id: Number(row.id),
  bookingId: Number(row.booking_id),
  tutorId: row.tutor_id ? Number(row.tutor_id) : null,
  studentId: row.student_id ? Number(row.student_id) : null,
  tutorName: row.tutor_name,
  studentName: row.student_name,
  issue: row.issue,
  detail: row.detail,
  status: row.status,
  createdAt: row.created_at
});

export const mapWallet = (row) => ({
  balance: row.balance,
  topup: row.topup,
  selectedBank: row.selected_bank,
  banks: parseJson(row.banks_json, [])
});

export const mapWalletTransaction = (row) => ({
  id: Number(row.id),
  label: row.label,
  amount: row.amount,
  type: row.type,
  time: row.time,
  createdAt: row.created_at
});

export const mapTutorProfile = (row, certificates = [], documents = []) => ({
  bio: row?.bio ?? '',
  skills: parseJson(row?.skills_json, []),
  certificates,
  documents,
  coverImage: row?.cover_image ?? '',
  totalHours: row?.total_hours ?? 0,
  totalStudents: row?.total_students ?? 0,
  rating: row?.rating ?? 0,
  scheduleSlots: parseJson(row?.schedule_slots_json, []),
  selectedSlots: parseJson(row?.selected_slots_json, []),
  declineCount: row?.decline_count ?? 0
});

export const mapCertificate = (row) => ({
  id: Number(row.id),
  name: row.name,
  url: row.url,
  issuedAt: row.issued_at
});

export const mapDocument = (row) => ({
  id: Number(row.id),
  name: row.name,
  url: row.url,
  uploadedAt: row.uploaded_at
});
