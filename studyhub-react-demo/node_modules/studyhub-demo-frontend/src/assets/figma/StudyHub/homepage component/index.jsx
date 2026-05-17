import { useApp } from '../../store/AppContext';
import { Navbar, Footer } from '../common';

const SUBJECTS = [
  ['Toán học','📐'], ['Hóa học','🧪'], ['Tiếng Anh','🇬🇧'], ['Tiếng Nhật','🇯🇵'],
  ['Vật lý','⚡'], ['Sinh học','🌿'], ['Tiếng Trung','🇨🇳'], ['Lập trình Python','💻'],
];

const FEATURED_TUTORS = [
  { id:1, initials:'NMA', color:'#3B5BDB', name:'Nguyễn Minh Anh', rating:4.9, reviews:127, subjects:['Toán học','Vật lý'], price:150000 },
  { id:2, initials:'THĐ', color:'#7C3AED', name:'Trần Hải Đăng',   rating:5.0, reviews:93,  subjects:['Tiếng Anh','IELTS'], price:200000, purple:true },
  { id:3, initials:'LTH', color:'#E64980', name:'Lê Thu Hà',       rating:4.8, reviews:68,  subjects:['Hóa học','Sinh học'], price:120000 },
  { id:4, initials:'PQK', color:'#0C8599', name:'Phạm Quốc Khánh', rating:4.9, reviews:156, subjects:['Lập trình Python','Data Science'], price:250000, purple:true },
];

export function HomePage() {
  const { state, dispatch, navigate } = useApp();
  const { heroSearch } = state;

  const doSearch = () => {
    dispatch({ type: 'SET_FILTER', payload: { search: heroSearch } });
    navigate('tutors');
  };

  const filterSubject = (subject) => {
    dispatch({ type: 'SET_FILTER', payload: { subject } });
    navigate('tutors');
  };

  return (
    <>
      <Navbar active="home" />

      {/* Hero */}
      <div className="hero">
        <h1 className="hero-title">Học nhanh, đúng nhu cầu với StudyHub</h1>
        <p className="hero-subtitle">
          Kết nối với gia sư chất lượng qua các buổi học ngắn 30-45 phút.<br />
          Linh hoạt thời gian, minh bạch chi phí.
        </p>
        <div className="hero-search">
          <input className="hero-search-input" placeholder="Tìm kiếm môn học hoặc kỹ năng..."
            value={heroSearch} onChange={e => dispatch({ type: 'SET_HERO_SEARCH', payload: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && doSearch()} />
          <button className="hero-search-btn" onClick={doSearch}>🔍 Tìm kiếm</button>
        </div>
      </div>

      {/* Features */}
      <div className="features-row">
        <div className="feature-item"><div className="feature-icon">🕐</div><div className="feature-title">Linh hoạt thời gian</div><div className="feature-desc">Buổi học 30-45 phút, đặt lịch dễ dàng theo nhu cầu</div></div>
        <div className="feature-item"><div className="feature-icon">🛡️</div><div className="feature-title">Minh bạch chi phí</div><div className="feature-desc">Giá cố định, thanh toán an toàn qua nền tảng</div></div>
        <div className="feature-item"><div className="feature-icon">⭐</div><div className="feature-title">Gia sư chất lượng</div><div className="feature-desc">Được đánh giá và xác thực bởi cộng đồng</div></div>
      </div>

      {/* Subjects */}
      <div className="section section-gray">
        <h2 className="section-title">Môn học phổ biến</h2>
        <p className="section-subtitle">Khám phá các môn học được yêu thích nhất</p>
        <div className="subjects-grid">
          {SUBJECTS.map(([name, icon]) => (
            <div key={name} className="subject-card" onClick={() => filterSubject(name)}>
              <div className="subject-icon">{icon}</div>
              <div className="subject-name">{name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Tutors */}
      <div className="section">
        <div className="tutors-header">
          <div className="tutors-header-left">
            <h2>Gia sư nổi bật</h2>
            <p>Các gia sư được đánh giá cao nhất</p>
          </div>
          <span className="see-all-link" onClick={() => navigate('tutors')}>Xem tất cả →</span>
        </div>
        <div className="tutors-grid">
          {FEATURED_TUTORS.map(t => (
            <div key={t.id} className="tutor-card" onClick={() => navigate('tutors')}>
              <div className="tutor-avatar" style={{ background: t.color }}>{t.initials}</div>
              <div className="tutor-name">{t.name}</div>
              <div className="tutor-rating">⭐ {t.rating} <span>({t.reviews})</span></div>
              <div className="tutor-tags">
                {t.subjects.map(s => <span key={s} className={`tag ${t.purple ? 'tag-purple' : ''}`}>{s}</span>)}
              </div>
              <div className="tutor-price" style={t.purple ? { color: 'var(--purple)' } : {}}>
                {t.price.toLocaleString()}đ/45 phút
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-title">Bạn là gia sư? Chia sẻ kiến thức, tạo thu nhập</div>
        <div className="cta-subtitle">Tận dụng thời gian rảnh, kết nối với học viên trên toàn quốc</div>
        <button className="btn btn-white btn-lg" onClick={() => navigate('become-tutor')}>Đăng ký ngay</button>
      </div>

      <Footer />
    </>
  );
}
