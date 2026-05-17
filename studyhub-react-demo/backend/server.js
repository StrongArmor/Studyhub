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
  { email: 'student@studyhub.vn', password: '12345678', role: 'student', name: 'Học viên Demo', status: 'active' },
  { email: 'tutor@studyhub.vn', password: '12345678', role: 'tutor', name: 'Gia sư Demo', status: 'active' },
  { email: 'admin@studyhub.vn', password: '12345678', role: 'admin', name: 'Admin Demo', status: 'active' }
];

const applications = [
  { id: 1, name: 'Lê Minh Khoa', email: 'khoa@example.com', phone: '0909000001', subjects: ['Toán học', 'Vật lý'], education: 'ĐH Bách Khoa', experience: '3 năm luyện thi THPT', price: 180000, bio: 'Tập trung vào nền tảng và luyện đề', status: 'pending', createdAt: '2026-05-12T08:00:00.000Z' },
  { id: 2, name: 'Nguyễn Thùy Linh', email: 'linh@example.com', phone: '0909000002', subjects: ['Tiếng Anh', 'IELTS'], education: 'ĐH Ngoại thương', experience: '5 năm giảng dạy IELTS', price: 220000, bio: 'Tập trung speaking/writing', status: 'approved', createdAt: '2026-05-13T09:00:00.000Z' },
  { id: 3, name: 'Phạm Hải Nam', email: 'nam@example.com', phone: '0909000003', subjects: ['Lập trình Python'], education: 'ĐH CNTT', experience: '4 năm dạy Python, Data Science', price: 250000, bio: 'Kèm dự án thực tế', status: 'rejected', createdAt: '2026-05-14T10:00:00.000Z' }
];

const activities = [
  { id: 1, type: 'booking', title: 'Buổi học được xác nhận', detail: 'Nguyễn Minh Anh - Toán học', time: '10 phút trước' },
  { id: 2, type: 'application', title: 'Có đăng ký gia sư mới', detail: 'Lê Minh Khoa', time: '25 phút trước' },
  { id: 3, type: 'user', title: 'Tài khoản mới được tạo', detail: 'student@studyhub.vn', time: '1 giờ trước' },
  { id: 4, type: 'report', title: 'Báo cáo doanh thu ngày', detail: 'Tổng doanh thu 12.400.000đ', time: 'Hôm nay' }
];

const report = {
  revenueSeries: [
    { label: 'T2', value: 8.2 },
    { label: 'T3', value: 9.5 },
    { label: 'T4', value: 11.0 },
    { label: 'T5', value: 10.1 },
    { label: 'T6', value: 12.4 },
    { label: 'T7', value: 13.2 },
    { label: 'CN', value: 15.0 }
  ],
  bookingStatus: [
    { label: 'Đã xác nhận', value: 52 },
    { label: 'Hoàn thành', value: 31 },
    { label: 'Đã hủy', value: 7 },
    { label: 'Chờ xử lý', value: 10 }
  ]
};

const subjects = [...new Set(tutors.flatMap((t) => t.subjects))].sort();

const safeUsers = () => users.map(({ password, ...rest }) => rest);
const buildAdminStats = () => ({ totalUsers: users.length, activeTutors: users.filter((u) => u.role === 'tutor' && u.status === 'active').length, pendingApplications: applications.filter((a) => a.status === 'pending').length, todayRevenue: 12400000, totalBookings: bookings.length, onlineTutors: tutors.filter((t) => t.status === 'Online').length, approvalRate: Math.round((applications.filter((a) => a.status === 'approved').length / applications.length) * 100) || 0, avgRating: 4.87 });

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'StudyHub API', timestamp: new Date().toISOString() }));
app.get('/api/subjects', (_req, res) => res.json({ subjects }));
app.get('/api/dashboard', (_req, res) => res.json({ stats: { tutors: tutors.length, bookings: bookings.length, onlineNow: tutors.filter((t) => t.status === 'Online').length, applications: applications.length }, featuredTutors: tutors.slice(0, 4), bookings, applications }));
app.get('/api/tutors', (req, res) => { const search = String(req.query.search || '').toLowerCase(); const subject = String(req.query.subject || ''); const minRating = Number(req.query.minRating || 0); const maxPrice = Number(req.query.maxPrice || Number.POSITIVE_INFINITY); res.json({ tutors: tutors.filter((tutor) => (!search || tutor.name.toLowerCase().includes(search) || tutor.subjects.join(' ').toLowerCase().includes(search)) && (!subject || tutor.subjects.includes(subject)) && tutor.rating >= minRating && tutor.price <= maxPrice) }); });
app.get('/api/bookings', (_req, res) => res.json({ bookings }));
app.get('/api/admin/overview', (_req, res) => res.json({ stats: buildAdminStats(), revenueSeries: report.revenueSeries, bookingStatus: report.bookingStatus, activities }));
app.get('/api/admin/users', (_req, res) => res.json({ users: safeUsers() }));
app.get('/api/admin/tutors', (_req, res) => res.json({ tutors }));
app.get('/api/admin/applications', (_req, res) => res.json({ applications }));
app.get('/api/admin/reports', (_req, res) => res.json({ stats: buildAdminStats(), revenueSeries: report.revenueSeries, bookingStatus: report.bookingStatus, activities, applications, users: safeUsers(), tutors }));
app.get('/api/admin/activities', (_req, res) => res.json({ activities }));
app.post('/api/login', (req, res) => { const { email, password } = req.body || {}; const user = users.find((item) => item.email === email && item.password === password); if (!user) return res.status(401).json({ ok: false, message: 'Email hoặc mật khẩu không đúng' }); res.json({ ok: true, user: { email: user.email, name: user.name, role: user.role } }); });
app.post('/api/register', (req, res) => { const { name, email, password, role = 'student' } = req.body || {}; if (!name || !email || !password) return res.status(400).json({ ok: false, message: 'Thiếu thông tin đăng ký' }); if (users.some((user) => user.email === email)) return res.status(409).json({ ok: false, message: 'Email đã tồn tại' }); const newUser = { name, email, password, role, status: 'active' }; users.push(newUser); res.status(201).json({ ok: true, user: { name, email, role } }); });
app.post('/api/applications', (req, res) => { const { name, email, phone, subjects: applicationSubjects = [], education = '', experience = '', price = '', bio = '' } = req.body || {}; if (!name || !email || !applicationSubjects.length) return res.status(400).json({ ok: false, message: 'Vui lòng nhập đủ thông tin và chọn ít nhất một môn học' }); const application = { id: applications.length + 1, name, email, phone, subjects: applicationSubjects, education, experience, price, bio, createdAt: new Date().toISOString(), status: 'pending' }; applications.unshift(application); res.status(201).json({ ok: true, application }); });
app.patch('/api/admin/applications/:id', (req, res) => { const item = applications.find((a) => a.id === Number(req.params.id)); if (!item) return res.status(404).json({ ok: false, message: 'Không tìm thấy đăng ký' }); item.status = req.body.status || item.status; res.json({ ok: true, application: item }); });
app.patch('/api/admin/users/:email/status', (req, res) => { const user = users.find((u) => u.email === req.params.email); if (!user) return res.status(404).json({ ok: false, message: 'Không tìm thấy người dùng' }); user.status = req.body.status || user.status; res.json({ ok: true, user: { email: user.email, name: user.name, role: user.role, status: user.status } }); });
app.listen(port, () => console.log(`StudyHub API running on http://localhost:${port}`));
