import { useApp } from '../../store/AppContext';
import { Navbar, Footer } from '../common';
import { useBooking } from '../../hooks';

const STAGES = {
  detail: { title: 'Chi tiết ca - Chưa tới giờ', icon: '🕒', status: 'Chưa tới giờ', desc: 'Demo theo luồng BOOKING của Figma.' },
  enter: { title: 'Chi tiết ca - Vào phòng học', icon: '▶️', status: 'Sẵn sàng', desc: 'Bạn có thể vào phòng học khi tới giờ.' },
  live: { title: 'Phòng học trực tuyến', icon: '🎥', status: 'Đang học', desc: 'Đang kết nối lớp học trực tuyến.' },
  ended: { title: 'Hết giờ - Đóng phòng', icon: '✅', status: 'Đã kết thúc', desc: 'Buổi học đã hoàn tất.' },
  confirm: { title: 'Xác nhận hoàn thành', icon: '📝', status: 'Chờ xác nhận', desc: 'Xác nhận kết quả buổi học.' },
  'no-show': { title: 'Sự cố - Vắng mặt sau 10 phút', icon: '⚠️', status: 'Sự cố', desc: 'Mô phỏng trường hợp học viên không vào lớp.' },
  fallback: { title: 'Lỗi API video - Meet dự phòng', icon: '🔁', status: 'Meet dự phòng', desc: 'Sử dụng link Google Meet dự phòng.' }
};

export function BookingFlowPage() {
  const { state, dispatch } = useApp();
  const { openBookingModal, openReviewModal } = useBooking();
  const stage = STAGES[state.bookingStage] || STAGES.detail;

  const nextStage = () => {
    const order = ['detail', 'enter', 'live', 'ended', 'confirm', 'no-show', 'fallback'];
    const idx = order.indexOf(state.bookingStage);
    dispatch({ type: 'SET_BOOKING_STAGE', payload: order[(idx + 1) % order.length] });
  };

  const handleOpenMeet = () => {
    const popup = window.open(state.session.room, '_blank');
    if (popup) {
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          dispatch({ type: 'SET_BOOKING_STAGE', payload: 'ended' });
          openReviewModal(state.session.tutor);
        }
      }, 1000);
    } else {
      window.open(state.session.room, '_blank', 'noopener,noreferrer');
    }
  };

  return <><Navbar active="role-select" /><div className="page-container"><div className="page-header"><h1>Online Learn</h1><p>{stage.title}</p></div><div className="learn-layout"><div className="learn-panel"><div className="status-banner">{stage.status}</div><h2>{state.session.subject}</h2><div className="muted">Gia sư: {state.session.tutor}</div><div className="muted">Học viên: {state.session.student}</div><div className="muted">{state.session.time}</div><div className="booking-card" style={{ marginTop: 16 }}><strong>Link phòng học</strong><div className="muted">{state.session.room}</div></div><div className="row-actions" style={{ marginTop: 16 }}><button className="btn btn-primary" onClick={nextStage}>{state.bookingStage === 'detail' ? 'Vào phòng học' : 'Tiếp theo'}</button><button className="btn btn-outline" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'dashboard' })}>Về dashboard</button></div></div><div className="lesson-stage"><div className="lesson-header"><strong>{stage.title}</strong><span className="status-pill pending">{stage.status}</span></div><div className="lesson-visual">{stage.icon}</div><div className="muted">{stage.desc}</div><div className="row-actions"><button className="btn btn-primary" onClick={nextStage}>Tiếp theo</button><button className="btn btn-outline" onClick={handleOpenMeet}>Mở Meet</button></div></div></div></div><Footer /></>;
}

export function BookingStepCard() { return null; }
