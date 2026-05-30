import bcrypt from 'bcryptjs';

const seedUsers = [
  { email: 'user@studyhub.vn', password: '12345678', role: 'user', name: 'Học viên Demo', status: 'active' },
  { email: 'admin@studyhub.vn', password: '12345678', role: 'admin', name: 'Admin Demo', status: 'active' }
];

const seedTutors = [
  { name: 'Nguyễn Minh Anh', initials: 'NMA', subjects: ['Toán học', 'Vật lý'], rating: 4.9, reviews: 127, price: 150000, sessions: 856, status: 'Online', bio: 'Giáo viên Toán - Lý với 8 năm kinh nghiệm.', desc: 'Giáo viên Toán - Lý với 8 năm kinh nghiệm. Chuyên ôn thi THPT Quốc gia và luyện thi.', color: '#3B5BDB', timeSlot: 'evening', availableSlots: ['2026-05-08_19:00', '2026-05-08_20:00', '2026-05-09_19:00', '2026-05-10_20:00'], active: 1, skills: ['Toán học cơ bản', 'Toán học nâng cao'], coverImage: '', totalHours: 856, totalStudents: 127, scheduleSlots: [], selectedSlots: [], declineCount: 0 },
  { name: 'Trần Hải Đăng', initials: 'THĐ', subjects: ['Tiếng Anh', 'IELTS'], rating: 5.0, reviews: 93, price: 200000, sessions: 542, status: 'Online', bio: 'IELTS 8.5 - Chuyên Speaking & Writing.', desc: 'IELTS 8.5 - Chuyên luyện thi IELTS Speaking & Writing.', color: '#7C3AED', timeSlot: 'evening', availableSlots: ['2026-05-08_20:00', '2026-05-09_20:00', '2026-05-10_20:00', '2026-05-11_19:00'], active: 1, skills: ['Speaking', 'Writing'], coverImage: '', totalHours: 542, totalStudents: 93, scheduleSlots: [], selectedSlots: [], declineCount: 0 },
  { name: 'Lê Thu Hà', initials: 'LTH', subjects: ['Hóa học', 'Sinh học'], rating: 4.8, reviews: 68, price: 120000, sessions: 423, status: 'Offline', bio: 'Giảng viên Hóa - Sinh.', desc: 'Giảng viên Hóa - Sinh, chuyên ôn thi THPT và luyện thi Y Dược.', color: '#E64980', timeSlot: 'morning', availableSlots: ['2026-05-08_09:00', '2026-05-09_10:00', '2026-05-10_09:00', '2026-05-11_10:00'], active: 1, skills: ['Hóa học', 'Sinh học'], coverImage: '', totalHours: 423, totalStudents: 68, scheduleSlots: [], selectedSlots: [], declineCount: 0 },
  { name: 'Phạm Quốc Khánh', initials: 'PQK', subjects: ['Lập trình Python', 'Data Science'], rating: 4.9, reviews: 156, price: 250000, sessions: 672, status: 'Online', bio: 'Senior Data Scientist.', desc: 'Senior Data Scientist. Dạy Python từ cơ bản đến nâng cao.', color: '#0C8599', timeSlot: 'evening', availableSlots: ['2026-05-08_18:00', '2026-05-09_19:00', '2026-05-10_20:00', '2026-05-11_20:00'], active: 1, skills: ['Python', 'Data Science'], coverImage: '', totalHours: 672, totalStudents: 156, scheduleSlots: [], selectedSlots: [], declineCount: 0 },
  { name: 'Hoàng Lan Anh', initials: 'HLA', subjects: ['Tiếng Trung', 'HSK'], rating: 4.7, reviews: 45, price: 180000, sessions: 234, status: 'Offline', bio: 'Tốt nghiệp Đại học Bắc Kinh.', desc: 'Tốt nghiệp Đại học Bắc Kinh. Chuyên luyện thi HSK và giao tiếp thực tế.', color: '#F59F00', timeSlot: 'morning', availableSlots: ['2026-05-08_08:00', '2026-05-09_09:00', '2026-05-10_08:00', '2026-05-11_09:00'], active: 1, skills: ['Tiếng Trung', 'HSK'], coverImage: '', totalHours: 234, totalStudents: 45, scheduleSlots: [], selectedSlots: [], declineCount: 0 },
  { name: 'Đỗ Minh Tuấn', initials: 'ĐMT', subjects: ['Web Development', 'Lập trình Java'], rating: 4.8, reviews: 89, price: 220000, sessions: 445, status: 'Online', bio: 'Full-stack Developer.', desc: 'Full-stack Developer 7 năm. Dạy React, Node.js, Spring Boot.', color: '#2F9E44', timeSlot: 'afternoon', availableSlots: ['2026-05-08_14:00', '2026-05-09_15:00', '2026-05-10_14:00', '2026-05-11_16:00'], active: 1, skills: ['React', 'Node.js', 'Spring Boot'], coverImage: '', totalHours: 445, totalStudents: 89, scheduleSlots: [], selectedSlots: [], declineCount: 0 }
];

const seedBookings = [
  { tutorEmail: 'tutor1@studyhub.vn', studentEmail: 'user@studyhub.vn', tutorInitials: 'NMA', tutorColor: '#3B5BDB', subject: 'Toán học', date: '2026-05-08', time: '19:00', duration: 45, price: 150000, status: 'confirmed', review: null, createdAt: '2026-05-08T12:00:00.000Z' },
  { tutorEmail: 'tutor2@studyhub.vn', studentEmail: 'user@studyhub.vn', tutorInitials: 'THĐ', tutorColor: '#7C3AED', subject: 'IELTS Speaking', date: '2026-05-10', time: '20:00', duration: 30, price: 200000, status: 'confirmed', review: null, createdAt: '2026-05-10T12:00:00.000Z' },
  { tutorEmail: 'tutor4@studyhub.vn', studentEmail: 'user@studyhub.vn', tutorInitials: 'PQK', tutorColor: '#0C8599', subject: 'Python cơ bản', date: '2026-04-28', time: '20:30', duration: 45, price: 250000, status: 'completed', review: null, createdAt: '2026-04-28T12:00:00.000Z' }
];

const seedApplications = [
  { name: 'Lê Minh Khoa', email: 'khoa@example.com', phone: '0909000001', subjects: ['Toán học', 'Vật lý'], education: 'ĐH Bách Khoa', experience: '3 năm luyện thi THPT', price: '180000', bio: 'Tập trung vào nền tảng và luyện đề', status: 'pending', createdAt: '2026-05-12T08:00:00.000Z' },
  { name: 'Nguyễn Thùy Linh', email: 'linh@example.com', phone: '0909000002', subjects: ['Tiếng Anh', 'IELTS'], education: 'ĐH Ngoại thương', experience: '5 năm giảng dạy IELTS', price: '220000', bio: 'Tập trung speaking/writing', status: 'approved', createdAt: '2026-05-13T09:00:00.000Z' },
  { name: 'Phạm Hải Nam', email: 'nam@example.com', phone: '0909000003', subjects: ['Lập trình Python'], education: 'ĐH CNTT', experience: '4 năm dạy Python, Data Science', price: '250000', bio: 'Kèm dự án thực tế', status: 'rejected', createdAt: '2026-05-14T10:00:00.000Z' }
];

const seedActivities = [
  { type: 'booking', title: 'Buổi học được xác nhận', detail: 'Nguyễn Minh Anh - Toán học', time: '10 phút trước' },
  { type: 'application', title: 'Có đăng ký gia sư mới', detail: 'Lê Minh Khoa', time: '25 phút trước' },
  { type: 'user', title: 'Tài khoản mới được tạo', detail: 'user@studyhub.vn', time: '1 giờ trước' },
  { type: 'report', title: 'Báo cáo doanh thu ngày', detail: 'Tổng doanh thu 12.400.000đ', time: 'Hôm nay' }
];

const seedReports = [
  { bookingId: 3, tutorEmail: 'tutor4@studyhub.vn', studentEmail: 'user@studyhub.vn', issue: 'Nội dung buổi học không đúng cam kết', detail: 'Buổi học chưa đi đúng lộ trình mong đợi.', status: 'pending', createdAt: '2026-05-12T08:00:00.000Z' }
];


const hashPassword = (password) => bcrypt.hash(password, 10);

export const seedDatabase = async (db) => {
  const runIfEmpty = async (table, callback) => {
    const result = await db.query(`SELECT COUNT(*) AS count FROM ${table}`);
    if (Number(result.rows[0].count) === 0) {
      await callback();
    }
  };

  await runIfEmpty('users', async () => {
    for (const user of seedUsers) {
      const hashed = await hashPassword(user.password);
      await db.query('INSERT INTO users (email, password, role, name, status) VALUES ($1, $2, $3, $4, $5)', [user.email, hashed, user.role, user.name, user.status]);
    }
  });

  await runIfEmpty('tutors', async () => {
    let idx = 1;
    for (const tutor of seedTutors) {
      const tutorEmail = `tutor${idx}@studyhub.vn`;
      // create a user account for this tutor
      const tutorPassword = await hashPassword('12345678');
      const userRes = await db.query('INSERT INTO users (email, password, role, name, status) VALUES ($1, $2, $3, $4, $5) RETURNING id', [tutorEmail, tutorPassword, 'tutor', tutor.name, 'active']);
      const userId = userRes.rows[0] ? userRes.rows[0].id : null;
      await db.query(
        'INSERT INTO tutors (user_id, name, initials, subjects_json, rating, reviews, price, sessions, status, bio, "desc", color, time_slot, available_slots_json, active, skills_json, cover_image, total_hours, total_students, schedule_slots_json, selected_slots_json, decline_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)',
        [userId, tutor.name, tutor.initials, JSON.stringify(tutor.subjects), tutor.rating, tutor.reviews, tutor.price, tutor.sessions, tutor.status, tutor.bio, tutor.desc, tutor.color, tutor.timeSlot, JSON.stringify(tutor.availableSlots), Boolean(tutor.active), JSON.stringify(tutor.skills || []), tutor.coverImage || '', tutor.totalHours || 0, tutor.totalStudents || 0, JSON.stringify(tutor.scheduleSlots || []), JSON.stringify(tutor.selectedSlots || []), tutor.declineCount || 0]
      );
      idx += 1;
    }
  });

  await runIfEmpty('bookings', async () => {
    for (const booking of seedBookings) {
      // resolve tutor and student ids by email (fallback to null)
      const tutorRes = await db.query('SELECT id, name FROM users WHERE email = $1 LIMIT 1', [booking.tutorEmail]);
      const studentRes = await db.query('SELECT id, name FROM users WHERE email = $1 LIMIT 1', [booking.studentEmail]);
      const tutorId = tutorRes.rows[0] ? tutorRes.rows[0].id : null;
      const studentId = studentRes.rows[0] ? studentRes.rows[0].id : null;
      const tutorName = tutorRes.rows[0] ? tutorRes.rows[0].name : null;
      const studentName = studentRes.rows[0] ? studentRes.rows[0].name : null;

      await db.query(
        'INSERT INTO bookings (tutor_id, student_id, tutor_name, tutor_initials, tutor_color, subject, date, time, duration, price, status, review_json, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        [tutorId, studentId, tutorName, booking.tutorInitials, booking.tutorColor, booking.subject, booking.date, booking.time, booking.duration, booking.price, booking.status, booking.review ? JSON.stringify(booking.review) : null, booking.createdAt]
      );
    }
  });

  await runIfEmpty('applications', async () => {
    for (const application of seedApplications) {
      await db.query(
        'INSERT INTO applications (name, email, phone, subjects_json, education, experience, price, bio, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [application.name, application.email, application.phone, JSON.stringify(application.subjects), application.education, application.experience, application.price, application.bio, application.status, application.createdAt]
      );
    }
  });

  await runIfEmpty('activities', async () => {
    for (const activity of seedActivities) {
      await db.query('INSERT INTO activities (type, title, detail, time) VALUES ($1, $2, $3, $4)', [activity.type, activity.title, activity.detail, activity.time]);
    }
  });

  await runIfEmpty('reports', async () => {
    for (const report of seedReports) {
      const tutorRes = await db.query('SELECT id, name FROM users WHERE email = $1 LIMIT 1', [report.tutorEmail]);
      const studentRes = await db.query('SELECT id, name FROM users WHERE email = $1 LIMIT 1', [report.studentEmail]);
      const tutorId = tutorRes.rows[0] ? tutorRes.rows[0].id : null;
      const studentId = studentRes.rows[0] ? studentRes.rows[0].id : null;
      const tutorName = tutorRes.rows[0] ? tutorRes.rows[0].name : null;
      const studentName = studentRes.rows[0] ? studentRes.rows[0].name : null;

      await db.query('INSERT INTO reports (booking_id, tutor_id, student_id, tutor_name, student_name, issue, detail, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [report.bookingId, tutorId, studentId, tutorName, studentName, report.issue, report.detail, report.status, report.createdAt]);
    }
  });

  await runIfEmpty('tutor_certificates', async () => {
  });

  await runIfEmpty('tutor_documents', async () => {
  });
};
