import { useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { useAuth } from '../../hooks';
import { AuthLogo, GoogleIcon, InputField } from '../common';

export function RoleSelectPage() {
  const { state, dispatch, navigate } = useApp();
  const roles = [
    { key: 'student', icon: '🎓', title: 'Người học', desc: 'Tìm kiếm gia sư phù hợp, đặt lịch học 1-1 và nâng cao kiến thức mỗi ngày.', purple: false },
    { key: 'tutor', icon: '💼', title: 'Người dạy', desc: 'Chia sẻ chuyên môn, tạo lịch dạy linh hoạt và tăng thu nhập từ việc giảng dạy.', purple: true },
    { key: 'admin', icon: '🖥️', title: 'Quản trị viên', desc: 'Quản lý hệ thống, duyệt thông tin người dùng và đảm bảo môi trường học tập an toàn.', purple: true }
  ];
  return <div className="role-select-bg"><div className="role-card-wrap"><AuthLogo /><h2 className="role-title">Bạn đăng nhập với vai trò nào?</h2><p className="role-subtitle">Chọn loại tài khoản để tiếp tục đăng nhập</p><div className="role-grid">{roles.map((r) => <div key={r.key} className={`role-item ${state.selectedRole === r.key ? 'selected' : ''}`} onClick={() => dispatch({ type: 'SET_SELECTED_ROLE', payload: r.key })}><div className={`role-icon-wrap ${r.purple ? 'purple' : ''}`}>{r.icon}</div><div className="role-item-title">{r.title}</div><div className="role-item-desc">{r.desc}</div><div className="role-item-link" onClick={(e) => { e.stopPropagation(); navigate(`login-${r.key}`); }}>{state.selectedRole === r.key ? 'Đăng nhập »' : 'Đăng nhập với vai trò này'}</div></div>)}</div><div className="auth-footer-text">Bạn chưa có tài khoản? <span className="link" onClick={() => navigate('register')}>Đăng ký ngay</span></div></div></div>;
}

export function LoginPage({ role }) {
  const { state, dispatch, navigate, showToast } = useApp();
  const { doLogin } = useAuth();
  const { login } = state;
  const isTutor = role === 'tutor';
  const isAdmin = role === 'admin';
  const emailKey = isAdmin ? 'adminEmail' : isTutor ? 'tutorEmail' : 'studentEmail';
  const passKey = isAdmin ? 'adminPass' : isTutor ? 'tutorPass' : 'studentPass';
  return <div className="auth-bg"><div className="auth-card"><AuthLogo /><div style={{ textAlign: 'center', marginBottom: 16 }}><span className={`auth-badge ${isTutor || isAdmin ? 'purple' : ''}`}>{isAdmin ? '🖥️ Quản trị viên' : isTutor ? '💼 Người dạy' : '🎓 Người học'}</span></div><h2 className="auth-title">{isAdmin ? 'Cổng quản trị nội bộ' : isTutor ? 'Chào mừng gia sư quay lại' : 'Chào mừng bạn quay lại'}</h2><p className="auth-subtitle">{isAdmin ? 'Đăng nhập để quản lý hệ thống, báo cáo và người dùng' : isTutor ? 'Đăng nhập để quản lý lịch dạy, học viên và thu nhập của bạn' : 'Đăng nhập để tiếp tục hành trình học tập và đặt lịch với gia sư'}</p><InputField label="Email" icon="✉️" value={login[emailKey]} onChange={(v) => dispatch({ type: 'SET_LOGIN', payload: { [emailKey]: v } })} placeholder={isAdmin ? 'admin@studyhub.vn' : isTutor ? 'tutor@studyhub.vn' : 'student@studyhub.vn'} /><InputField label="Mật khẩu" icon="🔒" type="password" value={login[passKey]} onChange={(v) => dispatch({ type: 'SET_LOGIN', payload: { [passKey]: v } })} placeholder="••••••••" /><div className="remember-row"><label className="checkbox-label"><input type="checkbox" defaultChecked /> Ghi nhớ đăng nhập</label><span className="forgot-link" style={{ color: isTutor || isAdmin ? 'var(--purple)' : 'var(--blue)' }}>Quên mật khẩu?</span></div><button className={`btn btn-full btn-lg ${isTutor || isAdmin ? 'btn-primary-purple' : 'btn-primary'}`} onClick={() => doLogin(role)}>Đăng nhập</button><div className="auth-divider">Hoặc</div><button className="google-btn" onClick={() => showToast('Chức năng Google sẽ sớm ra mắt!', 'success')}><GoogleIcon /> Đăng nhập với Google</button><div className="auth-footer-text">Bạn chưa có tài khoản? <span className="link" onClick={() => navigate('register')}>Đăng ký ngay</span></div><div className="auth-back" onClick={() => navigate('role-select')}>← Chọn vai trò khác</div></div></div>;
}

export function RegisterPage() {
  const { state, dispatch, navigate, showToast } = useApp();
  const { doRegister } = useAuth();
  const { register } = state;
  const set = (field, val) => dispatch({ type: 'SET_REGISTER', payload: { [field]: val } });
  return <div className="auth-bg"><div className="auth-card"><AuthLogo /><div style={{ textAlign: 'center', marginBottom: 16 }}><span className="auth-badge">🎓 Đăng ký làm Người học</span></div><h2 className="auth-title">Tạo tài khoản mới</h2><p className="auth-subtitle">Trải nghiệm học tập với gia sư hàng đầu Việt Nam</p><InputField label="Họ và tên" icon="👤" value={register.name} onChange={(v) => set('name', v)} placeholder="Nguyễn Văn A" /><InputField label="Email" icon="✉️" value={register.email} onChange={(v) => set('email', v)} placeholder="nguyenvana@email.com" /><InputField label="Mật khẩu" icon="🔒" type="password" value={register.pass} onChange={(v) => set('pass', v)} placeholder="Tối thiểu 8 ký tự" hint="Bao gồm chữ hoa, chữ thường và số" /><InputField label="Xác nhận mật khẩu" icon="🔒" type="password" value={register.confirm} onChange={(v) => set('confirm', v)} placeholder="Nhập lại mật khẩu" /><div style={{ marginBottom: 20 }}><label className="checkbox-label"><input type="checkbox" checked={register.agree} onChange={(e) => set('agree', e.target.checked)} /> Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của StudyHub</label></div><button className="btn btn-primary btn-full btn-lg" onClick={doRegister}>Tạo tài khoản</button><div className="auth-divider">Hoặc</div><button className="google-btn" onClick={() => showToast('Chức năng Google sẽ sớm ra mắt!', 'success')}><GoogleIcon /> Đăng ký với Google</button><div className="auth-footer-text">Đã có tài khoản? <span className="link" onClick={() => navigate('role-select')}>Đăng nhập</span></div></div></div>;
}

export function OTPPage() {
  const { state, dispatch } = useApp();
  const { verifyOTP, resendOTP } = useAuth();
  const { otpDigits, otpTimer, pendingUser } = state;
  useEffect(() => {
    let seconds = 299;
    dispatch({ type: 'SET_OTP_TIMER', payload: '04:59' });
    dispatch({ type: 'SET_OTP_DIGITS', payload: ['','','','','',''] });
    const timer = setInterval(() => { const m = Math.floor(seconds / 60).toString().padStart(2, '0'); const s = (seconds % 60).toString().padStart(2, '0'); dispatch({ type: 'SET_OTP_TIMER', payload: `${m}:${s}` }); if (seconds-- <= 0) clearInterval(timer); }, 1000);
    return () => clearInterval(timer);
  }, []);
  const setDigit = (idx, value) => { const next = [...otpDigits]; next[idx] = value.replace(/\D/g, '').slice(0, 1); dispatch({ type: 'SET_OTP_DIGITS', payload: next }); if (value && idx < 5) document.querySelectorAll('.otp-input')[idx + 1]?.focus(); };
  const handleKeyDown = (e, idx) => { if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) { const next = [...otpDigits]; next[idx - 1] = ''; dispatch({ type: 'SET_OTP_DIGITS', payload: next }); document.querySelectorAll('.otp-input')[idx - 1]?.focus(); } };
  return <div className="auth-bg"><div className="auth-card"><AuthLogo /><div className="otp-icon-wrap">✉️</div><h2 className="auth-title">Xác thực email</h2><p className="auth-subtitle">Chúng tôi đã gửi mã OTP 6 chữ số đến<br /><strong>{pendingUser?.email || 'email của bạn'}</strong></p><div className="otp-inputs">{otpDigits.map((digit, idx) => <input key={idx} className={`otp-input ${digit ? 'filled' : ''}`} type="text" maxLength={1} value={digit} onChange={(e) => setDigit(idx, e.target.value)} onKeyDown={(e) => handleKeyDown(e, idx)} />)}</div><div className="otp-timer">🕐 Mã sẽ hết hạn sau <span className="otp-timer-val">{otpTimer}</span></div><button className="btn btn-primary btn-full btn-lg" onClick={verifyOTP}>Xác nhận</button><div className="auth-footer-text" style={{ marginTop: 16 }}>Không nhận được mã? <span className="resend-link" onClick={resendOTP}>Gửi lại OTP</span></div><div className="auth-back" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'register' })}>← Sai email? Quay lại</div></div></div>;
}
