import { useApp } from '../../store/AppContext';
import { Navbar, Footer } from '../common';

function AdminOverview({ stats, revenueSeries, bookingStatus }) { return <div className="admin-stack"><div className="metrics-grid">{[['Tổng người dùng', stats.totalUsers], ['Gia sư hoạt động', stats.activeTutors], ['Đăng ký chờ duyệt', stats.pendingApplications], ['Doanh thu hôm nay', `${Number(stats.todayRevenue).toLocaleString()}đ`], ['Tổng bookings', stats.totalBookings], ['Gia sư online', stats.onlineTutors], ['Tỷ lệ duyệt', `${stats.approvalRate}%`], ['Rating TB', stats.avgRating]].map(([label, value]) => <div key={label} className="metric-card"><div className="muted">{label}</div><strong>{value}</strong></div>)}</div><div className="admin-grid-2"><div className="admin-card"><div className="section-title-small">Biểu đồ doanh thu 7 ngày</div><div className="bar-chart">{revenueSeries.map((item) => <div key={item.label} className="bar-item"><div className="bar-value" style={{ height: `${Math.max(item.value * 4, 10)}px` }}></div><span>{item.label}</span><small>{item.value}M</small></div>)}</div></div><div className="admin-card"><div className="section-title-small">Trạng thái bookings</div>{bookingStatus.map((item) => <div key={item.label} className="status-row"><span>{item.label}</span><strong>{item.value}%</strong></div>)}</div></div></div>; }
function AdminUsersTable({ users }) { return <div className="admin-card"><div className="admin-card-header"><h3>Học viên</h3><span>{users.length} tài khoản</span></div><div className="table-wrap"><table className="admin-table"><thead><tr><th>Email</th><th>Tên</th><th>Trạng thái</th></tr></thead><tbody>{users.map((u) => <tr key={u.email}><td>{u.email}</td><td>{u.name}</td><td><span className={`status-pill active`}>Hoạt động</span></td></tr>)}</tbody></table></div></div>; }
function AdminTutorsTable({ tutors }) { return <div className="admin-card"><div className="admin-card-header"><h3>Danh sách gia sư</h3><span>{tutors.length} hồ sơ</span></div><div className="admin-table-grid">{tutors.map((t) => <div key={t.id} className="admin-row-card"><div className="row-top"><div className="row-avatar" style={{ background: t.status === 'Online' ? '#EEF2FF' : '#F1F3F5' }}>{t.initials}</div><div><strong>{t.name}</strong><div className="muted">{t.subjects.join(' • ')}</div></div><span className={`status-pill ${t.status === 'Online' ? 'active' : 'blocked'}`}>{t.status}</span></div><div className="row-meta"><span>⭐ {t.rating}</span><span>{t.sessions} buổi</span><span>{t.price.toLocaleString()}đ/45p</span></div></div>)}</div></div>; }
function AdminApplicationsTable({ applications, onAccept, onDeny }) {
  const statusLabel = (s) => s === 'approved' ? 'Đã duyệt' : s === 'rejected' ? 'Từ chối' : 'Chờ duyệt';
  const statusStyle = (s) => ({
    padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: s === 'approved' ? '#d3f9d8' : s === 'rejected' ? '#ffe3e3' : '#fff3bf',
    color: s === 'approved' ? '#2f9e44' : s === 'rejected' ? '#c92a2a' : '#e67700',
  });
  return (
    <div className="admin-card">
      <div className="admin-card-header"><h3>Đăng ký gia sư</h3><span>{applications.length} hồ sơ</span></div>
      {applications.length === 0 && <div className="muted" style={{ padding: 16 }}>Chưa có đơn đăng ký nào.</div>}
      <div className="admin-table-grid">
        {applications.map((a) => (
          <div key={a.id} className="admin-row-card">
            <div className="row-top">
              <div>
                <strong>{a.name}</strong>
                <div className="muted">{a.email}</div>
              </div>
              <span style={statusStyle(a.status)}>{statusLabel(a.status)}</span>
            </div>
            <div className="row-meta">
              <span>{a.subjects?.join(' • ')}</span>
              <span>{Number(a.price).toLocaleString()}đ/45p</span>
              <span>{new Date(a.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            {a.status === 'pending' && (
              <div className="row-actions" style={{ marginTop: 10 }}>
                <button className="btn btn-primary btn-sm" onClick={() => onAccept(a.id)}>Duyệt</button>
                <button className="btn btn-danger btn-sm" onClick={() => onDeny(a.id)}>Từ chối</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
function AdminReportsPanel({ reports }) { if (!reports) return <div className="admin-card">Không có báo cáo</div>; return <div className="admin-card"><div className="admin-card-header"><h3>Báo cáo phân tích</h3><span>Dữ liệu tổng hợp</span></div><div className="report-kpis"><div><strong>{reports.stats.totalUsers}</strong><span>Người dùng</span></div><div><strong>{reports.stats.activeTutors}</strong><span>Gia sư hoạt động</span></div><div><strong>{reports.stats.pendingApplications}</strong><span>Đang chờ</span></div><div><strong>{reports.stats.approvalRate}%</strong><span>Tỷ lệ duyệt</span></div></div><div className="report-list"><h4>Phân tích nhanh</h4><ul><li>Tỷ lệ hoàn thành booking đang ổn định.</li><li>Doanh thu tăng ở cuối tuần.</li><li>Cần ưu tiên duyệt hồ sơ gia sư buổi tối.</li></ul></div></div>; }
function AdminActivityPanel({ activities }) { return <div className="admin-card"><div className="admin-card-header"><h3>Hoạt động gần đây</h3><span>{activities.length} sự kiện</span></div><div className="activity-list">{activities.map((a) => <div key={a.id} className="activity-item"><div className={`activity-dot ${a.type}`}></div><div><strong>{a.title}</strong><div className="muted">{a.detail}</div></div><span>{a.time}</span></div>)}</div></div>; }

const ISSUE_LABELS = { quality: 'Chất lượng buổi học', attendance: 'Điểm danh / vào lớp', payment: 'Thanh toán / hoàn tiền', behavior: 'Hành vi / thái độ', other: 'Khác' };
function AdminComplaintsPanel({ reports, onResolve, onDismiss }) {
  const statusStyle = (s) => ({ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s === 'resolved' ? '#d3f9d8' : s === 'dismissed' ? '#f1f3f5' : '#fff3bf', color: s === 'resolved' ? '#2f9e44' : s === 'dismissed' ? '#868e96' : '#e67700' });
  const statusLabel = (s) => s === 'resolved' ? 'Đã xử lý' : s === 'dismissed' ? 'Bỏ qua' : 'Chờ xử lý';
  return (
    <div className="admin-card">
      <div className="admin-card-header"><h3>Khiếu nại học viên</h3><span>{reports.length} ticket</span></div>
      {reports.length === 0 && <div className="muted" style={{ padding: 16 }}>Chưa có khiếu nại nào.</div>}
      <div className="admin-table-grid">
        {reports.map((r) => (
          <div key={r.id} className="admin-row-card">
            <div className="row-top">
              <div><strong>{r.tutorName}</strong><div className="muted">Học viên: {r.studentName}</div></div>
              <span style={statusStyle(r.status)}>{statusLabel(r.status)}</span>
            </div>
            <div className="row-meta">
              <span>{ISSUE_LABELS[r.issue] || r.issue}</span>
              <span>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            {r.detail && <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>{r.detail}</div>}
            {r.status === 'pending' && (
              <div className="row-actions" style={{ marginTop: 10 }}>
                <button className="btn btn-primary btn-sm" onClick={() => onResolve(r.id)}>Đã xử lý</button>
                <button className="btn btn-outline btn-sm" onClick={() => onDismiss(r.id)}>Bỏ qua</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const REVENUE_SERIES = [
  { label: 'T2', value: 3.2 }, { label: 'T3', value: 4.1 }, { label: 'T4', value: 2.8 },
  { label: 'T5', value: 5.3 }, { label: 'T6', value: 4.7 }, { label: 'T7', value: 6.1 }, { label: 'CN', value: 4.3 },
];
const BOOKING_STATUS = [{ label: 'Hoàn thành', value: 68 }, { label: 'Đã xác nhận', value: 24 }, { label: 'Đã hủy', value: 8 }];
const ACTIVITIES = [
  { id: 1, type: 'booking', title: 'Booking mới', detail: 'Học viên Demo đặt lịch với Nguyễn Minh Anh', time: '5 phút trước' },
  { id: 2, type: 'application', title: 'Đơn đăng ký mới', detail: 'Có đơn đăng ký gia sư mới chờ duyệt', time: '1 giờ trước' },
  { id: 3, type: 'review', title: 'Đánh giá mới', detail: 'Học viên đánh giá 5 sao cho Trần Hải Đăng', time: '2 giờ trước' },
  { id: 4, type: 'booking', title: 'Hủy booking', detail: 'Học viên hủy lịch học với Lê Thu Hà', time: '3 giờ trước' },
];

export function AdminPanel() {
  const { state, dispatch, showToast } = useApp();
  const admin = state.admin;
  const applications = state.applications;
  const tutors = state.tutors;
  const users = state.authUsers.filter((u) => u.role === 'student').map((u) => ({ ...u, status: 'active' }));

  const onAccept = (id) => { dispatch({ type: 'UPDATE_APPLICATION_STATUS', payload: { id, status: 'approved' } }); showToast('Đã duyệt đơn đăng ký', 'success'); };
  const onDeny = (id) => { dispatch({ type: 'UPDATE_APPLICATION_STATUS', payload: { id, status: 'rejected' } }); showToast('Đã từ chối đơn đăng ký', 'success'); };
  const onResolve = (id) => { dispatch({ type: 'UPDATE_REPORT_STATUS', payload: { id, status: 'resolved' } }); showToast('Đã đánh dấu đã xử lý', 'success'); };
  const onDismiss = (id) => { dispatch({ type: 'UPDATE_REPORT_STATUS', payload: { id, status: 'dismissed' } }); showToast('Đã bỏ qua khiếu nại', 'success'); };

  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const stats = {
    totalUsers: users.length,
    activeTutors: tutors.filter((t) => t.status === 'Online').length,
    pendingApplications: pendingCount,
    todayRevenue: 4250000,
    totalBookings: state.bookings.length,
    onlineTutors: tutors.filter((t) => t.status === 'Online').length,
    approvalRate: applications.length > 0 ? Math.round((approvedCount / applications.length) * 100) : 0,
    avgRating: tutors.length > 0 ? (tutors.reduce((s, t) => s + t.rating, 0) / tutors.length).toFixed(1) : 0,
  };

  const q = admin.search.toLowerCase();
  const filteredUsers = q ? users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) : users;
  const filteredTutors = q ? tutors.filter((t) => t.name.toLowerCase().includes(q) || t.subjects.join(' ').toLowerCase().includes(q)) : tutors;
  const filteredApps = q ? applications.filter((a) => a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q)) : applications;
  const filteredReports = q ? state.reports.filter((r) => r.tutorName?.toLowerCase().includes(q) || r.studentName?.toLowerCase().includes(q)) : state.reports;

  const tabs = ['overview', 'students', 'tutors', 'applications', 'complaints', 'activity'];
  const TAB_LABELS = { overview: 'Tổng quan', students: 'Học viên', tutors: 'Gia sư', applications: 'Đăng ký', complaints: 'Khiếu nại', activity: 'Hoạt động' };
  return <><Navbar active="role-select" /><div className="admin-hero"><div><div className="admin-kicker">Hệ thống quản trị nội bộ</div><h1>Admin Panel</h1><p>Dashboard báo cáo trực quan, quản trị học viên, gia sư và đăng ký nội bộ.</p></div></div><div className="admin-shell"><aside className="admin-sidebar">{tabs.map((item) => <button key={item} className={`admin-tab ${admin.tab === item ? 'active' : ''}`} onClick={() => dispatch({ type: 'SET_ADMIN', payload: { tab: item } })}>{TAB_LABELS[item]}</button>)}<div className="admin-sidebar-card"><div className="admin-sidebar-title">Bộ lọc nhanh</div><input className="filter-input" placeholder="Tìm tên, email, môn học..." value={admin.search} onChange={(e) => dispatch({ type: 'SET_ADMIN', payload: { search: e.target.value } })} /><div className="admin-sidebar-help">Lọc bảng học viên, gia sư và đăng ký.</div></div></aside><main className="admin-main">{admin.tab === 'overview' ? <AdminOverview stats={stats} revenueSeries={REVENUE_SERIES} bookingStatus={BOOKING_STATUS} /> : null}{admin.tab === 'students' ? <AdminUsersTable users={filteredUsers} /> : null}{admin.tab === 'tutors' ? <AdminTutorsTable tutors={filteredTutors} /> : null}{admin.tab === 'applications' ? <AdminApplicationsTable applications={filteredApps} onAccept={onAccept} onDeny={onDeny} /> : null}{admin.tab === 'complaints' ? <AdminComplaintsPanel reports={filteredReports} onResolve={onResolve} onDismiss={onDismiss} /> : null}{admin.tab === 'activity' ? <AdminActivityPanel activities={ACTIVITIES} /> : null}</main></div><Footer /></>;
}
