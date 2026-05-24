import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { useBooking, useAuth } from '../../hooks';

export function Logo() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>;
}

export function GoogleIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>;
}

export function Navbar({ active }) {
  const { state, navigate } = useApp();
  const { doLogout } = useAuth();
  const [open, setOpen] = useState(false);
  const user = state.currentUser;
  const isTutor = user?.role === 'tutor';
  const isAdmin = user?.role === 'admin';
  return <nav className="navbar"><div className="navbar-brand" onClick={() => navigate(isAdmin ? 'admin' : 'home')}><div className="navbar-logo"><Logo /></div><span className="navbar-name">StudyHub</span></div><div className="navbar-links">{!isAdmin && <><span className={`navbar-link ${active === 'tutors' ? 'active' : ''}`} onClick={() => navigate('tutors')}>Tìm gia sư</span><span className={`navbar-link ${active === 'become-tutor' ? 'active' : ''}`} onClick={() => navigate('become-tutor')}>Trở thành gia sư</span></>}{!user ? <><span className={`navbar-link ${active === 'role-select' ? 'active' : ''}`} onClick={() => navigate('register')}>Đăng ký</span><span className={`navbar-link ${active === 'role-select' ? 'active' : ''}`} onClick={() => navigate('role-select')}>Đăng nhập</span></> : <div className="user-menu"><button className="user-trigger" onClick={() => setOpen((v) => !v)}><span className="user-avatar">{user.avatar || user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}</span><span>{user.name}</span></button>{open ? <div className="user-dropdown">{!isAdmin && isTutor && <button onClick={() => { setOpen(false); navigate('tutor-profile'); }}>Hồ sơ gia sư</button>}{!isAdmin && !isTutor && <button onClick={() => { setOpen(false); navigate('dashboard'); }}>Trang cá nhân</button>}{!isAdmin && <button onClick={() => { setOpen(false); navigate('wallet'); }}>Ví tiền</button>}<button onClick={() => { setOpen(false); doLogout(); }}>Đăng xuất</button></div> : null}</div>}</div></nav>;
}

export function Footer() {
  const { navigate } = useApp();
  return <footer className="footer"><div className="footer-grid"><div className="footer-col"><h4>StudyHub</h4><p>Nền tảng kết nối gia sư và học viên với các buổi học ngắn 30-45 phút, linh hoạt thời gian.</p></div><div className="footer-col"><h4>Liên hệ</h4><p>Email: support@studyhub.vn</p><p>Hotline: 1900 xxxx</p><p>Giờ làm việc: 8:00 - 22:00</p></div></div><div className="footer-bottom"><span>© 2026 StudyHub. All rights reserved.</span><span className="footer-admin" onClick={() => navigate('login-admin')}>Admin</span></div></footer>;
}

export function Toast() { const { state } = useApp(); if (!state.toast.msg) return null; return <div className={`toast ${state.toast.type}`}>{state.toast.msg}</div>; }

export function EmailModal() { const { state, dispatch, navigate } = useApp(); if (!state.emailModal.open) return null; return <div className="modal-overlay"><div className="error-modal"><div className="error-modal-title">⚠️ Email đã được đăng ký</div><div className="error-modal-body">{state.emailModal.msg}</div><div className="error-modal-actions"><button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { dispatch({ type: 'SET_EMAIL_MODAL', payload: { open: false, msg: '' } }); navigate('role-select'); }}>Đăng nhập ngay</button><button className="btn btn-outline" style={{ flex: 1 }} onClick={() => dispatch({ type: 'SET_EMAIL_MODAL', payload: { open: false, msg: '' } })}>Dùng email khác</button></div></div></div>;
}

export function AuthLogo() { return <div className="auth-logo"><div className="auth-logo-icon"><Logo /></div><span className="auth-logo-text">StudyHub</span></div>; }

export function InputField({ label, icon, value, onChange, placeholder, type = 'text', noIcon = false, hint }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;
  return <div className="input-group">{label && <label className="input-label">{label}</label>}<div className="input-wrap">{!noIcon && <span className="input-icon">{icon}</span>}<input className={`input-field${noIcon ? ' no-icon' : ''}${isPassword ? ' has-eye' : ''}`} type={inputType} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />{isPassword && <button type="button" className="eye-toggle" onClick={() => setShow((v) => !v)}>{show ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}</button>}</div>{hint && <div className="input-hint">{hint}</div>}</div>;
}

export function BookingModal() { const { state, dispatch } = useApp(); const { submitBooking } = useBooking(); const { bookingModal } = state; if (!bookingModal.open) return null; return <div className="modal-overlay"><div className="error-modal"><div className="error-modal-title">Đặt lịch học</div><div className="input-group"><label className="input-label">Gia sư</label><div className="muted">{bookingModal.tutor?.name || ''}</div></div><div className="input-group"><label className="input-label">Ngày học</label><input className="input-field no-icon" value={bookingModal.date} onChange={(e) => dispatch({ type: 'SET_BOOKING_MODAL', payload: { date: e.target.value } })} /></div><div className="input-group"><label className="input-label">Giờ học</label><input className="input-field no-icon" value={bookingModal.time} onChange={(e) => dispatch({ type: 'SET_BOOKING_MODAL', payload: { time: e.target.value } })} /></div><div className="input-group"><label className="input-label">Ghi chú</label><textarea className="textarea-field" rows="3" value={bookingModal.note} onChange={(e) => dispatch({ type: 'SET_BOOKING_MODAL', payload: { note: e.target.value } })} /></div><div className="error-modal-actions"><button className="btn btn-primary" style={{ flex: 1 }} onClick={submitBooking}>Xác nhận</button><button className="btn btn-outline" style={{ flex: 1 }} onClick={() => dispatch({ type: 'SET_BOOKING_MODAL', payload: { open: false, tutor: null } })}>Đóng</button></div></div></div>;
}

export function ReviewModal() { const { state, dispatch } = useApp(); const { submitReview } = useBooking(); const { reviewModal } = state; if (!reviewModal.open) return null; return <div className="modal-overlay"><div className="error-modal"><div className="error-modal-title">Đánh giá buổi học</div><div className="input-group"><label className="input-label">Gia sư</label><div className="muted">{reviewModal.tutorName}</div></div><div className="input-group"><label className="input-label">Điểm đánh giá</label><select className="filter-select" value={reviewModal.rating} onChange={(e) => dispatch({ type: 'SET_REVIEW_MODAL', payload: { rating: e.target.value } })}><option value="5">5 sao</option><option value="4">4 sao</option><option value="3">4 sao</option><option value="2">2 sao</option><option value="1">1 sao</option></select></div><div className="input-group"><label className="input-label">Nhận xét</label><textarea className="textarea-field" rows="4" value={reviewModal.comment} onChange={(e) => dispatch({ type: 'SET_REVIEW_MODAL', payload: { comment: e.target.value } })} /></div><div className="error-modal-actions"><button className="btn btn-primary" style={{ flex: 1 }} onClick={submitReview}>Gửi đánh giá</button><button className="btn btn-outline" style={{ flex: 1 }} onClick={() => dispatch({ type: 'SET_REVIEW_MODAL', payload: { open: false, tutorName: '', rating: '5', comment: '' } })}>Đóng</button></div></div></div>;
}

export function ReportModal() {
  const { state, dispatch } = useApp();
  const { openReportModal, submitReport } = useBooking();
  const { reportModal } = state;
  if (!reportModal.open) return null;
  return <div className="modal-overlay"><div className="error-modal"><div className="error-modal-title">Báo cáo / Khiếu nại</div><div className="input-group"><label className="input-label">Khóa học / Gia sư</label><div className="muted">{reportModal.tutorName}</div></div><div className="input-group"><label className="input-label">Loại báo cáo</label><select className="filter-select" value={reportModal.issue} onChange={(e) => dispatch({ type: 'SET_REPORT_MODAL', payload: { issue: e.target.value } })}><option value="quality">Chất lượng buổi học</option><option value="attendance">Vấn đề điểm danh / vào lớp</option><option value="payment">Thanh toán / hoàn tiền</option><option value="behavior">Hành vi / thái độ</option><option value="other">Khác</option></select></div><div className="input-group"><label className="input-label">Nội dung</label><textarea className="textarea-field" rows="4" value={reportModal.detail} onChange={(e) => dispatch({ type: 'SET_REPORT_MODAL', payload: { detail: e.target.value } })} placeholder="Mô tả chi tiết để quản lý xử lý..." /></div><div className="error-modal-actions"><button className="btn btn-primary" style={{ flex: 1 }} onClick={submitReport}>Gửi báo cáo</button><button className="btn btn-outline" style={{ flex: 1 }} onClick={() => dispatch({ type: 'SET_REPORT_MODAL', payload: { open: false, bookingId: null, tutorName: '', issue: 'quality', detail: '' } })}>Đóng</button></div></div></div>;
}

export function TutorModal() {
  const { state, dispatch } = useApp();
  const { tutorModal } = state;
  const { openBookingModal } = useBooking();

  if (!tutorModal?.open || !tutorModal.tutor) return null;
  const t = tutorModal.tutor;

  return (
    <div className="modal-overlay" onClick={() => dispatch({ type: 'SET_TUTOR_MODAL', payload: { open: false, tutor: null } })}>
      <div className="tutor-modal" onClick={(e) => e.stopPropagation()}>
        <button className="tutor-modal-close" onClick={() => dispatch({ type: 'SET_TUTOR_MODAL', payload: { open: false, tutor: null } })}>✕</button>

        <div className="tutor-modal-header">
          <div className="tutor-avatar-lg" style={{ background: `${t.color}20`, color: t.color }}>
            {t.initials}
          </div>
          <div className="tutor-info-section">
            <h2 className="tutor-name">{t.name}</h2>
            <div className="tutor-rating">⭐ {t.rating} <span>({t.reviews} đánh giá)</span></div>
            <div className="tutor-status" style={{ color: t.status === 'Online' ? '#2F9E44' : '#666' }}>
              ● {t.status}
            </div>
          </div>
        </div>

        <div className="tutor-modal-body">
          <div className="info-block">
            <h3>Giới thiệu</h3>
            <p>{t.desc}</p>
          </div>

          <div className="info-block">
            <h3>Chuyên môn</h3>
            <div className="subjects-list">
              {t.subjects?.map((s) => (
                <span key={s} className="subject-tag">{s}</span>
              ))}
            </div>
          </div>

          <div className="info-row">
            <div className="info-item">
              <span className="info-label">Số buổi dạy</span>
              <span className="info-value">{t.sessions?.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Giá / 45 phút</span>
              <span className="info-value">{t.price?.toLocaleString()}đ</span>
            </div>
          </div>

          <div className="info-row">
            <div className="info-item">
              <span className="info-label">Khung giờ</span>
              <span className="info-value capitalize">{t.timeSlot === 'morning' ? 'Sáng' : t.timeSlot === 'afternoon' ? 'Chiều' : 'Tối'}</span>
            </div>
          </div>

          <div className="info-block">
            <h3>Khung giờ trống</h3>
            <div className="available-slots">
              {t.availableSlots && t.availableSlots.length > 0 ? (
                <div className="slots-grid">
                  {t.availableSlots.map((slot) => {
                    const [date, time] = slot.split('_');
                    const dateObj = new Date(date);
                    const dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][dateObj.getDay()];
                    const displayDate = `${dayName} ${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
                    return (
                      <div key={slot} className="slot-badge">
                        <div className="slot-date">{displayDate}</div>
                        <div className="slot-time">{time}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-slots">Hiện tại không có khung giờ trống</div>
              )}
            </div>
          </div>
        </div>

        <div className="tutor-modal-footer">
          <button className="btn btn-outline" onClick={() => dispatch({ type: 'SET_TUTOR_MODAL', payload: { open: false, tutor: null } })}>
            Đóng
          </button>
          <button className="btn btn-primary" onClick={() => {
            openBookingModal(t);
            dispatch({ type: 'SET_TUTOR_MODAL', payload: { open: false, tutor: null } });
          }}>
            Đặt lịch học
          </button>
        </div>
      </div>
    </div>
  );
}

