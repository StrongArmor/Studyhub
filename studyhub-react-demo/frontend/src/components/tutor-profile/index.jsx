import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Navbar, Footer } from '../common';
import './profile.css';

export function TutorProfilePage() {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(state.tutorProfile?.bio || '');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const profile = state.tutorProfile;
  const user = state.currentUser;

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

  const handleSlotClick = (slotId) => {
    if (selectedSlot === slotId) {
      // Click on selected slot to deselect/remove
      setSelectedSlot(null);
    } else {
      // Select a new slot
      setSelectedSlot(slotId);
    }
  };

  const handleConfirmSlot = () => {
    if (selectedSlot) {
      dispatch({
        type: 'SET_SCHEDULE_SLOT',
        payload: { id: selectedSlot }
      });
      setSelectedSlot(null);
      alert('Đã đặt 1 ca học!');
    }
  };

  // Get the selected slot object for display
  const selectedSlotObj = selectedSlot ? allSlots.find(s => s.id === selectedSlot) : null;

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

          {/* Schedule Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Lịch dạy học</h2>
            </div>
            <div className="schedule-info">
              <p>Chọn các khung giờ trống để các học viên có thể đặt lịch. Bạn có thể chọn từ 1-2 ca trên một lần.</p>
            </div>

            <div className="schedule-stats">
              <div className="stat-box">
                <span className="stat-label">Chưa chọn:</span>
                <span className="stat-count">{futureSlots.length}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Đã đặt:</span>
                <span className="stat-count">{profile?.scheduleSlots?.length || 0}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Chọn hiện tại:</span>
                <span className="stat-count selected">{selectedSlot ? 1 : 0}/1</span>
              </div>
            </div>

            {selectedSlot && selectedSlotObj && (
              <div className="selected-slot-display">
                <div className="selected-slot-badge">
                  <div className="slot-day-name">{selectedSlotObj.dayName}</div>
                  <div className="slot-time-large">{selectedSlotObj.time}</div>
                  <div className="slot-date-label">{selectedSlotObj.dayName} {selectedSlotObj.display}</div>
                </div>
                <button 
                  className="btn-remove-slot"
                  onClick={() => setSelectedSlot(null)}
                  title="Click để hủy chọn"
                >
                  ✕
                </button>
              </div>
            )}

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
                        const isSelected = selectedSlot === slot.id;
                        const isAlreadyBooked = profile.scheduleSlots?.some(s => s.id === slot.id);
                        return (
                          <button
                            key={slot.id}
                            className={`time-slot ${isSelected ? 'selected' : ''} ${isAlreadyBooked ? 'booked' : ''}`}
                            onClick={() => !isAlreadyBooked && handleSlotClick(slot.id)}
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

            {selectedSlot && (
              <div className="schedule-confirm">
                <p>Bạn đã chọn 1 ca học</p>
                <button className="btn btn-primary" onClick={handleConfirmSlot}>
                  ✓ Xác nhận (1 ca)
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
