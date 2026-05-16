import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const tutors = [
  { id: 1, name: 'Nguyễn Minh Anh', initials: 'NMA', subjects: ['Toán học', 'Vật lý'], rating: 4.9, reviews: 127, price: 150000, sessions: 856, status: 'Online', bio: 'Giáo viên Toán - Lý với 8 năm kinh nghiệm.' },
  { id: 2, name: 'Trần Hải Đăng', initials: 'THĐ', subjects: ['Tiếng Anh', 'IELTS'], rating: 5.0, reviews: 93, price: 200000, sessions: 542, status: 'Online', bio: 'IELTS 8.5 - Chuyên Speaking & Writing.' },
  { id: 3, name: 'Lê Thu Hà', initials: 'LTH', subjects: ['Hóa học', 'Sinh học'], rating: 4.8, reviews: 68, price: 120000, sessions: 423, status: 'Offline', bio: 'Giảng viên Hóa - Sinh.' },
  { id: 4, name: 'Phạm Quốc Khánh', initials: 'PQK', subjects: ['Lập trình Python', 'Data Science'], rating: 4.9, reviews: 156, price: 250000, sessions: 672, status: 'Online', bio: 'Senior Data Scientist.' },
  { id: 5, name: 'Hoàng Lan Anh', initials: 'HLA', subjects: ['Tiếng Trung', 'HSK'], rating: 4.7, reviews: 45, price: 180000, sessions: 234, status: 'Offline', bio: 'Tốt nghiệp Đại học Bắc Kinh.' },
  { id: 6, name: 'Đỗ Minh Tuấn', initials: 'ĐMT', subjects: ['Web Development', 'Lập trình Java'], rating: 4.8, reviews: 89, price: 220000, sessions: 445, status: 'Online', bio: 'Full-stack Developer.' }
];

const bookings = [
  { id: 1, tutor: 'Nguyễn Minh Anh', subject: 'Toán học', date: '2026-05-08', time: '19:00', duration: 45, price: 150000, status: 'confirmed' },
  { id: 2, tutor: 'Trần Hải Đăng', subject: 'IELTS Speaking', date: '2026-05-10', time: '20:00', duration: 30, price: 200000, status: 'confirmed' },
  { id: 3, tutor: 'Phạm Quốc Khánh', subject: 'Python cơ bản', date: '2026-04-28', time: '20:30', duration: 45, price: 250000, status: 'completed' }
];

const users = [
  { email: 'student@studyhub.vn', password: '12345678', role: 'student', name: 'Học viên Demo' },
  { email: 'tutor@studyhub.vn', password: '12345678', role: 'tutor', name: 'Gia sư Demo' },
  { email: 'admin@studyhub.vn', password: '12345678', role: 'admin', name: 'Admin Demo' }
];

const applications = [];
const subjects = [...new Set(tutors.flatMap((t) => t.subjects))].sort();

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'StudyHub API', timestamp: new Date().toISOString() }));
app.get('/api/subjects', (_req, res) => res.json({ subjects }));
app.get('/api/dashboard', (_req, res) => res.json({ stats: { tutors: tutors.length, bookings: bookings.length, onlineNow: tutors.filter((t) => t.status === 'Online').length, applications: applications.length }, featuredTutors: tutors.slice(0, 4), bookings, applications }));
app.get('/api/tutors', (req, res) => { const search = String(req.query.search || '').toLowerCase(); const subject = String(req.query.subject || ''); const minRating = Number(req.query.minRating || 0); const maxPrice = Number(req.query.maxPrice || Number.POSITIVE_INFINITY); res.json({ tutors: tutors.filter((tutor) => (!search || tutor.name.toLowerCase().includes(search) || tutor.subjects.join(' ').toLowerCase().includes(search)) && (!subject || tutor.subjects.includes(subject)) && tutor.rating >= minRating && tutor.price <= maxPrice) }); });
app.get('/api/bookings', (_req, res) => res.json({ bookings }));
app.post('/api/login', (req, res) => { const { email, password } = req.body || {}; const user = users.find((item) => item.email === email && item.password === password); if (!user) return res.status(401).json({ ok: false, message: 'Email hoặc mật khẩu không đúng' }); res.json({ ok: true, user: { email: user.email, name: user.name, role: user.role } }); });
app.post('/api/register', (req, res) => { const { name, email, password, role = 'student' } = req.body || {}; if (!name || !email || !password) return res.status(400).json({ ok: false, message: 'Thiếu thông tin đăng ký' }); if (users.some((user) => user.email === email)) return res.status(409).json({ ok: false, message: 'Email đã tồn tại' }); const newUser = { name, email, password, role }; users.push(newUser); res.status(201).json({ ok: true, user: { name, email, role } }); });
app.post('/api/applications', (req, res) => { const { name, email, phone, subjects: applicationSubjects = [], education = '', experience = '', price = '', bio = '' } = req.body || {}; if (!name || !email || !applicationSubjects.length) return res.status(400).json({ ok: false, message: 'Vui lòng nhập đủ thông tin và chọn ít nhất một môn học' }); const application = { id: applications.length + 1, name, email, phone, subjects: applicationSubjects, education, experience, price, bio, createdAt: new Date().toISOString(), status: 'pending' }; applications.unshift(application); res.status(201).json({ ok: true, application }); });
app.listen(port, () => console.log(`StudyHub API running on http://localhost:${port}`));
