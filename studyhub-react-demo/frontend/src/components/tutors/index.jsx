import { useApp } from '../../store/AppContext';
import { Navbar, Footer } from '../common';
import { useBooking, useTutors } from '../../hooks';

export function TutorListPage() {
  const { navigate, dispatch } = useApp();
  const { tutors, filter, setFilter, clearFilters, availableOnly, setAvailableOnly } = useTutors();
  const { openBookingModal } = useBooking();

  return (
    <>
      <Navbar active="tutors" />
      <div className="page-container">
        <div className="page-header">
          <h1>Tìm gia sư</h1>
          <p>Tìm thấy {tutors.length} gia sư phù hợp</p>
        </div>
        <div className="tutor-list-layout">
          <div className="filter-panel">
            <div className="filter-title">☰ Bộ lọc</div>
            <div className="filter-group">
              <label className="filter-label">Tìm kiếm</label>
              <input
                className="filter-input"
                type="text"
                placeholder="Tên hoặc môn học..."
                value={filter.search}
                onChange={(e) => setFilter({ search: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">Môn học</label>
              <select
                className="filter-select"
                value={filter.subject}
                onChange={(e) => setFilter({ subject: e.target.value })}
              >
                <option value="">Tất cả môn học</option>
                {[
                  'Toán học',
                  'Vật lý',
                  'Hóa học',
                  'Sinh học',
                  'Tiếng Anh',
                  'IELTS',
                  'Tiếng Nhật',
                  'Tiếng Trung',
                  'Lập trình Python',
                  'Data Science',
                  'Web Development',
                  'Lập trình Java',
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Mức giá (45 phút)</label>
              <select
                className="filter-select"
                value={filter.price}
                onChange={(e) => setFilter({ price: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="0-150000">Dưới 150.000đ</option>
                <option value="150000-200000">150.000 - 200.000đ</option>
                <option value="200000-999999">Trên 200.000đ</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Đánh giá tối thiểu</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="rating"
                    checked={filter.rating === '4.5'}
                    onChange={() => setFilter({ rating: '4.5' })}
                  />{' '}
                  ⭐ 4.5+
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="rating"
                    checked={filter.rating === '4.0'}
                    onChange={() => setFilter({ rating: '4.0' })}
                  />{' '}
                  ⭐ 4.0+
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="rating"
                    checked={filter.rating === '3.5'}
                    onChange={() => setFilter({ rating: '3.5' })}
                  />{' '}
                  ⭐ 3.5+
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="rating"
                    checked={filter.rating === ''}
                    onChange={() => setFilter({ rating: '' })}
                  />{' '}
                  Tất cả
                </label>
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">Khung giờ trống</label>
              <div className="toggle-row">
                <span className="toggle-label">Đang trống ngay bây giờ</span>
                <button
                  className={`toggle-switch ${availableOnly ? '' : 'off'}`}
                  onClick={() => setAvailableOnly(!availableOnly)}
                />
              </div>
              <label className="filter-label" style={{ marginTop: 8 }}>
                Khung giờ mong muốn
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="timeSlot"
                    checked={filter.timeSlot === ''}
                    onChange={() => setFilter({ timeSlot: '' })}
                  />{' '}
                  Bất kỳ
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="timeSlot"
                    checked={filter.timeSlot === 'morning'}
                    onChange={() => setFilter({ timeSlot: 'morning' })}
                  />{' '}
                  Sáng (6h - 12h)
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="timeSlot"
                    checked={filter.timeSlot === 'afternoon'}
                    onChange={() => setFilter({ timeSlot: 'afternoon' })}
                  />{' '}
                  Chiều (12h - 18h)
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="timeSlot"
                    checked={filter.timeSlot === 'evening'}
                    onChange={() => setFilter({ timeSlot: 'evening' })}
                  />{' '}
                  Tối (18h - 22h)
                </label>
              </div>
            </div>
            <span className="clear-filter" onClick={clearFilters}>
              Xóa bộ lọc
            </span>
          </div>
          <div>
            <div className="tutor-results">
              {tutors.length ? (
                tutors.map((t) => <TutorCard key={t.id} tutor={t} onBook={openBookingModal} onView={() => dispatch({ type: 'SET_TUTOR_MODAL', payload: { open: true, tutor: t } })} />)
              ) : (
                <EmptyState />
              )}
            </div>
            {!tutors.length ? <SuggestedSection onBook={openBookingModal} /> : null}
            {tutors.length > 0 && (
              <div className="pagination">
                <button className="btn page-btn page-btn-text" disabled>Trước</button>
                <button className="page-btn active">1</button>
                <button className="btn page-btn page-btn-text" disabled>Sau</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function TutorCard({ tutor, onBook, onView }) {
  return (
    <div className="tutor-result-card" onClick={() => onBook(tutor)}>
      <div className="tutor-result-top">
        <div
          className="tutor-result-avatar"
          style={{ background: `${tutor.color}20`, color: tutor.color }}
        >
          {tutor.initials}
        </div>
        <div className="tutor-result-info">
          <h3>{tutor.name}</h3>
          <div className="tutor-result-rating">
            ⭐ {tutor.rating} <span>({tutor.reviews})</span>
          </div>
        </div>
      </div>
      <div className="tutor-result-desc">{tutor.desc}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {tutor.subjects.map((s) => (
          <span key={s} className="tag">
            {s}
          </span>
        ))}
      </div>
      <div className="tutor-result-footer">
        <span className="tutor-sessions">{tutor.sessions.toLocaleString()} buổi học</span>
        <span className="tutor-result-price">{tutor.price.toLocaleString()}đ/45p</span>
      </div>
      <div className="row-actions" style={{ marginTop: 12 }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={(e) => { e.stopPropagation(); onView && onView(); }}
          style={{ marginRight: 8 }}
        >
          Chi tiết
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onBook(tutor);
          }}
        >
          Đặt lịch học
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">🔍</div>
      <div className="empty-title">Không tìm thấy kết quả phù hợp</div>
      <div className="empty-desc">
        Chúng tôi không tìm được gia sư nào thoả toàn bộ tiêu chí bạn chọn. Hãy thử bớt bộ lọc hoặc xem các gia sư có
        môn học tương tự ở bên dưới.
      </div>
    </div>
  );
}

function SuggestedSection({ onBook }) {
  const items = [
    { initials: 'NTM', avatar: '#3B5BDB', name: 'Nguyễn Thị Mai', subjects: 'Toán học • Vật lý', rating: '4.6', reviews: 87, price: 180000 },
    { initials: 'TVL', avatar: '#7C3AED', name: 'Trần Văn Long', subjects: 'Vật lý • Hóa học', rating: '4.4', reviews: 62, price: 160000 },
    { initials: 'LMA', avatar: '#E64980', name: 'Lê Minh Anh', subjects: 'Toán học • Lập trình', rating: '4.7', reviews: 124, price: 200000 },
  ];
  return (
    <div className="suggested-section">
      <div className="suggested-title">
        <span className="dot"></span> Gia sư có môn học tương tự
      </div>
      <div className="suggested-desc">
        Bạn có thể tham khảo các gia sư dạy môn cùng nhóm, mức giá gần với tiêu chí bạn đã chọn
      </div>
      <div className="suggested-cards">
        {items.map((s) => (
          <div className="suggested-card" key={s.name}>
            <div className="sug-top">
              <div className="sug-avatar" style={{ background: s.avatar }}>
                {s.initials}
              </div>
              <div>
                <div className="sug-name">{s.name}</div>
                <div className="sug-subjects">{s.subjects}</div>
              </div>
            </div>
            <div className="sug-rating">
              ⭐ {s.rating} <span>({s.reviews} đánh giá)</span>
            </div>
            <div className="sug-desc">
              Gia sư tận tâm, giàu kinh nghiệm luyện thi và ôn tập kiến thức cơ bản.
            </div>
            <div className="sug-footer">
              <span className="sug-available">● Còn lịch trống hôm nay</span>
              <span className="sug-price">{s.price.toLocaleString()}đ /45 phút</span>
            </div>
            <div className="row-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={() =>
                  onBook({
                    name: s.name,
                    initials: s.initials,
                    color: s.avatar,
                    subjects: s.subjects.split(' • '),
                    price: s.price,
                  })
                }
              >
                Đặt lịch học
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
