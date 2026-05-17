import { AppProvider, useApp } from './store/AppContext';
import { Toast, EmailModal, BookingModal, ReviewModal, ReportModal, TutorModal } from './components/common';
import { HomePage } from './components/home';
import { RoleSelectPage, LoginPage, RegisterPage, OTPPage } from './components/auth';
import { TutorListPage } from './components/tutors';
import { TutorProfilePage } from './components/tutor-profile';
import { StudentDashboard } from './components/dashboard';
import { WalletPage, WithdrawPage } from './components/wallet';
import { AdminPanel } from './components/admin';
import { BookingFlowPage } from './components/booking';

function Router() {
  const { state, navigate } = useApp();
  const requireAuth = (node) => (state.currentUser ? node : <div className="page-container"><h1>Bạn cần đăng nhập</h1><p>Vui lòng đăng nhập để truy cập trang này.</p><button className="btn btn-primary" onClick={() => navigate('role-select')}>Đăng nhập ngay</button></div>);
  switch (state.page) {
    case 'home': return <HomePage />;
    case 'role-select': return <RoleSelectPage />;
    case 'login-student': return <LoginPage role="student" />;
    case 'login-tutor': return <LoginPage role="tutor" />;
    case 'login-admin': return <LoginPage role="admin" />;
    case 'register': return <RegisterPage />;
    case 'otp': return <OTPPage />;
     case 'tutors': return <TutorListPage />;
    case 'tutor-profile': return requireAuth(<TutorProfilePage />);
    case 'dashboard': return requireAuth(<StudentDashboard />);
    case 'wallet': return requireAuth(<WalletPage />);
    case 'withdraw': return requireAuth(<WithdrawPage />);
    case 'admin': return requireAuth(<AdminPanel />);
    case 'become-tutor': return <div className="page-container"><h1>Be a Tutor</h1></div>;
    case 'booking-center':
    case 'online-learn': return requireAuth(<BookingFlowPage />);
    default: return <HomePage />;
  }
}

export default function App() {
  return <AppProvider><div className="app-shell"><Toast /><EmailModal /><BookingModal /><ReviewModal /><ReportModal /><TutorModal /><Router /></div></AppProvider>;
}

