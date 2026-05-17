import { useApp } from '../../store/AppContext';

// ─── Logo SVG ────────────────────────────────────────────────────
export function Logo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

// ─── Google Icon ─────────────────────────────────────────────────
export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────
export function Navbar({ active }) {
  const { navigate, showToast } = useApp();
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('home')}>
        <div className="navbar-logo"><Logo /></div>
        <span className="navbar-name">StudyHub</span>
      </div>
      <div className="navbar-links">
        <span className={`navbar-link ${active === 'tutors' ? 'active' : ''}`} onClick={() => navigate('tutors')}>🔍 Tìm gia sư</span>
        <span className={`navbar-link ${active === 'become-tutor' ? 'active' : ''}`} onClick={() => navigate('become-tutor')}>📋 Trở thành gia sư</span>
        <span className={`navbar-link ${active === 'dashboard' ? 'active' : ''}`} onClick={() => navigate('role-select')}>👤 Tài khoản</span>
      </div>
    </nav>
  );
}

// ─── Footer ──────────────────────────────────────────────────────
export function Footer() {
  const { navigate } = useApp();
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h4>StudyHub</h4>
          <p>Nền tảng kết nối gia sư và học viên với các buổi học ngắn 30-45 phút, linh hoạt thời gian.</p>
        </div>
        <div className="footer-col">
          <h4>Dành cho học viên</h4>
          <a onClick={() => navigate('tutors')}>Tìm gia sư</a>
          <a onClick={() => navigate('dashboard')}>Lịch học của tôi</a>
          <a>Cách thức hoạt động</a>
        </div>
        <div className="footer-col">
          <h4>Dành cho gia sư</h4>
          <a onClick={() => navigate('become-tutor')}>Đăng ký dạy học</a>
          <a>Chính sách thanh toán</a>
          <a>Hướng dẫn sử dụng</a>
        </div>
        <div className="footer-col">
          <h4>Liên hệ</h4>
          <p>Email: support@studyhub.vn</p>
          <p>Hotline: 1900 xxxx</p>
          <p>Giờ làm việc: 8:00 - 22:00</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 StudyHub. All rights reserved.</span>
        <span className="footer-admin" onClick={() => navigate('login-admin')}>Admin</span>
      </div>
    </footer>
  );
}

// ─── Toast ───────────────────────────────────────────────────────
export function Toast() {
  const { state } = useApp();
  const { toast } = state;
  if (!toast.msg) return null;
  return <div className={`toast ${toast.type}`}>{toast.msg}</div>;
}

// ─── Email Exist Modal ────────────────────────────────────────────
export function EmailModal() {
  const { state, dispatch, navigate } = useApp();
  const { emailModal } = state;
  if (!emailModal.open) return null;
  const close = () => dispatch({ type: 'SET_EMAIL_MODAL', payload: { open: false, msg: '' } });
  return (
    <div className="modal-overlay">
      <div className="error-modal">
        <div className="error-modal-title">⚠️ Email đã được đăng ký</div>
        <div className="error-modal-body">{emailModal.msg}</div>
        <div className="error-modal-actions">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { close(); navigate('role-select'); }}>Đăng nhập ngay</button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={close}>Dùng email khác</button>
        </div>
      </div>
    </div>
  );
}

// ─── AuthLogo ────────────────────────────────────────────────────
export function AuthLogo() {
  return (
    <div className="auth-logo">
      <div className="auth-logo-icon"><Logo /></div>
      <span className="auth-logo-text">StudyHub</span>
    </div>
  );
}

// ─── Input Field ─────────────────────────────────────────────────
export function InputField({ label, icon, value, onChange, placeholder, type = 'text', noIcon = false, hint }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrap">
        {!noIcon && <span className="input-icon">{icon}</span>}
        <input
          className={`input-field${noIcon ? ' no-icon' : ''}`}
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {hint && <div className="input-hint">{hint}</div>}
    </div>
  );
}
