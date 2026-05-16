import { useEffect, useMemo, useState } from 'react';

const tutorsSeed = [
  { id: 1, name: 'Nguyễn Minh Anh', initials: 'NMA', avatar: '#3B5BDB', rating: 4.9, reviews: 127, subjects: ['Toán học', 'Vật lý'], desc: 'Giáo viên Toán - Lý với 8 năm kinh nghiệm. Chuyên ôn thi THPT Quốc gia và luyện thi...', sessions: 856, price: 150000, timeSlot: 'evening', status: 'Online' },
  { id: 2, name: 'Trần Hải Đăng', initials: 'THĐ', avatar: '#7C3AED', rating: 5.0, reviews: 93, subjects: ['Tiếng Anh', 'IELTS'], desc: 'IELTS 8.5 - Chuyên luyện thi IELTS Speaking & Writing. Phương pháp học tập trung, hiệu...', sessions: 542, price: 200000, timeSlot: 'evening', status: 'Online' },
  { id: 3, name: 'Lê Thu Hà', initials: 'LTH', avatar: '#E64980', rating: 4.8, reviews: 68, subjects: ['Hóa học', 'Sinh học'], desc: 'Giảng viên Hóa - Sinh, chuyên ôn thi THPT và luyện thi Y Dược.', sessions: 423, price: 120000, timeSlot: 'morning', status: 'Offline' },
  { id: 4, name: 'Phạm Quốc Khánh', initials: 'PQK', avatar: '#0C8599', rating: 4.9, reviews: 156, subjects: ['Lập trình Python', 'Data Science'], desc: 'Senior Data Scientist tại công ty công nghệ. Dạy Python từ cơ bản đến nâng cao.', sessions: 672, price: 250000, timeSlot: 'evening', status: 'Online' },
  { id: 5, name: 'Hoàng Lan Anh', initials: 'HLA', avatar: '#F59F00', rating: 4.7, reviews: 45, subjects: ['Tiếng Trung', 'HSK'], desc: 'Tốt nghiệp Đại học Bắc Kinh. Chuyên luyện thi HSK và giao tiếp tiếng Trung thực tế.', sessions: 234, price: 180000, timeSlot: 'morning', status: 'Offline' },
  { id: 6, name: 'Đỗ Minh Tuấn', initials: 'ĐMT', avatar: '#2F9E44', rating: 4.8, reviews: 89, subjects: ['Web Development', 'Lập trình Java'], desc: 'Full-stack Developer với 7 năm kinh nghiệm. Dạy React, Node.js, Spring Boot từ cơ bản...', sessions: 445, price: 220000, timeSlot: 'afternoon', status: 'Online' }
];

const bookingsSeed = [
  { id: 1, tutor: 'Nguyễn Minh Anh', subject: 'Toán học', date: '2026-05-08', time: '19:00', duration: 45, price: 150000, status: 'confirmed' },
  { id: 2, tutor: 'Trần Hải Đăng', subject: 'IELTS Speaking', date: '2026-05-10', time: '20:00', duration: 30, price: 200000, status: 'confirmed' },
  { id: 3, tutor: 'Phạm Quốc Khánh', subject: 'Python cơ bản', date: '2026-04-28', time: '20:30', duration: 45, price: 250000, status: 'completed' }
];

const userSeed = [
  { email: 'student@studyhub.vn', password: '12345678', role: 'student', name: 'Học viên Demo' },
  { email: 'tutor@studyhub.vn', password: '12345678', role: 'tutor', name: 'Gia sư Demo' },
  { email: 'admin@studyhub.vn', password: '12345678', role: 'admin', name: 'Admin Demo' }
];

const suggestedTutors = [
  { initials: 'NTM', avatar: '#3B5BDB', name: 'Nguyễn Thị Mai', subjects: 'Toán học • Vật lý', rating: '4.6', reviews: 87, price: 180000 },
  { initials: 'TVL', avatar: '#7C3AED', name: 'Trần Văn Long', subjects: 'Vật lý • Hóa học', rating: '4.4', reviews: 62, price: 160000 },
  { initials: 'LMA', avatar: '#E64980', name: 'Lê Minh Anh', subjects: 'Toán học • Lập trình', rating: '4.7', reviews: 124, price: 200000 }
];

const statsSeed = { tutors: 6, bookings: 3, onlineNow: 4, applications: 0 };

let setToastGlobal = null;
let toastTimer = null;
function toast(msg, type = 'success') {
  if (!setToastGlobal) return;
  setToastGlobal({ msg, type });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => setToastGlobal({ msg: '', type: '' }), 2800);
}

export default function App() {
  const [page, setPage] = useState('home');
  const [toastState, setToastState] = useState({ msg: '', type: '' });
  const [selectedRole, setSelectedRole] = useState('student');
  const [authUsers, setAuthUsers] = useState(userSeed);
  const [heroSearch, setHeroSearch] = useState('');
  const [tutors, setTutors] = useState(tutorsSeed);
  const [filter, setFilter] = useState({ search: '', subject: '', price: '', rating: '', timeSlot: 'morning' });
  const [availableOnly, setAvailableOnly] = useState(true);
  const [dashboard, setDashboard] = useState({ stats: statsSeed, bookings: bookingsSeed, featuredTutors: tutorsSeed.slice(0, 4), applications: [] });
  const [activeTab, setActiveTab] = useState('upcoming');
  const [register, setRegister] = useState({ name: '', email: '', pass: '', confirm: '', agree: false });
  const [login, setLogin] = useState({ studentEmail: 'student@studyhub.vn', studentPass: '12345678', tutorEmail: 'tutor@studyhub.vn', tutorPass: '12345678' });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState('04:59');
  const [pendingUser, setPendingUser] = useState(null);
  const [emailModal, setEmailModal] = useState({ open: false, msg: 'Email đã tồn tại trong hệ thống. Vui lòng đăng nhập hoặc sử dụng email khác để tiếp tục.' });
  const [tutorForm, setTutorForm] = useState({ name: '', email: '', phone: '', subjects: [], education: '', experience: '', price: '', bio: '' });

  setToastGlobal = setToastState;

  const subjectOptions = useMemo(() => [...new Set(tutorsSeed.flatMap((t) => t.subjects))].sort(), []);

  const navigate = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshDashboard = () => setDashboard((d) => ({ ...d, stats: { ...d.stats, applications: d.applications.length } }));

  useEffect(() => {
    const result = tutorsSeed.filter((t) => {
      if (availableOnly && t.status !== 'Online') return false;
      const q = filter.search.trim().toLowerCase();
      if (q && !t.name.toLowerCase().includes(q) && !t.subjects.join(' ').toLowerCase().includes(q)) return false;
      if (filter.subject && !t.subjects.includes(filter.subject)) return false;
      if (filter.price) {
        const [min, max] = filter.price.split('-').map(Number);
        if (t.price < min || t.price > max) return false;
      }
      if (filter.rating && t.rating < Number(filter.rating)) return false;
      if (filter.timeSlot && t.timeSlot !== filter.timeSlot) return false;
      return true;
    });
    setTutors(result);
  }, [filter, availableOnly]);

  useEffect(() => {
    if (page !== 'otp') return undefined;
    let seconds = 299;
    setOtpTimer('04:59');
    setOtpDigits(['', '', '', '', '', '']);
    const timer = setInterval(() => {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      setOtpTimer(`${m}:${s}`);
      if (seconds-- <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [page]);

  const openTutors = (subject = '', search = '') => {
    setFilter((prev) => ({ ...prev, subject, search }));
    navigate('tutors');
  };

  const doLogin = (role) => {
    const email = role === 'tutor' ? login.tutorEmail : login.studentEmail;
    const password = role === 'tutor' ? login.tutorPass : login.studentPass;
    if (!email || !password) return toast('Vui lòng nhập đầy đủ thông tin', 'error');
    const user = authUsers.find((u) => u.email === email && u.password === password);
    if (!user) return toast('Email hoặc mật khẩu không đúng', 'error');
    toast(`Đăng nhập thành công! Chào mừng ${user.name}`, 'success');
    navigate('dashboard');
  };

  const doRegister = () => {
    const { name, email, pass, confirm, agree } = register;
    if (!name || !email || !pass || !confirm) return toast('Vui lòng nhập đầy đủ thông tin', 'error');
    if (pass.length < 8) return toast('Mật khẩu tối thiểu 8 ký tự', 'error');
    if (pass !== confirm) return toast('Mật khẩu xác nhận không khớp', 'error');
    if (!agree) return toast('Vui lòng đồng ý với điều khoản sử dụng', 'error');
    if (authUsers.some((u) => u.email === email)) {
      setEmailModal({ open: true, msg: `Email ${email} đã tồn tại trong hệ thống. Vui lòng đăng nhập hoặc sử dụng email khác để tiếp tục.` });
      return;
    }
    setPendingUser({ name, email, password: pass });
    navigate('otp');
  };

  const verifyOTP = () => {
    if (otpDigits.join('').length < 6) return toast('Vui lòng nhập đủ 6 chữ số', 'error');
    if (!pendingUser) return;
    setAuthUsers((prev) => [...prev, { name: pendingUser.name, email: pendingUser.email, password: pendingUser.password, role: 'student' }]);
    toast(`🎉 Tạo tài khoản thành công! Chào mừng ${pendingUser.name}`, 'success');
    setTimeout(() => navigate('dashboard'), 700);
  };

  const resendOTP = () => {
    setOtpDigits(['', '', '', '', '', '']);
    setOtpTimer('04:59');
    toast(`Đã gửi lại mã OTP đến ${pendingUser?.email || ''}`, 'success');
  };

  const cancelBooking = (btn) => {
    if (window.confirm('Bạn có chắc muốn hủy buổi học này?')) {
      btn.closest('.booking-card').style.opacity = '0.5';
      toast('Đã hủy buổi học thành công', 'success');
    }
  };

  const submitTutorForm = () => {
    if (!tutorForm.name || !tutorForm.email) return toast('Vui lòng nhập họ tên và email', 'error');
    if (!tutorForm.subjects.length) return toast('Vui lòng chọn ít nhất 1 môn học', 'error');
    dashboard.applications.unshift({ ...tutorForm, id: dashboard.applications.length + 1, createdAt: new Date().toISOString(), status: 'pending' });
    refreshDashboard();
    toast('🎉 Đăng ký thành công! Chúng tôi sẽ liên hệ trong 24h.', 'success');
    setTutorForm({ name: '', email: '', phone: '', subjects: [], education: '', experience: '', price: '', bio: '' });
    setTimeout(() => navigate('home'), 1500);
  };

  const clearFilters = () => {
    setFilter({ search: '', subject: '', price: '', rating: '', timeSlot: '' });
    setAvailableOnly(false);
  };

  const handleHeroSearch = () => openTutors('', heroSearch);

  return (
    <div className="app-shell">
      {toastState.msg ? <div className={`toast ${toastState.type}`}>{toastState.msg}</div> : null}

      <div className={`modal-overlay ${emailModal.open ? '' : 'hidden'}`}>
        <div className="error-modal">
          <div className="error-modal-title">⚠️ Email đã được đăng ký</div>
          <div className="error-modal-body">{emailModal.msg}</div>
          <div className="error-modal-actions">
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setEmailModal({ ...emailModal, open: false }); navigate('role-select'); }}>Đăng nhập ngay</button>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEmailModal({ ...emailModal, open: false })}>Dùng email khác</button>
          </div>
        </div>
      </div>

      {page === 'home' && <HomePage onNavigate={navigate} onSearch={handleHeroSearch} onSubject={openTutors} featuredTutors={dashboard.featuredTutors} heroSearch={heroSearch} setHeroSearch={setHeroSearch} />}
      {page === 'role-select' && <RoleSelectPage selectedRole={selectedRole} setSelectedRole={setSelectedRole} onNavigate={navigate} />}
      {page === 'login-student' && <LoginPage role="student" login={login} setLogin={setLogin} onNavigate={navigate} onLogin={doLogin} />}
      {page === 'login-tutor' && <LoginPage role="tutor" login={login} setLogin={setLogin} onNavigate={navigate} onLogin={doLogin} />}
      {page === 'register' && <RegisterPage register={register} setRegister={setRegister} onNavigate={navigate} onRegister={doRegister} />}
      {page === 'otp' && <OtpPage otpDigits={otpDigits} setOtpDigits={setOtpDigits} otpTimer={otpTimer} onVerify={verifyOTP} onResend={resendOTP} onNavigate={navigate} pendingEmail={pendingUser?.email || ''} />}
      {page === 'tutors' && <TutorListPage tutors={tutors} filter={filter} setFilter={setFilter} onNavigate={navigate} availableOnly={availableOnly} setAvailableOnly={setAvailableOnly} onClearFilters={clearFilters} />}
      {page === 'dashboard' && <DashboardPage dashboard={dashboard} activeTab={activeTab} setActiveTab={setActiveTab} onNavigate={navigate} onCancelBooking={cancelBooking} />}
      {page === 'become-tutor' && <BecomeTutorPage form={tutorForm} setForm={setTutorForm} onSubmit={submitTutorForm} onNavigate={navigate} subjectOptions={subjectOptions} />}
    </div>
  );
}

function SiteNav({ active, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onNavigate('home')}>
        <div className="navbar-logo">🎓</div>
        <span className="navbar-name">StudyHub</span>
      </div>
      <div className="navbar-links">
        <a className={`navbar-link ${active === 'tutors' ? 'active' : ''}`} onClick={() => onNavigate('tutors')}>🔍 Tìm gia sư</a>
        <a className={`navbar-link ${active === 'become-tutor' ? 'active' : ''}`} onClick={() => onNavigate('become-tutor')}>📋 Trở thành gia sư</a>
        <a className={`navbar-link ${active === 'role-select' ? 'active' : ''}`} onClick={() => onNavigate('role-select')}>👤 Tài khoản</a>
      </div>
    </nav>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col"><h4>StudyHub</h4><p>Nền tảng kết nối gia sư và học viên với các buổi học ngắn 30-45 phút, linh hoạt thời gian.</p></div>
        <div className="footer-col"><h4>Dành cho học viên</h4><a onClick={() => onNavigate('tutors')}>Tìm gia sư</a><a onClick={() => onNavigate('dashboard')}>Lịch học của tôi</a><a>Cách thức hoạt động</a></div>
        <div className="footer-col"><h4>Dành cho gia sư</h4><a onClick={() => onNavigate('become-tutor')}>Đăng ký dạy học</a><a>Chính sách thanh toán</a><a>Hướng dẫn sử dụng</a></div>
        <div className="footer-col"><h4>Liên hệ</h4><p>Email: support@studyhub.vn</p><p>Hotline: 1900 xxxx</p><p>Giờ làm việc: 8:00 - 22:00</p></div>
      </div>
      <div className="footer-bottom"><span>© 2026 StudyHub. All rights reserved.</span><span className="footer-admin" onClick={() => onNavigate('role-select')}>Admin</span></div>
    </footer>
  );
}

function HomePage({ onNavigate, onSearch, onSubject, featuredTutors, heroSearch, setHeroSearch }) {
  const subjects = [
    ['Toán học', '📐'], ['Hóa học', '🧪'], ['Tiếng Anh', '🇬🇧'], ['Tiếng Nhật', '🇯🇵'],
    ['Vật lý', '⚡'], ['Sinh học', '🌿'], ['Tiếng Trung', '🇨🇳'], ['Lập trình Python', '💻']
  ];
  return (
    <>
      <SiteNav active="home" onNavigate={onNavigate} />
      <div className="hero">
        <h1 className="hero-title">Học nhanh, đúng nhu cầu với StudyHub</h1>
        <p className="hero-subtitle">Kết nối với gia sư chất lượng qua các buổi học ngắn 30-45 phút. Linh hoạt thời gian, minh bạch chi phí.</p>
        <div className="hero-search">
          <input className="hero-search-input" placeholder="Tìm kiếm môn học hoặc kỹ năng..." value={heroSearch} onChange={(e) => setHeroSearch(e.target.value)} />
          <button className="hero-search-btn" onClick={onSearch}>🔍 Tìm kiếm</button>
        </div>
      </div>

      <div className="features-row">
        <FeatureItem icon="🕐" title="Linh hoạt thời gian" desc="Buổi học 30-45 phút, đặt lịch dễ dàng theo nhu cầu" />
        <FeatureItem icon="🛡️" title="Minh bạch chi phí" desc="Giá cố định, thanh toán an toàn qua nền tảng" />
        <FeatureItem icon="⭐" title="Gia sư chất lượng" desc="Được đánh giá và xác thực bởi cộng đồng" />
      </div>

      <section className="section section-gray">
        <h2 className="section-title">Môn học phổ biến</h2>
        <p className="section-subtitle">Khám phá các môn học được yêu thích nhất</p>
        <div className="subjects-grid">
          {subjects.map(([name, icon]) => <div key={name} className="subject-card" onClick={() => onSubject(name)}><div className="subject-icon">{icon}</div><div className="subject-name">{name}</div></div>)}
        </div>
      </section>

      <section className="section">
        <div className="tutors-header"><div className="tutors-header-left"><h2>Gia sư nổi bật</h2><p>Các gia sư được đánh giá cao nhất</p></div><span className="see-all-link" onClick={() => onNavigate('tutors')}>Xem tất cả →</span></div>
        <div className="tutors-grid">{featuredTutors.map((t) => <TutorCard key={t.id} tutor={t} onClick={() => onNavigate('tutors')} />)}</div>
      </section>

      <div className="cta-section"><div className="cta-title">Bạn là gia sư? Chia sẻ kiến thức, tạo thu nhập</div><div className="cta-subtitle">Tận dụng thời gian rảnh, kết nối với học viên trên toàn quốc</div><button className="btn btn-white btn-lg" onClick={() => onNavigate('become-tutor')}>Đăng ký ngay</button></div>
      <Footer onNavigate={onNavigate} />
    </>
  );
}

function TutorCard({ tutor, onClick }) {
  const special = tutor.name === 'Trần Hải Đăng' || tutor.name === 'Phạm Quốc Khánh';
  return (
    <div className="tutor-card" onClick={onClick}>
      <div className="tutor-avatar" style={{ background: tutor.avatar }}>{tutor.initials}</div>
      <div className="tutor-name">{tutor.name}</div>
      <div className="tutor-rating"><span className="star">⭐</span> {tutor.rating} <span>({tutor.reviews})</span></div>
      <div className="tutor-tags">{tutor.subjects.map((s) => <span key={s} className={`tag ${special ? 'tag-purple' : ''}`}>{s}</span>)}</div>
      <div className="tutor-price" style={special ? { color: '#7C3AED' } : {}}>{tutor.price.toLocaleString()}đ/45 phút</div>
    </div>
  );
}

function RoleSelectPage({ selectedRole, setSelectedRole, onNavigate }) {
  return (
    <div className="role-select-bg">
      <div className="role-card-wrap">
        <div className="auth-logo"><div className="auth-logo-icon">🎓</div><span className="auth-logo-text">StudyHub</span></div>
        <h2 className="role-title">Bạn đăng nhập với vai trò nào?</h2>
        <p className="role-subtitle">Chọn loại tài khoản để tiếp tục đăng nhập</p>
        <div className="role-grid">
          <RoleItem selected={selectedRole === 'student'} title="Người học" icon="🎓" desc="Tìm kiếm gia sư phù hợp, đặt lịch học 1-1 và nâng cao kiến thức mỗi ngày." onLogin={() => onNavigate('login-student')} onSelect={() => setSelectedRole('student')} />
          <RoleItem selected={selectedRole === 'tutor'} title="Người dạy" icon="💼" purple desc="Chia sẻ chuyên môn, tạo lịch dạy linh hoạt và tăng thu nhập từ việc giảng dạy." onLogin={() => onNavigate('login-tutor')} onSelect={() => setSelectedRole('tutor')} />
          <RoleItem selected={selectedRole === 'admin'} title="Quản trị viên" icon="🖥️" purple desc="Quản lý hệ thống, duyệt thông tin người dùng và đảm bảo môi trường học tập an toàn, hiệu quả." onLogin={() => onNavigate('login-student')} onSelect={() => setSelectedRole('admin')} />
        </div>
        <div className="auth-footer-text">Bạn chưa có tài khoản? <span className="link" onClick={() => onNavigate('register')}>Đăng ký ngay</span></div>
      </div>
    </div>
  );
}

function RoleItem({ selected, title, icon, purple, desc, onLogin, onSelect }) {
  return (
    <div className={`role-item ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className={`role-icon-wrap ${purple ? 'purple' : ''}`}>{icon}</div>
      <div className="role-item-title">{title}</div>
      <div className="role-item-desc">{desc}</div>
      <div className="role-item-link" onClick={(e) => { e.stopPropagation(); onLogin(); }}>Đăng nhập với vai trò này</div>
    </div>
  );
}

function LoginPage({ role, login, setLogin, onNavigate, onLogin }) {
  const isTutor = role === 'tutor';
  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo"><div className="auth-logo-icon">🎓</div><span className="auth-logo-text">StudyHub</span></div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}><span className={`auth-badge ${isTutor ? 'purple' : ''}`}>{isTutor ? '💼 Người dạy' : '🎓 Người học'}</span></div>
        <h2 className="auth-title">{isTutor ? 'Chào mừng gia sư quay lại' : 'Chào mừng bạn quay lại'}</h2>
        <p className="auth-subtitle">{isTutor ? 'Đăng nhập để quản lý lịch dạy, học viên và thu nhập của bạn' : 'Đăng nhập để tiếp tục hành trình học tập và đặt lịch với gia sư'}</p>
        <Input label="Email" icon="✉️" value={isTutor ? login.tutorEmail : login.studentEmail} onChange={(v) => setLogin((p) => ({ ...p, [isTutor ? 'tutorEmail' : 'studentEmail']: v }))} placeholder={isTutor ? 'tutor@studyhub.vn' : 'student@studyhub.vn'} />
        <Input label="Mật khẩu" icon="🔒" type="password" value={isTutor ? login.tutorPass : login.studentPass} onChange={(v) => setLogin((p) => ({ ...p, [isTutor ? 'tutorPass' : 'studentPass']: v }))} placeholder="••••••••" />
        <div className="remember-row"><label className="checkbox-label"><input type="checkbox" defaultChecked /> Ghi nhớ đăng nhập</label><span className="forgot-link" style={{ color: isTutor ? 'var(--purple)' : 'var(--blue)' }}>Quên mật khẩu?</span></div>
        <button className={`btn btn-full btn-lg ${isTutor ? 'btn-primary-purple' : 'btn-primary'}`} onClick={() => onLogin(role)}>Đăng nhập</button>
        <div className="auth-divider">Hoặc</div>
        <button className="google-btn" onClick={() => toast('Chức năng đăng nhập Google sẽ sớm ra mắt!', 'success')}>Đăng nhập với Google</button>
        <div className="auth-footer-text">Bạn chưa có tài khoản? <span className="link" onClick={() => onNavigate('register')}>Đăng ký ngay</span></div>
        <div className="auth-back" onClick={() => onNavigate('role-select')}>← Chọn vai trò khác</div>
      </div>
    </div>
  );
}

function RegisterPage({ register, setRegister, onNavigate, onRegister }) {
  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo"><div className="auth-logo-icon">🎓</div><span className="auth-logo-text">StudyHub</span></div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}><span className="auth-badge">🎓 Đăng ký làm Người học</span></div>
        <h2 className="auth-title">Tạo tài khoản mới</h2>
        <p className="auth-subtitle">Trải nghiệm học tập với gia sư hàng đầu Việt Nam</p>
        <Input label="Họ và tên" icon="👤" value={register.name} onChange={(v) => setRegister((p) => ({ ...p, name: v }))} placeholder="Nguyễn Văn A" />
        <Input label="Email" icon="✉️" value={register.email} onChange={(v) => setRegister((p) => ({ ...p, email: v }))} placeholder="nguyenvana@email.com" />
        <Input label="Mật khẩu" icon="🔒" type="password" value={register.pass} onChange={(v) => setRegister((p) => ({ ...p, pass: v }))} placeholder="Tối thiểu 8 ký tự" />
        <div className="input-hint">Bao gồm chữ hoa, chữ thường và số</div>
        <Input label="Xác nhận mật khẩu" icon="🔒" type="password" value={register.confirm} onChange={(v) => setRegister((p) => ({ ...p, confirm: v }))} placeholder="Nhập lại mật khẩu" />
        <div style={{ marginBottom: 20 }}><label className="checkbox-label"><input type="checkbox" checked={register.agree} onChange={(e) => setRegister((p) => ({ ...p, agree: e.target.checked }))} /> Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của StudyHub</label></div>
        <button className="btn btn-primary btn-full btn-lg" onClick={onRegister}>Tạo tài khoản</button>
        <div className="auth-divider">Hoặc</div>
        <button className="google-btn" onClick={() => toast('Chức năng Google sẽ sớm ra mắt!', 'success')}>Đăng ký với Google</button>
        <div className="auth-footer-text">Đã có tài khoản? <span className="link" onClick={() => onNavigate('role-select')}>Đăng nhập</span></div>
      </div>
    </div>
  );
}

function OtpPage({ otpDigits, setOtpDigits, otpTimer, onVerify, onResend, onNavigate, pendingEmail }) {
  const setDigit = (idx, value) => {
    const next = [...otpDigits];
    next[idx] = value.replace(/\D/g, '').slice(0, 1);
    setOtpDigits(next);
  };
  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo"><div className="auth-logo-icon">🎓</div><span className="auth-logo-text">StudyHub</span></div>
        <div className="otp-icon-wrap">✉️</div>
        <h2 className="auth-title">Xác thực email</h2>
        <p className="auth-subtitle">Chúng tôi đã gửi mã OTP 6 chữ số đến<br /><strong id="otpEmailDisplay">{pendingEmail || 'nguyenvana@email.com'}</strong></p>
        <div className="otp-inputs">
          {otpDigits.map((digit, idx) => <input key={idx} className={`otp-input ${digit ? 'filled' : ''}`} type="text" maxLength={1} value={digit} onChange={(e) => setDigit(idx, e.target.value)} />)}
        </div>
        <div className="otp-timer">🕐 Mã sẽ hết hạn sau <span className="otp-timer-val">{otpTimer}</span></div>
        <button className="btn btn-primary btn-full btn-lg" onClick={onVerify}>Xác nhận</button>
        <div className="auth-footer-text" style={{ marginTop: 16 }}>Không nhận được mã? <span className="resend-link" onClick={onResend}>Gửi lại OTP</span></div>
        <div className="auth-back" onClick={() => onNavigate('register')}>← Sai email? Quay lại</div>
      </div>
    </div>
  );
}

function TutorListPage({ tutors, filter, setFilter, onNavigate, availableOnly, setAvailableOnly, onClearFilters }) {
  return (
    <>
      <SiteNav active="tutors" onNavigate={onNavigate} />
      <div className="page-container">
        <div className="page-header"><h1>Tìm gia sư</h1><p>Tìm thấy {tutors.length} gia sư phù hợp</p></div>
        <div className="tutor-list-layout">
          <div className="filter-panel">
            <div className="filter-title">☰ Bộ lọc</div>
            <div className="filter-group"><label className="filter-label">Tìm kiếm</label><input className="filter-input" type="text" placeholder="Tên hoặc môn học..." value={filter.search} onChange={(e) => setFilter((p) => ({ ...p, search: e.target.value }))} /></div>
            <div className="filter-group"><label className="filter-label">Môn học</label><select className="filter-select" value={filter.subject} onChange={(e) => setFilter((p) => ({ ...p, subject: e.target.value }))}><option value="">Tất cả môn học</option>{['Toán học', 'Vật lý', 'Hóa học', 'Sinh học', 'Tiếng Anh', 'IELTS', 'Tiếng Nhật', 'Tiếng Trung', 'Lập trình Python', 'Data Science', 'Web Development', 'Lập trình Java'].map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="filter-group"><label className="filter-label">Mức giá (45 phút)</label><select className="filter-select" value={filter.price} onChange={(e) => setFilter((p) => ({ ...p, price: e.target.value }))}><option value="">Tất cả</option><option value="0-150000">Dưới 150.000đ</option><option value="150000-200000">150.000 - 200.000đ</option><option value="200000-999999">Trên 200.000đ</option></select></div>
            <div className="filter-group"><label className="filter-label">Đánh giá tối thiểu</label><div className="radio-group"><label className="radio-label"><input type="radio" name="rating" checked={filter.rating === '4.5'} onChange={() => setFilter((p) => ({ ...p, rating: '4.5' }))} /> ⭐ 4.5+</label><label className="radio-label"><input type="radio" name="rating" checked={filter.rating === '4.0'} onChange={() => setFilter((p) => ({ ...p, rating: '4.0' }))} /> ⭐ 4.0+</label><label className="radio-label"><input type="radio" name="rating" checked={filter.rating === '3.5'} onChange={() => setFilter((p) => ({ ...p, rating: '3.5' }))} /> ⭐ 3.5+</label><label className="radio-label"><input type="radio" name="rating" checked={filter.rating === ''} onChange={() => setFilter((p) => ({ ...p, rating: '' }))} /> Tất cả</label></div></div>
            <div className="filter-group"><label className="filter-label">Khung giờ trống</label><div className="toggle-row"><span className="toggle-label">Đang trống ngay bây giờ</span><button className={`toggle-switch ${availableOnly ? '' : 'off'}`} onClick={() => setAvailableOnly((v) => !v)} /></div><label className="filter-label" style={{ marginTop: 8 }}>Khung giờ mong muốn</label><div className="radio-group"><label className="radio-label"><input type="radio" name="timeSlot" checked={filter.timeSlot === ''} onChange={() => setFilter((p) => ({ ...p, timeSlot: '' }))} /> Bất kỳ</label><label className="radio-label"><input type="radio" name="timeSlot" checked={filter.timeSlot === 'morning'} onChange={() => setFilter((p) => ({ ...p, timeSlot: 'morning' }))} /> Sáng (6h - 12h)</label><label className="radio-label"><input type="radio" name="timeSlot" checked={filter.timeSlot === 'afternoon'} onChange={() => setFilter((p) => ({ ...p, timeSlot: 'afternoon' }))} /> Chiều (12h - 18h)</label><label className="radio-label"><input type="radio" name="timeSlot" checked={filter.timeSlot === 'evening'} onChange={() => setFilter((p) => ({ ...p, timeSlot: 'evening' }))} /> Tối (18h - 22h)</label></div></div>
            <span className="clear-filter" onClick={onClearFilters}>Xóa bộ lọc</span>
          </div>
          <div>
            <div className="tutor-results">{tutors.length ? tutors.map((t) => <TutorResultCard key={t.id} tutor={t} />) : <EmptyState />}</div>
            {!tutors.length ? <SuggestedSection /> : null}
            <div className="pagination"><button className="btn page-btn page-btn-text" onClick={() => toast('Đây là trang đầu tiên')}>Trước</button><button className="page-btn active">1</button><button className="page-btn" onClick={() => toast('Demo - chỉ có 1 trang')}>2</button><button className="page-btn" onClick={() => toast('Demo - chỉ có 1 trang')}>3</button><button className="btn page-btn page-btn-text" onClick={() => toast('Demo - chỉ có 1 trang')}>Sau</button></div>
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </>
  );
}

function TutorResultCard({ tutor }) {
  return (
    <div className="tutor-result-card" onClick={() => toast(`Xem hồ sơ ${tutor.name}...`, 'success')}>
      <div className="tutor-result-top"><div className="tutor-result-avatar" style={{ background: `${tutor.avatar}20`, color: tutor.avatar }}>{tutor.initials}</div><div className="tutor-result-info"><h3>{tutor.name}</h3><div className="tutor-result-rating">⭐ {tutor.rating} <span>({tutor.reviews})</span></div></div></div>
      <div className="tutor-result-desc">{tutor.desc}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>{tutor.subjects.map((s) => <span key={s} className="tag">{s}</span>)}</div>
      <div className="tutor-result-footer"><span className="tutor-sessions">{tutor.sessions.toLocaleString()} buổi học</span><span className="tutor-result-price">{tutor.price.toLocaleString()}đ/45p</span></div>
    </div>
  );
}

function EmptyState() {
  return <div className="empty-state"><div className="empty-icon">🔍</div><div className="empty-title">Không tìm thấy kết quả phù hợp</div><div className="empty-desc">Chúng tôi không tìm được gia sư nào thoả toàn bộ tiêu chí bạn chọn. Hãy thử bớt bộ lọc hoặc xem các gia sư có môn học tương tự ở bên dưới.</div><div className="empty-actions"><button className="btn btn-outline" onClick={() => toast('Hãy xóa bộ lọc để xem thêm gia sư')}>Xóa tất cả bộ lọc</button><button className="btn btn-primary" onClick={() => toast('Xem gia sư gợi ý')}>Xem gia sư gợi ý</button></div></div>;
}

function SuggestedSection() {
  return <div className="suggested-section"><div className="suggested-title"><span className="dot"></span> Gia sư có môn học tương tự</div><div className="suggested-desc">Bạn có thể tham khảo các gia sư dạy môn cùng nhóm, mức giá gần với tiêu chí bạn đã chọn</div><div className="suggested-cards">{suggestedTutors.map((s) => <div className="suggested-card" key={s.name}><div className="sug-top"><div className="sug-avatar" style={{ background: s.avatar }}>{s.initials}</div><div><div className="sug-name">{s.name}</div><div className="sug-subjects">{s.subjects}</div></div></div><div className="sug-rating">⭐ {s.rating} <span>({s.reviews} đánh giá)</span></div><div className="sug-desc">Gia sư tận tâm, giàu kinh nghiệm luyện thi và ôn tập kiến thức cơ bản.</div><div className="sug-footer"><span className="sug-available">● Còn lịch trống hôm nay</span><span className="sug-price">{s.price.toLocaleString()}đ /45 phút</span></div></div>)}</div></div>;
}

function DashboardPage({ dashboard, activeTab, setActiveTab, onNavigate, onCancelBooking }) {
  return <><SiteNav active="role-select" onNavigate={onNavigate} /><div className="dashboard-container"><div className="dashboard-header"><h1>Lịch học của tôi</h1><p>Quản lý các buổi học và đánh giá gia sư</p></div><div className="tabs"><div className={`tab-item ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>Sắp diễn ra (2)</div><div className={`tab-item ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>Đã hoàn thành (1)</div></div>{activeTab === 'upcoming' ? <div id="tab-upcoming"><BookingCard tutor="Nguyễn Minh Anh" subject="Toán học" date="2026-05-08" time="19:00" duration={45} price={150000} status="Đã xác nhận" avatar="NMA" action={<><button className="btn btn-primary btn-sm" onClick={() => toast('Đang vào lớp học...', 'success')}>Vào lớp học</button><button className="btn btn-outline btn-sm" onClick={(e) => onCancelBooking(e.currentTarget)}>Hủy buổi học</button></>} /><BookingCard tutor="Trần Hải Đăng" subject="IELTS Speaking" date="2026-05-10" time="20:00" duration={30} price={200000} status="Đã xác nhận" avatar="THĐ" avatarStyle={{ background: '#EDE9FE', color: '#7C3AED' }} action={<><button className="btn btn-primary btn-sm" onClick={() => toast('Đang vào lớp học...', 'success')}>Vào lớp học</button><button className="btn btn-outline btn-sm" onClick={(e) => onCancelBooking(e.currentTarget)}>Hủy buổi học</button></>} /></div> : <div id="tab-completed"><BookingCard tutor="Phạm Quốc Khánh" subject="Python cơ bản" date="2026-04-28" time="20:30" duration={45} price={250000} status="Đã hoàn thành" avatar="PQK" avatarStyle={{ background: '#E3FAFC', color: '#0C8599' }} action={<><button className="btn btn-primary btn-sm" onClick={() => toast('Mở form đánh giá gia sư...', 'success')}>Đánh giá</button><button className="btn btn-outline btn-sm" onClick={() => toast('Chuyển đến trang đặt lịch...', 'success')}>Đặt lại</button></>} /></div>}</div><Footer onNavigate={onNavigate} /></>;
}

function BookingCard({ tutor, subject, date, time, duration, price, status, avatar, avatarStyle, action }) {
  return <div className="booking-card"><div className="booking-top"><div className="booking-tutor"><div className="booking-avatar" style={avatarStyle}>{avatar}</div><div><div className="booking-info"><h3>{tutor}</h3></div><div className="booking-subject">{subject}</div><div className="booking-meta"><span className="booking-meta-item">📅 {date}</span><span className="booking-meta-item">🕐 {time} ({duration} phút)</span><span className="booking-price">{price.toLocaleString()}đ</span></div></div></div><span className={`status-badge ${status === 'Đã xác nhận' ? 'status-confirmed' : 'status-completed'}`}>{status}</span></div><div className="booking-actions">{action}</div></div>;
}

function BecomeTutorPage({ form, setForm, onSubmit, onNavigate, subjectOptions }) {
  const toggleSubject = (subject) => {
    setForm((prev) => ({ ...prev, subjects: prev.subjects.includes(subject) ? prev.subjects.filter((s) => s !== subject) : [...prev.subjects, subject] }));
  };
  return <><SiteNav active="become-tutor" onNavigate={onNavigate} /><div className="become-hero"><h1>Trở thành gia sư trên StudyHub</h1><p>Chia sẻ kiến thức, tạo thu nhập linh hoạt từ thời gian rảnh của bạn</p></div><div className="why-section"><h2 className="section-title" style={{ marginBottom: 8 }}>Tại sao chọn StudyHub?</h2><p className="section-subtitle" style={{ marginBottom: 40 }}> </p><div className="why-grid"><WhyItem icon="💰" title="Thu nhập hấp dẫn" desc="Tự định giá dịch vụ của bạn, nhận 85% doanh thu từ mỗi buổi học" /><WhyItem icon="🕐" title="Linh hoạt thời gian" desc="Tự chọn lịch dạy phù hợp, buổi học ngắn 30-45 phút dễ sắp xếp" /><WhyItem icon="👥" title="Kết nối rộng rãi" desc="Tiếp cận hàng nghìn học viên trên toàn quốc qua nền tảng" /></div></div><div className="register-section"><h2 className="section-title" style={{ marginBottom: 8 }}>Đăng ký ngay</h2><p className="section-subtitle" style={{ marginBottom: 32 }}>Điền thông tin dưới đây để bắt đầu hành trình giảng dạy</p><div className="register-form-card"><div className="form-row"><Input label="Họ và tên *" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} placeholder="Nguyễn Văn A" noIcon /><Input label="Email *" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} placeholder="email@example.com" noIcon /></div><div className="input-group" style={{ marginTop: 16 }}><label className="input-label">Số điện thoại</label><input className="input-field no-icon" type="tel" placeholder="0912345678" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></div><div className="input-group"><label className="input-label">Môn học bạn có thể dạy *</label><div className="subjects-checkbox-grid">{[...subjectOptions, 'Lập trình Java', 'Web Development', 'Data Science', 'Văn học'].map((s) => <label className="checkbox-item" key={s}><input type="checkbox" checked={form.subjects.includes(s)} onChange={() => toggleSubject(s)} /> {s}</label>)}</div><div className="selected-count">Đã chọn: {form.subjects.length} môn</div></div><Input label="Học vấn" value={form.education} onChange={(v) => setForm((p) => ({ ...p, education: v }))} placeholder="Thạc sĩ Toán học; ĐH Khoa học Tự nhiên" noIcon /><div className="input-group"><label className="input-label">Kinh nghiệm giảng dạy</label><textarea className="textarea-field" rows="3" placeholder="5 năm giảng dạy tại trường THPT, 200+ học sinh đạt điểm cao..." value={form.experience} onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))} /></div><div className="input-group"><label className="input-label">Mức giá mong muốn (45 phút)</label><input className="input-field no-icon" type="number" placeholder="150000" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} /><div className="price-hint">Mức giá trung bình: 120.000 - 250.000đ</div></div><div className="input-group"><label className="input-label">Giới thiệu về bạn</label><textarea className="textarea-field" rows="4" placeholder="Chia sẻ về phong cách giảng dạy, điểm mạnh của bạn..." value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} /></div><button className="btn btn-primary btn-full btn-lg" onClick={onSubmit}>✅ Gửi đăng ký</button><div className="submit-note">Sau khi gửi đăng ký, đội ngũ StudyHub sẽ xét duyệt và liên hệ với bạn trong vòng 24 giờ.</div></div></div><div className="process-section"><h2 className="section-title">Quy trình làm việc</h2><div className="process-steps"><ProcessStep num="1" title="Đăng ký" desc="Điền form và chờ phê duyệt" /><ProcessStep num="2" title="Tạo hồ sơ" desc="Hoàn thiện thông tin cá nhân" /><ProcessStep num="3" title="Nhận lịch học" desc="Học viên đặt lịch, bạn xác nhận" /><ProcessStep num="4" title="Giảng dạy" desc="Dạy học và nhận thu nhập" /></div></div><Footer onNavigate={onNavigate} /></>;
}

function WhyItem({ icon, title, desc }) {
  return <div className="why-item"><div className="why-icon-wrap">{icon}</div><h3>{title}</h3><p>{desc}</p></div>;
}
function ProcessStep({ num, title, desc }) {
  return <div className="process-step"><div className="step-number">{num}</div><h4>{title}</h4><p>{desc}</p></div>;
}
function FeatureItem({ icon, title, desc }) {
  return <div className="feature-item"><div className="feature-icon">{icon}</div><div className="feature-title">{title}</div><div className="feature-desc">{desc}</div></div>;
}
function Input({ label, icon, value, onChange, placeholder, type = 'text', noIcon = false }) {
  return <div className="input-group"><label className="input-label">{label}</label><div className="input-wrap">{!noIcon ? <span className="input-icon">{icon}</span> : null}<input className={`input-field ${noIcon ? 'no-icon' : ''}`} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></div></div>;
}
