import { createContext, useContext, useReducer, useCallback } from 'react';

// ─── Initial State ───────────────────────────────────────────────
const initialState = {
  // Navigation
  page: 'home',

  // Auth
  currentUser: null,
  authUsers: [
    { email: 'student@studyhub.vn', password: '12345678', role: 'student', name: 'Học viên Demo' },
    { email: 'tutor@studyhub.vn',   password: '12345678', role: 'tutor',   name: 'Gia sư Demo'  },
    { email: 'admin@studyhub.vn',   password: '12345678', role: 'admin',   name: 'Admin Demo'   },
  ],
  selectedRole: 'student',
  pendingUser: null,
  register: { name: '', email: '', pass: '', confirm: '', agree: false },
  login: {
    studentEmail: 'student@studyhub.vn', studentPass: '12345678',
    tutorEmail:   'tutor@studyhub.vn',   tutorPass:   '12345678',
    adminEmail:   'admin@studyhub.vn',   adminPass:   '12345678',
  },

  // Toast
  toast: { msg: '', type: '' },

  // Email duplicate modal
  emailModal: { open: false, msg: '' },

  // Tutors
  tutors: [
    { id: 1, name: 'Nguyễn Minh Anh',  initials: 'NMA', color: '#3B5BDB', rating: 4.9, reviews: 127, subjects: ['Toán học','Vật lý'],              desc: 'Giáo viên Toán - Lý với 8 năm kinh nghiệm. Chuyên ôn thi THPT Quốc gia và luyện thi.', sessions: 856, price: 150000, timeSlot: 'evening',   status: 'Online'  },
    { id: 2, name: 'Trần Hải Đăng',    initials: 'THĐ', color: '#7C3AED', rating: 5.0, reviews: 93,  subjects: ['Tiếng Anh','IELTS'],              desc: 'IELTS 8.5 - Chuyên luyện thi IELTS Speaking & Writing. Phương pháp học tập trung, hiệu quả.', sessions: 542, price: 200000, timeSlot: 'evening',   status: 'Online'  },
    { id: 3, name: 'Lê Thu Hà',        initials: 'LTH', color: '#E64980', rating: 4.8, reviews: 68,  subjects: ['Hóa học','Sinh học'],             desc: 'Giảng viên Hóa - Sinh, chuyên ôn thi THPT và luyện thi Y Dược.', sessions: 423, price: 120000, timeSlot: 'morning',   status: 'Offline' },
    { id: 4, name: 'Phạm Quốc Khánh', initials: 'PQK', color: '#0C8599', rating: 4.9, reviews: 156, subjects: ['Lập trình Python','Data Science'], desc: 'Senior Data Scientist. Dạy Python từ cơ bản đến nâng cao.', sessions: 672, price: 250000, timeSlot: 'evening',   status: 'Online'  },
    { id: 5, name: 'Hoàng Lan Anh',   initials: 'HLA', color: '#F59F00', rating: 4.7, reviews: 45,  subjects: ['Tiếng Trung','HSK'],              desc: 'Tốt nghiệp Đại học Bắc Kinh. Chuyên luyện thi HSK và giao tiếp thực tế.', sessions: 234, price: 180000, timeSlot: 'morning',   status: 'Offline' },
    { id: 6, name: 'Đỗ Minh Tuấn',    initials: 'ĐMT', color: '#2F9E44', rating: 4.8, reviews: 89,  subjects: ['Web Development','Lập trình Java'],desc: 'Full-stack Developer 7 năm. Dạy React, Node.js, Spring Boot.', sessions: 445, price: 220000, timeSlot: 'afternoon', status: 'Online'  },
  ],
  filter: { search: '', subject: '', price: '', rating: '', timeSlot: '' },
  availableOnly: false,

  // Bookings / Dashboard
  bookings: [
    { id: 1, tutorName: 'Nguyễn Minh Anh', tutorInitials: 'NMA', tutorColor: '#3B5BDB', subject: 'Toán học',      date: '2026-05-08', time: '19:00', duration: 45, price: 150000, status: 'confirmed' },
    { id: 2, tutorName: 'Trần Hải Đăng',   tutorInitials: 'THĐ', tutorColor: '#7C3AED', subject: 'IELTS Speaking', date: '2026-05-10', time: '20:00', duration: 30, price: 200000, status: 'confirmed' },
    { id: 3, tutorName: 'Phạm Quốc Khánh', tutorInitials: 'PQK', tutorColor: '#0C8599', subject: 'Python cơ bản',  date: '2026-04-28', time: '20:30', duration: 45, price: 250000, status: 'completed' },
  ],

  // Modals
  bookingModal: { open: false, tutor: null, date: '2026-05-20', time: '19:00', note: '' },
  reviewModal:  { open: false, tutorName: '', rating: '5', comment: '' },

  // Wallet
  wallet: {
    balance: 7250000,
    topup: '500000',
    selectedBank: 'VCB **** 2891',
    banks: ['VCB **** 2891', 'MB **** 1122', 'ACB **** 5544'],
    transactions: [
      { id: 1, label: 'Nạp tiền từ thẻ',       amount: 500000,  type: 'in',  time: 'Hôm nay 09:10'   },
      { id: 2, label: 'Thanh toán buổi học',    amount: 150000,  type: 'out', time: 'Hôm qua 20:15'   },
      { id: 3, label: 'Rút tiền về ngân hàng',  amount: 1000000, type: 'out', time: '2 ngày trước'     },
    ],
  },
  withdraw: { amount: '1000000', step: 'select', otp: ['','','','','',''], bank: 'VCB **** 2891' },

  // Tutor application form
  tutorForm: { name: '', email: '', phone: '', subjects: [], education: '', experience: '', price: '', bio: '' },
  applications: [],

  // Booking session (online learn)
  session: { tutor: 'Nguyễn Minh Anh', student: 'Học viên Demo', subject: 'Toán học', room: 'https://meet.google.com/vvk-fuco-zpo', time: '19:00 - 19:45' },
  bookingStage: 'detail',

  // OTP
  otpDigits: ['','','','','',''],
  otpTimer: '04:59',

  // Hero search
  heroSearch: '',

  // Admin
  admin: { tab: 'overview', loading: false, error: '', overview: { stats: null, revenueSeries: [], bookingStatus: [], activities: [] }, users: [], tutors: [], applications: [], reports: null, search: '' },
};

// ─── Reducer ─────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':           return { ...state, page: action.payload };
    case 'SET_TOAST':          return { ...state, toast: action.payload };
    case 'SET_SELECTED_ROLE':  return { ...state, selectedRole: action.payload };
    case 'SET_LOGIN':          return { ...state, login: { ...state.login, ...action.payload } };
    case 'SET_REGISTER':       return { ...state, register: { ...state.register, ...action.payload } };
    case 'SET_CURRENT_USER':   return { ...state, currentUser: action.payload };
    case 'SET_PENDING_USER':   return { ...state, pendingUser: action.payload };
    case 'ADD_AUTH_USER':      return { ...state, authUsers: [...state.authUsers, action.payload] };
    case 'SET_EMAIL_MODAL':    return { ...state, emailModal: action.payload };
    case 'SET_FILTER':         return { ...state, filter: { ...state.filter, ...action.payload } };
    case 'SET_AVAILABLE_ONLY': return { ...state, availableOnly: action.payload };
    case 'SET_BOOKING_MODAL':  return { ...state, bookingModal: { ...state.bookingModal, ...action.payload } };
    case 'SET_REVIEW_MODAL':   return { ...state, reviewModal: { ...state.reviewModal, ...action.payload } };
    case 'ADD_BOOKING':        return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'CANCEL_BOOKING':     return { ...state, bookings: state.bookings.filter(b => b.id !== action.payload) };
    case 'SET_WALLET':         return { ...state, wallet: { ...state.wallet, ...action.payload } };
    case 'SET_WITHDRAW':       return { ...state, withdraw: { ...state.withdraw, ...action.payload } };
    case 'SET_TUTOR_FORM':     return { ...state, tutorForm: { ...state.tutorForm, ...action.payload } };
    case 'RESET_TUTOR_FORM':   return { ...state, tutorForm: initialState.tutorForm };
    case 'ADD_APPLICATION':    return { ...state, applications: [action.payload, ...state.applications] };
    case 'SET_OTP_DIGITS':     return { ...state, otpDigits: action.payload };
    case 'SET_OTP_TIMER':      return { ...state, otpTimer: action.payload };
    case 'SET_HERO_SEARCH':    return { ...state, heroSearch: action.payload };
    case 'SET_BOOKING_STAGE':  return { ...state, bookingStage: action.payload };
    case 'SET_ADMIN':          return { ...state, admin: { ...state.admin, ...action.payload } };
    default: return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  let toastTimer = null;
  const showToast = useCallback((msg, type = 'success') => {
    dispatch({ type: 'SET_TOAST', payload: { msg, type } });
    clearTimeout(toastTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    toastTimer = setTimeout(() => dispatch({ type: 'SET_TOAST', payload: { msg: '', type: '' } }), 2800);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, navigate, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
