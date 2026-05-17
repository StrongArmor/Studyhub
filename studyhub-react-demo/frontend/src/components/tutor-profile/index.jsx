import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Navbar, Footer } from '../common';
import './profile.css';

export function TutorProfilePage() {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(state.tutorProfile?.bio || '');

  const profile = state.tutorProfile;
  const user = state.currentUser;
  const selectedSlots = profile?.selectedSlots || [];


  const handleAddCertificate = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch({
        type: 'ADD_CERTIFICATE',
        payload: {
          id: Date.now(),
          name: file.name,
          url: '#',
          uploadedAt: new Date().toLocaleDateString('vi-VN')
        }
      });
      e.target.value = '';
    }
  };

  const handleAddDocument = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch({
        type: 'ADD_DOCUMENT',
        payload: {
          id: Date.now(),
          name: file.name,
          url: '#',
          uploadedAt: new Date().toLocaleDateString('vi-VN')
        }
      });
      e.target.value = '';
    }
  };

  const handleSaveBio = () => {
    dispatch({
      type: 'SET_TUTOR_PROFILE',
      payload: { bio: editBio }
    });
    setIsEditing(false);
  };

  const generateCalendarSlots = () => {
    const today = new Date();
    const slots = [];
    const timeSlots = [
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00',
      '18:00', '19:00', '20:00', '21:00'
    ];

    // Generate 30 days of slots
    for (let day = 0; day < 30; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);

      timeSlots.forEach((time, idx) => {
        const dateStr = date.toISOString().split('T')[0];
        const slotId = `${dateStr}_${time}`;
        const isBooked = profile.scheduleSlots?.some(s => s.id === slotId);

        slots.push({
          id: slotId,
          date: dateStr,
          time: time,
          display: `${date.getDate()}/${date.getMonth() + 1}`,
          dayName: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()],
          isBooked: isBooked,
          isPast: date < today
        });
      });
    }
    return slots;
  };

  const allSlots = generateCalendarSlots();
  const futureSlots = allSlots.filter(s => !s.isPast && !s.isBooked);

  // Group slots by date
  const slotsByDate = {};
  futureSlots.forEach(slot => {
    if (!slotsByDate[slot.date]) {
      slotsByDate[slot.date] = [];
    }
    slotsByDate[slot.date].push(slot);
  });

  const handleSlotClick = (slot) => {
    const exists = selectedSlots.some(s => s.id === slot.id);
    let newSlots;
    if (exists) {
      newSlots = selectedSlots.filter(s => s.id !== slot.id);
    } else {
      newSlots = [...selectedSlots, { id: slot.id, time: slot.time, date: slot.date, display: slot.display, dayName: slot.dayName }];
    }
    dispatch({ type: 'SET_SELECTED_SLOTS', payload: newSlots });
  };

    const handleRemoveSlot = (id) => {
        dispatch({ type: 'REMOVE_SCHEDULE_SLOT', payload: id });
    };

    const handleConfirmSlots = () => {
        if (selectedSlots.length === 0) return;
        dispatch({
            type: 'SET_SCHEDULE_SLOTS_BULK',
            payload: selectedSlots.map(slot => ({
                id: slot.id,
                time: slot.time,
                date: slot.date,
                display: slot.display,
                dayName: slot.dayName,
            })),
        });
    };

  // Mock virtual students lesson requests
  const virtualStudents = [
    { id: 1, name: 'Nguyễn Văn A', subject: 'Toán học', requestedTime: '2026-05-20 19:00', avatar: 'NVA', color: '#3B5BDB' },
    { id: 2, name: 'Lê Thị B', subject: 'Vật lý', requestedTime: '2026-05-21 20:00', avatar: 'LTB', color: '#7C3AED' }
  ];

  return (
    <>
      <Navbar active="tutor-profile" />
      <div className="tutor-profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-cover" style={{ background: 'linear-gradient(135deg, #3B5BDB, #7C3AED)' }}>
            <div className="cover-overlay"></div>
          </div>

          <div className="profile-top">
            <div className="profile-avatar-section">
              <div className="profile-avatar" style={{ background: '#3B5BDB', color: '#fff' }}>
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'GS'}
              </div>
              <div className="profile-identity">
                <h1 className="profile-name">{user?.name || 'Gia sư Demo'}</h1>
                <div className="profile-rating">⭐ {profile?.rating || 4.9}</div>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-value">{profile?.totalHours || 856}</div>
                <div className="stat-label">Giờ dạy</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{profile?.totalStudents || 127}</div>
                <div className="stat-label">Học viên</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{profile?.rating || 4.9}</div>
                <div className="stat-label">Đánh giá</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          {/* Bio Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Giới thiệu bản thân</h2>
              {!isEditing && (
                <button className="btn btn-sm btn-outline" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="edit-bio-form">
                <textarea
                  className="textarea-field"
                  rows="5"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Mô tả về bạn..."
                />
                <div className="form-actions">
                  <button className="btn btn-primary btn-sm" onClick={handleSaveBio}>
                    Lưu
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(false)}>
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <p className="bio-text">{editBio || profile?.bio || 'Chưa có thông tin'}</p>
            )}
          </div>

          {/* Skills Section */}
          <div className="profile-section">
            <h2>Kỹ năng</h2>
            <div className="skills-list">
              {profile?.skills?.map((skill, idx) => (
                <span key={idx} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          {/* Certificates Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Bằng cấp & Chứng chỉ</h2>
              <label className="btn btn-sm btn-primary">
                📤 Upload bằng cấp
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleAddCertificate}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {profile?.certificates && profile.certificates.length > 0 ? (
              <div className="certificate-list">
                {profile.certificates.map((cert) => (
                  <div key={cert.id} className="certificate-item">
                    <div className="cert-icon">📄</div>
                    <div className="cert-info">
                      <div className="cert-name">{cert.name}</div>
                      <div className="cert-date">{cert.uploadedAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-placeholder">Chưa upload bằng cấp nào</div>
             )}
             </div>

            {/* Virtual Students Section */}
            <div className="profile-section">
              <div className="section-header">
                <h2>Yêu cầu từ học viên</h2>
              </div>
              <div className="virtual-students-list">
                {virtualStudents.map((student) => (
                  <div key={student.id} className="student-request-card">
                    <div className="student-info">
                      <div className="student-avatar" style={{ background: student.color }}>
                        {student.avatar}
                      </div>
                      <div className="student-details">
                        <div className="student-name">{student.name}</div>
                        <div className="student-subject">{student.subject}</div>
                        <div className="student-time">🕐 {student.requestedTime}</div>
                      </div>
                    </div>
                    <div className="student-actions">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          alert(`Đã xác nhận bài học với ${student.name}!`);
                        }}
                      >
                        Xác nhận
                      </button>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          const newCount = (profile?.declineCount || 0) + 1;
                          dispatch({ type: 'SET_DECLINE_COUNT', payload: newCount });
                          if (newCount === 3) {
                            alert('⚠️ Bạn đã từ chối 3 lần. Vui lòng điều chỉnh lại khung giờ dạy phù hợp để đảm bảo chất lượng hệ thống.');
                          }
                        }}
                      >
                        Từ chối dạy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
             </div>

            {/* Schedule Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Lịch dạy học</h2>
            </div>
            <div className="schedule-info">
              <p>Chọn các khung giờ trống để các học viên có thể đặt lịch.</p>
            </div>

            <div className="selected-slots-container">
                          {profile.scheduleSlots && profile.scheduleSlots.length > 0 ? (
                              <div className="slot-tags">
                                  {profile.scheduleSlots.map((s) => {
                    const d = new Date(s.date);
                    const dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                    return (
                      <div key={s.id} className="slot-tag">
                        <span className="slot-text">{s.time} - {dateStr}</span>
                        <button className="slot-remove" onClick={() => handleRemoveSlot(s.id)} title="Xóa">✕</button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="slot-placeholder">Chưa có khung giờ nào được chọn...</div>
              )}
            </div>

            <div className="calendar-container">
              {Object.entries(slotsByDate).map(([date, slots]) => {
                const dateObj = new Date(date);
                const dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][dateObj.getDay()];
                const displayDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

                return (
                  <div key={date} className="calendar-day">
                    <div className="calendar-day-header">
                      <span className="day-name">{dayName}</span>
                      <span className="day-date">{displayDate}</span>
                    </div>
                    <div className="time-slots-grid">
                      {slots.map((slot) => {
                        const isSelected = selectedSlots.some(s => s.id === slot.id);
                        const isAlreadyBooked = profile.scheduleSlots?.some(s => s.id === slot.id);
                        return (
                          <button
                            key={slot.id}
                            className={`time-slot ${isSelected ? 'selected' : ''} ${isAlreadyBooked ? 'booked' : ''}`}
                            onClick={() => !isAlreadyBooked && handleSlotClick(slot)}
                            disabled={isAlreadyBooked}
                            title={`${slot.time} - ${slot.display}`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedSlots.length > 0 && (
              <div className="schedule-confirm">
                <p>Bạn đã chọn {selectedSlots.length} ca học</p>
                <button className="btn btn-primary" onClick={handleConfirmSlots}>
                  ✓ Xác nhận ({selectedSlots.length} ca)
                </button>
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Tài liệu dạy học</h2>
              <label className="btn btn-sm btn-primary">
                📤 Upload tài liệu
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                  onChange={handleAddDocument}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {profile?.documents && profile.documents.length > 0 ? (
              <div className="document-list">
                {profile.documents.map((doc) => (
                  <div key={doc.id} className="document-item">
                    <div className="doc-icon">📎</div>
                    <div className="doc-info">
                      <div className="doc-name">{doc.name}</div>
                      <div className="doc-date">{doc.uploadedAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-placeholder">Chưa upload tài liệu nào</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
