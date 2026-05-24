import { useApp } from '../../store/AppContext';
import { Navbar, Footer } from '../common';

function AdminOverview({ stats, revenueSeries, bookingStatus }) { return <div className="admin-stack"><div className="metrics-grid">{[['Tổng người dùng', stats.totalUsers], ['Gia sư hoạt động', stats.activeTutors], ['Đăng ký chờ duyệt', stats.pendingApplications], ['Doanh thu hôm nay', `${Number(stats.todayRevenue).toLocaleString()}đ`], ['Tổng bookings', stats.totalBookings], ['Gia sư online', stats.onlineTutors], ['Tỷ lệ duyệt', `${stats.approvalRate}%`], ['Rating TB', stats.avgRating]].map(([label, value]) => <div key={label} className="metric-card"><div className="muted">{label}</div><strong>{value}</strong></div>)}</div><div className="admin-grid-2"><div className="admin-card"><div className="section-title-small">Biểu đồ doanh thu 7 ngày</div><div className="bar-chart">{revenueSeries.map((item) => <div key={item.label} className="bar-item"><div className="bar-value" style={{ height: `${Math.max(item.value * 4, 10)}px` }}></div><span>{item.label}</span><small>{item.value}M</small></div>)}</div></div><div className="admin-card"><div className="section-title-small">Trạng thái bookings</div>{bookingStatus.map((item) => <div key={item.label} className="status-row"><span>{item.label}</span><strong>{item.value}%</strong></div>)}</div></div></div>; }
function AdminUsersTable({ users }) { return <div className="admin-card"><div className="admin-card-header"><h3>Người dùng nội bộ</h3><span>{users.length} bản ghi</span></div><div className="table-wrap"><table className="admin-table"><thead><tr><th>Email</th><th>Tên</th><th>Vai trò</th><th>Trạng thái</th></tr></thead><tbody>{users.map((u) => <tr key={u.email}><td>{u.email}</td><td>{u.name}</td><td><span className={`role-pill ${u.role}`}>{u.role}</span></td><td><span className={`status-pill ${u.status}`}>{u.status}</span></td></tr>)}</tbody></table></div></div>; }
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

export function AdminPanel() {
  const { state, dispatch, showToast } = useApp();
  const admin = state.admin;
  const applications = state.applications;
  const onAccept = (id) => { dispatch({ type: 'UPDATE_APPLICATION_STATUS', payload: { id, status: 'approved' } }); showToast('Đã duyệt đơn đăng ký', 'success'); };
  const onDeny = (id) => { dispatch({ type: 'UPDATE_APPLICATION_STATUS', payload: { id, status: 'rejected' } }); showToast('Đã từ chối đơn đăng ký', 'success'); };
  const stats = admin.overview.stats || { totalUsers: 0, activeTutors: 0, pendingApplications: 0, todayRevenue: 0, totalBookings: 0, onlineTutors: 0, approvalRate: 0, avgRating: 0 };
  const tabs = ['overview', 'users', 'tutors', 'applications', 'reports', 'activity'];
  return <><Navbar active="role-select" /><div className="admin-hero"><div><div className="admin-kicker">Hệ thống quản trị nội bộ</div><h1>Admin Panel</h1><p>Dashboard báo cáo trực quan, quản trị người dùng, gia sư và đăng ký nội bộ.</p></div><div className="admin-hero-actions"><button className="btn btn-outline" onClick={() => dispatch({ type: 'SET_ADMIN', payload: { loading: true } })}>Làm mới dữ liệu</button><button className="btn btn-primary" onClick={() => alert('Đã xuất báo cáo demo')}>Xuất báo cáo</button></div></div><div className="admin-shell"><aside className="admin-sidebar">{tabs.map((item) => <button key={item} className={`admin-tab ${admin.tab === item ? 'active' : ''}`} onClick={() => dispatch({ type: 'SET_ADMIN', payload: { tab: item } })}>{item === 'overview' ? 'Tổng quan' : item === 'users' ? 'Người dùng' : item === 'tutors' ? 'Gia sư' : item === 'applications' ? 'Đăng ký' : item === 'reports' ? 'Báo cáo' : 'Hoạt động'}</button>)}<div className="admin-sidebar-card"><div className="admin-sidebar-title">Bộ lọc nhanh</div><input className="filter-input" placeholder="Tìm tên, email, môn học..." value={admin.search} onChange={(e) => dispatch({ type: 'SET_ADMIN', payload: { search: e.target.value } })} /><div className="admin-sidebar-help">Dùng để lọc bảng người dùng, gia sư và đăng ký.</div></div></aside><main className="admin-main">{admin.loading ? <div className="admin-card"><div className="muted">Đang tải dashboard quản trị...</div></div> : null}{admin.error ? <div className="admin-card error-box">{admin.error}</div> : null}{admin.tab === 'overview' ? <AdminOverview stats={stats} revenueSeries={admin.overview.revenueSeries || []} bookingStatus={admin.overview.bookingStatus || []} /> : null}{admin.tab === 'users' ? <AdminUsersTable users={admin.users} /> : null}{admin.tab === 'tutors' ? <AdminTutorsTable tutors={admin.tutors} /> : null}{admin.tab === 'applications' ? <AdminApplicationsTable applications={applications} onAccept={onAccept} onDeny={onDeny} /> : null}{admin.tab === 'reports' ? <AdminReportsPanel reports={admin.reports} /> : null}{admin.tab === 'activity' ? <AdminActivityPanel activities={admin.overview.activities || []} /> : null}</main></div><Footer /></>;
}
