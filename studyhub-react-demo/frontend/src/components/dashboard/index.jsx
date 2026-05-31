import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Navbar, Footer } from '../common';
import { useBooking, useProfile } from '../../hooks';

function BookingCard({ tutorName, subject, date, time, duration, price, status, initials, color, action }) { return <div className="booking-card"><div className="booking-top"><div className="booking-tutor"><div className="booking-avatar" style={{ background: color }}>{initials}</div><div><div className="booking-info"><h3>{tutorName}</h3></div><div className="booking-subject">{subject}</div><div className="booking-meta"><span className="booking-meta-item">📅 {date}</span><span className="booking-meta-item">🕐 {time} ({duration} phút)</span><span className="booking-price">{price.toLocaleString()}đ</span></div></div></div><span className={`status-badge ${status === 'Đã xác nhận' ? 'status-confirmed' : 'status-completed'}`}>{status}</span></div><div className="booking-actions">{action}</div></div>; }

export function StudentDashboard() {
  const { state, navigate } = useApp();
  const { cancelBooking, openReviewModal, openReportModal, openBookingModal } = useBooking();
  const { updateName } = useProfile();
  const { wallet, bookings, tutors, applications, currentUser } = state;
  const myApplications = applications.filter((a) => a.email === currentUser?.email);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const upcoming = bookings.filter((b) => b.status === 'confirmed');
  const completed = bookings.filter((b) => b.status === 'completed');
  const { dispatch } = useApp();

  const handleSaveName = async () => {
    await updateName(nameInput);
    setEditingName(false);
  };
  const joinClass = (b) => {
    dispatch({ type: 'SET_BOOKING_STAGE', payload: 'detail' });
    dispatch({ type: 'SET_SESSION', payload: { id: b.id, tutor: b.tutorName, student: currentUser?.name || 'Học viên', subject: b.subject, room: b.meetLink || 'https://meet.google.com/vvk-fuco-zpo', time: `${b.date} · ${b.time} (${b.duration} phút)` } });
    navigate('booking-center');
  };
  const rebook = (b) => {
    const tutor = tutors.find((t) => t.name === b.tutorName);
    if (tutor) openBookingModal(tutor);
    else navigate('tutors');
  };

  return <><Navbar active="role-select" /><div className="dashboard-container"><div className="dashboard-header"><h1>Lịch học của tôi</h1><p>Quản lý các buổi học và đánh giá gia sư</p></div><div className="tabs"><div className={`tab-item ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>Sắp diễn ra ({upcoming.length})</div><div className={`tab-item ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>Đã hoàn thành ({completed.length})</div></div>{activeTab === 'upcoming' && <div id="tab-upcoming">{upcoming.length === 0 ? <div className="empty-state"><div className="empty-icon">📅</div><div className="empty-title">Chưa có buổi học nào</div><div className="empty-desc">Hãy tìm gia sư và đặt lịch học đầu tiên!</div></div> : upcoming.map((b) => <BookingCard key={b.id} tutorName={b.tutorName} subject={b.subject} date={b.date} time={b.time} duration={b.duration} price={b.price} status="Đã xác nhận" initials={b.tutorInitials} color={b.tutorColor} action={<><button className="btn btn-primary btn-sm" onClick={() => joinClass(b)}>Tham gia buổi học</button><button className="btn btn-outline btn-sm" onClick={() => cancelBooking(b.id)}>Hủy buổi học</button></>} />)}</div>}{activeTab === 'completed' && <div id="tab-completed">{completed.length === 0 ? <div className="empty-state"><div className="empty-icon">✅</div><div className="empty-title">Chưa có buổi học nào hoàn thành</div></div> : completed.map((b) => <BookingCard key={b.id} tutorName={b.tutorName} subject={b.subject} date={b.date} time={b.time} duration={b.duration} price={b.price} status="Đã hoàn thành" initials={b.tutorInitials} color={b.tutorColor} action={<><button className="btn btn-primary btn-sm" onClick={() => openReviewModal(b.tutorName, b.id)}>Đánh giá</button><button className="btn btn-outline btn-sm" onClick={() => rebook(b)}>Đặt lại</button><button className="btn btn-danger btn-sm" onClick={() => openReportModal(b)}>Báo cáo</button></>} />)}</div>}
        {myApplications.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div className="tabs">
              <div className="tab-item active">Đơn đăng ký gia sư ({myApplications.length})</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              {myApplications.map((a) => (
                <div key={a.id} className="booking-card">
                  <div className="booking-top">
                    <div className="booking-tutor">
                      <div className="booking-avatar" style={{ background: '#3B5BDB' }}>📝</div>
                      <div>
                        <div className="booking-info"><h3>Đơn đăng ký gia sư</h3></div>
                        <div className="booking-subject">{a.subjects?.join(', ')}</div>
                        <div className="booking-meta">
                          <span className="booking-meta-item">📅 {new Date(a.createdAt).toLocaleDateString('vi-VN')}</span>
                          <span className="booking-meta-item">💰 {Number(a.price).toLocaleString()}đ/buổi</span>
                        </div>
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: a.status === 'approved' ? '#d3f9d8' : a.status === 'rejected' ? '#ffe3e3' : '#fff3bf',
                      color: a.status === 'approved' ? '#2f9e44' : a.status === 'rejected' ? '#c92a2a' : '#e67700',
                    }}>
                      {a.status === 'approved' ? 'Đã duyệt' : a.status === 'rejected' ? 'Từ chối' : 'Chờ xét duyệt'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ marginTop: 32 }}>
          <div className="tabs"><div className="tab-item active">Thông tin cá nhân</div></div>
          <div className="booking-card" style={{ marginTop: 12 }}>
            <div className="booking-top">
              <div className="booking-tutor">
                <div className="booking-avatar" style={{ background: '#3B5BDB' }}>{currentUser?.avatar || '?'}</div>
                <div>
                  {editingName ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input className="input-field no-icon" style={{ margin: 0, width: 200 }} value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSaveName()} />
                      <button className="btn btn-primary btn-sm" onClick={handleSaveName}>Lưu</button>
                      <button className="btn btn-outline btn-sm" onClick={() => { setEditingName(false); setNameInput(currentUser?.name || ''); }}>Huỷ</button>
                    </div>
                  ) : (
                    <div className="booking-info"><h3>{currentUser?.name}</h3></div>
                  )}
                  <div className="booking-subject">{currentUser?.email}</div>
                </div>
              </div>
              {!editingName && <button className="btn btn-outline btn-sm" onClick={() => { setEditingName(true); setNameInput(currentUser?.name || ''); }}>Chỉnh sửa tên</button>}
            </div>
          </div>
        </div>
      </div><Footer /></>;
}
