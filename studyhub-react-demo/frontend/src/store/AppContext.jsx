import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

const loadAuth = () => {
  try {
    const raw = localStorage.getItem('studyhub-auth');
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
};

const auth = loadAuth();

const initialState = {
  page: 'home',
  currentUser: auth.user,
  authToken: auth.token,
  authUsers: [
    { email: 'user@studyhub.vn', password: '12345678', role: 'user', name: 'Học viên Demo' },
    { email: 'tutor@studyhub.vn', password: '12345678', role: 'tutor', name: 'Gia sư Demo' },
    { email: 'admin@studyhub.vn', password: '12345678', role: 'admin', name: 'Admin Demo' }
  ],
  selectedRole: 'user',
  pendingUser: null,
  register: { name: '', email: '', pass: '', confirm: '', agree: false },
  login: {
    studentEmail: 'user@studyhub.vn', studentPass: '12345678',
    tutorEmail: 'tutor@studyhub.vn', tutorPass: '12345678',
    adminEmail: 'admin@studyhub.vn', adminPass: '12345678'
  },
  toast: { msg: '', type: '' },
  emailModal: { open: false, msg: '' },
  tutors: [
   { id: 0, name: 'Gia sư Demo', initials: 'GD', color: '#FF6B6B', rating: 4.9, reviews: 127, subjects: ['Toán học', 'Vật lý'], desc: 'Gia sư tận tâm với 8 năm kinh nghiệm. Chuyên ôn thi THPT Quốc gia và luyện thi học sinh giỏi.', sessions: 856, price: 150000, timeSlot: 'evening', status: 'Online', availableSlots: ['2026-05-08_19:00', '2026-05-08_20:00', '2026-05-09_19:00', '2026-05-10_20:00'], active: true },
   { id: 1, name: 'Nguyễn Minh Anh', initials: 'NMA', color: '#3B5BDB', rating: 4.9, reviews: 127, subjects: ['Toán học', 'Vật lý'], desc: 'Giáo viên Toán - Lý với 8 năm kinh nghiệm. Chuyên ôn thi THPT Quốc gia và luyện thi.', sessions: 856, price: 150000, timeSlot: 'evening', status: 'Online', availableSlots: ['2026-05-08_19:00', '2026-05-08_20:00', '2026-05-09_19:00', '2026-05-10_20:00'] },
   { id: 2, name: 'Trần Hải Đăng', initials: 'THĐ', color: '#7C3AED', rating: 5.0, reviews: 93, subjects: ['Tiếng Anh', 'IELTS'], desc: 'IELTS 8.5 - Chuyên luyện thi IELTS Speaking & Writing. Phương pháp học tập trung, hiệu quả.', sessions: 542, price: 200000, timeSlot: 'evening', status: 'Online', availableSlots: ['2026-05-08_20:00', '2026-05-09_20:00', '2026-05-10_20:00', '2026-05-11_19:00'] },
   { id: 3, name: 'Lê Thu Hà', initials: 'LTH', color: '#E64980', rating: 4.8, reviews: 68, subjects: ['Hóa học', 'Sinh học'], desc: 'Giảng viên Hóa - Sinh, chuyên ôn thi THPT và luyện thi Y Dược.', sessions: 423, price: 120000, timeSlot: 'morning', status: 'Offline', availableSlots: ['2026-05-08_09:00', '2026-05-09_10:00', '2026-05-10_09:00', '2026-05-11_10:00'] },
   { id: 4, name: 'Phạm Quốc Khánh', initials: 'PQK', color: '#0C8599', rating: 4.9, reviews: 156, subjects: ['Lập trình Python', 'Data Science'], desc: 'Senior Data Scientist. Dạy Python từ cơ bản đến nâng cao.', sessions: 672, price: 250000, timeSlot: 'evening', status: 'Online', availableSlots: ['2026-05-08_18:00', '2026-05-09_19:00', '2026-05-10_20:00', '2026-05-11_20:00'] },
   { id: 5, name: 'Hoàng Lan Anh', initials: 'HLA', color: '#F59F00', rating: 4.7, reviews: 45, subjects: ['Tiếng Trung', 'HSK'], desc: 'Tốt nghiệp Đại học Bắc Kinh. Chuyên luyện thi HSK và giao tiếp thực tế.', sessions: 234, price: 180000, timeSlot: 'morning', status: 'Offline', availableSlots: ['2026-05-08_08:00', '2026-05-09_09:00', '2026-05-10_08:00', '2026-05-11_09:00'] },
   { id: 6, name: 'Đỗ Minh Tuấn', initials: 'ĐMT', color: '#2F9E44', rating: 4.8, reviews: 89, subjects: ['Web Development', 'Lập trình Java'], desc: 'Full-stack Developer 7 năm. Dạy React, Node.js, Spring Boot.', sessions: 445, price: 220000, timeSlot: 'afternoon', status: 'Online', availableSlots: ['2026-05-08_14:00', '2026-05-09_15:00', '2026-05-10_14:00', '2026-05-11_16:00'] }
  ],
  filter: { search: '', subject: '', price: '', rating: '', timeSlot: '' },
  availableOnly: false,
  bookings: [
    { id: 1, tutorName: 'Nguyễn Minh Anh', tutorInitials: 'NMA', tutorColor: '#3B5BDB', subject: 'Toán học', date: '2026-05-08', time: '19:00', duration: 45, price: 150000, status: 'confirmed', meetLink: 'https://meet.google.com/abc-defg-hij' },
    { id: 2, tutorName: 'Trần Hải Đăng', tutorInitials: 'THĐ', tutorColor: '#7C3AED', subject: 'IELTS Speaking', date: '2026-05-10', time: '20:00', duration: 30, price: 200000, status: 'confirmed', meetLink: 'https://meet.google.com/klm-nopq-rst' },
    { id: 3, tutorName: 'Phạm Quốc Khánh', tutorInitials: 'PQK', tutorColor: '#0C8599', subject: 'Python cơ bản', date: '2026-04-28', time: '20:30', duration: 45, price: 250000, status: 'completed', meetLink: 'https://meet.google.com/uvw-xyz1-234' }
  ],
  bookingModal: { open: false, tutor: null, slots: [{ date: '2026-05-20', time: '19:00' }], note: '' },
  reviewModal: { open: false, tutorName: '', rating: '5', comment: '' },
  reportModal: { open: false, bookingId: null, tutorName: '', issue: 'quality', detail: '' },
  tutorModal: { open: false, tutor: null },
  reports: [
    { id: 1, bookingId: 3, tutorName: 'Phạm Quốc Khánh', studentName: 'Học viên Demo', issue: 'Nội dung buổi học không đúng cam kết', status: 'pending', createdAt: '2026-05-12T08:00:00Z' }
  ],
  wallet: {
    balance: 7250000,
    topup: '500000',
    selectedBank: 'VCB **** 2891',
    banks: ['VCB **** 2891', 'MB **** 1122', 'ACB **** 5544'],
    transactions: [
      { id: 1, label: 'Nạp tiền từ thẻ', amount: 500000, type: 'in', time: 'Hôm nay 09:10' },
      { id: 2, label: 'Thanh toán buổi học', amount: 150000, type: 'out', time: 'Hôm qua 20:15' },
      { id: 3, label: 'Rút tiền về ngân hàng', amount: 1000000, type: 'out', time: '2 ngày trước' }
    ]
  },
   withdraw: { amount: '1000000', step: 'select', otp: ['','','','','',''], bank: 'VCB **** 2891' },
  tutorForm: { name: '', email: '', phone: '', subjects: [], education: '', experience: '', price: '', bio: '' },
  tutorProfile: {
    bio: 'Tôi là một gia sư tận tâm với 8 năm kinh nghiệm giảng dạy. Chuyên ôn thi THPT Quốc gia và luyện thi học sinh giỏi.',
    skills: ['Toán học cơ bản', 'Toán học nâng cao', 'Ôn thi THPT', 'Luyện thi học sinh giỏi'],
    certificates: [],
    documents: [],
    coverImage: '',
    totalHours: 856,
    totalStudents: 127,
    rating: 4.9,
    scheduleSlots: [],
    selectedSlots: [],
    declineCount: 0
  },
  applications: [],
  session: { id: null, tutor: 'Nguyễn Minh Anh', student: 'Học viên Demo', subject: 'Toán học', room: 'https://meet.google.com/vvk-fuco-zpo', time: '19:00 - 19:45' },
  bookingStage: 'detail',
  otpDigits: ['','','','','',''],
  otpTimer: '04:59',
  heroSearch: '',
  admin: { tab: 'overview', loading: false, error: '', overview: { stats: null, revenueSeries: [], bookingStatus: [], activities: [] }, users: [], tutors: [], applications: [], reports: null, search: '' }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE': return { ...state, page: action.payload };
    case 'SET_TOAST': return { ...state, toast: action.payload };
    case 'SET_SELECTED_ROLE': return { ...state, selectedRole: action.payload };
    case 'SET_LOGIN': return { ...state, login: { ...state.login, ...action.payload } };
    case 'SET_REGISTER': return { ...state, register: { ...state.register, ...action.payload } };
    case 'SET_AUTH': return { ...state, authToken: action.payload.token, currentUser: action.payload.user };
    case 'SET_CURRENT_USER': return { ...state, currentUser: action.payload };
    case 'SET_PENDING_USER': return { ...state, pendingUser: action.payload };
    case 'ADD_AUTH_USER': return { ...state, authUsers: [...state.authUsers, action.payload] };
    case 'SET_EMAIL_MODAL': return { ...state, emailModal: action.payload };
    case 'SET_FILTER': return { ...state, filter: { ...state.filter, ...action.payload } };
    case 'SET_AVAILABLE_ONLY': return { ...state, availableOnly: action.payload };
    case 'SET_BOOKING_MODAL': return { ...state, bookingModal: { ...state.bookingModal, ...action.payload } };
    case 'SET_REVIEW_MODAL': return { ...state, reviewModal: { ...state.reviewModal, ...action.payload } };
    case 'SET_REPORT_MODAL': return { ...state, reportModal: { ...state.reportModal, ...action.payload } };
    case 'ADD_BOOKING': return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'CANCEL_BOOKING': return { ...state, bookings: state.bookings.filter(b => b.id !== action.payload) };
    case 'COMPLETE_BOOKING_IN_STATE': return { ...state, bookings: state.bookings.map(b => b.id === action.payload ? { ...b, status: 'completed' } : b) };
    case 'ADD_REPORT': return { ...state, reports: [action.payload, ...state.reports] };
    case 'SET_REPORTS': return { ...state, reports: action.payload };
    case 'UPDATE_REPORT_STATUS': return { ...state, reports: state.reports.map((r) => r.id === action.payload.id ? { ...r, status: action.payload.status } : r) };
    case 'SET_WALLET': return { ...state, wallet: { ...state.wallet, ...action.payload } };
    case 'SET_WITHDRAW': return { ...state, withdraw: { ...state.withdraw, ...action.payload } };
    case 'SET_TUTOR_FORM': return { ...state, tutorForm: { ...state.tutorForm, ...action.payload } };
    case 'RESET_TUTOR_FORM': return { ...state, tutorForm: initialState.tutorForm };
    case 'SET_APPLICATIONS': return { ...state, applications: action.payload };
    case 'ADD_APPLICATION': return { ...state, applications: [action.payload, ...state.applications] };
    case 'UPDATE_APPLICATION_STATUS': return { ...state, applications: state.applications.map((a) => a.id === action.payload.id ? { ...a, status: action.payload.status } : a) };
    case 'SET_OTP_DIGITS': return { ...state, otpDigits: action.payload };
    case 'SET_OTP_TIMER': return { ...state, otpTimer: action.payload };
    case 'SET_HERO_SEARCH': return { ...state, heroSearch: action.payload };
    case 'SET_BOOKING_STAGE': return { ...state, bookingStage: action.payload };
    case 'SET_SESSION': return { ...state, session: { ...state.session, ...action.payload } };
     case 'SET_ADMIN': return { ...state, admin: { ...state.admin, ...action.payload } };
    case 'SET_TUTOR_MODAL': return { ...state, tutorModal: { ...state.tutorModal, ...action.payload } };
    case 'SET_TUTOR_PROFILE': return { ...state, tutorProfile: { ...state.tutorProfile, ...action.payload } };
    case 'ADD_CERTIFICATE': return { ...state, tutorProfile: { ...state.tutorProfile, certificates: [...state.tutorProfile.certificates, action.payload] } };
    case 'ADD_DOCUMENT': return { ...state, tutorProfile: { ...state.tutorProfile, documents: [...state.tutorProfile.documents, action.payload] } };
      case 'SET_SCHEDULE_SLOTS_BULK': {
          const existingIds = new Set(state.tutorProfile.scheduleSlots.map(s => s.id));
          const uniqueNew = action.payload.filter(s => !existingIds.has(s.id));
          return {
              ...state,
              tutorProfile: {
                  ...state.tutorProfile,
                  scheduleSlots: [...state.tutorProfile.scheduleSlots, ...uniqueNew],
                  selectedSlots: [],
              },
              tutors: state.tutors.map(t =>
                  t.id === (state.currentUser?.id ?? 0)
                      ? { ...t, availableSlots: [...(t.availableSlots || []), ...uniqueNew.map(s => s.id)] }
                      : t
              )
          };
      }
    case 'REMOVE_SCHEDULE_SLOT': return { ...state, tutorProfile: { ...state.tutorProfile, scheduleSlots: state.tutorProfile.scheduleSlots.filter(s => s.id !== action.payload) } };
    case 'SET_SELECTED_SLOTS': return { ...state, tutorProfile: { ...state.tutorProfile, selectedSlots: action.payload } };
    case 'SET_DECLINE_COUNT': return { ...state, tutorProfile: { ...state.tutorProfile, declineCount: action.payload } };
      case 'UPDATE_TUTOR': return { ...state, tutors: state.tutors.map((t) => t.id === action.payload.id ? action.payload : t) };
    default: return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const payload = state.authToken && state.currentUser ? { token: state.authToken, user: state.currentUser } : { token: null, user: null };
    try { localStorage.setItem('studyhub-auth', JSON.stringify(payload)); } catch {}
  }, [state.authToken, state.currentUser]);
  const navigate = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const showToast = useCallback((msg, type = 'success', duration = 2800) => {
    dispatch({ type: 'SET_TOAST', payload: { msg, type } });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: { msg: '', type: '' } }), duration);
  }, []);

  return <AppContext.Provider value={{ state, dispatch, navigate, showToast }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

