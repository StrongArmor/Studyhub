import { useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { api } from '../services/api';

export function useAuth() {
  const { state, dispatch, navigate, showToast } = useApp();

  const avatarFrom = (name) => name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  const doLogin = async (role) => {
    const { login } = state;
    const emailKey = role === 'admin' ? 'adminEmail' : role === 'tutor' ? 'tutorEmail' : 'studentEmail';
    const passKey  = role === 'admin' ? 'adminPass'  : role === 'tutor' ? 'tutorPass'  : 'studentPass';
    try {
      const data = await api.login(login[emailKey], login[passKey]);
      const user = data.user;
      dispatch({ type: 'SET_AUTH', payload: { token: data.access_token, user: { ...user, avatar: user.avatar || avatarFrom(user.name) } } });
      showToast(`Đăng nhập thành công! Chào mừng ${user.name}`, 'success');
      setTimeout(() => navigate(user.role === 'admin' ? 'admin' : 'dashboard'), 600);
    } catch (err) {
      showToast(err.message || 'Email hoặc mật khẩu không đúng', 'error');
    }
  };

  const doRegister = async () => {
    const { name, email, pass, confirm, agree } = state.register;
    if (!name || !email || !pass || !confirm) return showToast('Vui lòng nhập đầy đủ thông tin', 'error');
    if (pass.length < 8) return showToast('Mật khẩu tối thiểu 8 ký tự', 'error');
    if (pass !== confirm) return showToast('Mật khẩu xác nhận không khớp', 'error');
    if (!agree) return showToast('Vui lòng đồng ý với điều khoản sử dụng', 'error');
    try {
      const otpData = await api.sendOtp(email);
      dispatch({ type: 'SET_PENDING_USER', payload: { name, email, password: pass } });
      showToast(`Mã OTP: ${otpData.code} (demo)`, 'success', 10000);
      navigate('otp');
    } catch (err) {
      if (err.message.includes('đã tồn tại')) {
        dispatch({ type: 'SET_EMAIL_MODAL', payload: { open: true, msg: `Email ${email} đã tồn tại trong hệ thống. Vui lòng đăng nhập hoặc sử dụng email khác.` } });
      } else {
        showToast(err.message, 'error');
      }
    }
  };

  const verifyOTP = async () => {
    const { otpDigits, pendingUser } = state;
    if (otpDigits.join('').length < 6) return showToast('Vui lòng nhập đủ 6 chữ số', 'error');
    if (!pendingUser) return;
    try {
      await api.verifyOtp(pendingUser.email, otpDigits.join(''));
      const data = await api.register(pendingUser.name, pendingUser.email, pendingUser.password);
      const user = data.user;
      dispatch({ type: 'SET_AUTH', payload: { token: data.token, user: { ...user, avatar: avatarFrom(user.name) } } });
      showToast(`Tạo tài khoản thành công! Chào mừng ${pendingUser.name}`, 'success');
      setTimeout(() => navigate('dashboard'), 700);
    } catch (err) {
      if (err.message.includes('đã tồn tại')) {
        dispatch({ type: 'SET_EMAIL_MODAL', payload: { open: true, msg: `Email ${pendingUser.email} đã tồn tại. Vui lòng đăng nhập.` } });
      } else {
        showToast(err.message || 'OTP không hợp lệ hoặc đã hết hạn', 'error');
      }
    }
  };

  const resendOTP = async () => {
    dispatch({ type: 'SET_OTP_DIGITS', payload: ['','','','','',''] });
    dispatch({ type: 'SET_OTP_TIMER', payload: '04:59' });
    try {
      const otpData = await api.sendOtp(state.pendingUser?.email);
      showToast(`Mã OTP mới: ${otpData.code} (demo)`, 'success', 10000);
    } catch (err) {
      showToast(err.message || 'Gửi lại OTP thất bại', 'error');
    }
  };

  const doLogout = () => {
    dispatch({ type: 'SET_AUTH', payload: { token: null, user: null } });
    showToast('Đã đăng xuất', 'success');
    navigate('home');
  };

  return { doLogin, doRegister, verifyOTP, resendOTP, doLogout };
}

export function useTutors() {
  const { state, dispatch } = useApp();
  const { tutors, filter, availableOnly } = state;
  const filtered = useMemo(() => tutors.filter((t) => {
    if (availableOnly && t.status !== 'Online') return false;
    const q = filter.search.trim().toLowerCase();
    if (q && !t.name.toLowerCase().includes(q) && !t.subjects.join(' ').toLowerCase().includes(q)) return false;
    if (filter.subject && !t.subjects.includes(filter.subject)) return false;
    if (filter.price) { const [min, max] = filter.price.split('-').map(Number); if (t.price < min || t.price > max) return false; }
    if (filter.rating && t.rating < Number(filter.rating)) return false;
    if (filter.timeSlot && t.timeSlot !== filter.timeSlot) return false;
    return true;
  }), [tutors, filter, availableOnly]);

  return {
    tutors: filtered,
    filter,
    setFilter: (payload) => dispatch({ type: 'SET_FILTER', payload }),
    clearFilters: () => { dispatch({ type: 'SET_FILTER', payload: { search: '', subject: '', price: '', rating: '', timeSlot: '' } }); dispatch({ type: 'SET_AVAILABLE_ONLY', payload: false }); },
    availableOnly,
    setAvailableOnly: (v) => dispatch({ type: 'SET_AVAILABLE_ONLY', payload: v })
  };
}

export function useBooking() {
  const { state, dispatch, navigate, showToast } = useApp();
  const openBookingModal = (tutor) => dispatch({ type: 'SET_BOOKING_MODAL', payload: { open: true, tutor, slots: [{ date: '2026-05-20', time: '19:00' }], note: '' } });
  const submitBooking = async () => {
    const { bookingModal } = state;
    if (!bookingModal.slots || bookingModal.slots.length === 0) return showToast('Vui lòng thêm ít nhất 1 giờ học', 'error');
    
    // Check if all slots have date and time
    for (const slot of bookingModal.slots) {
      if (!slot.date || !slot.time) return showToast('Vui lòng điền đủ ngày giờ cho tất cả các buổi học', 'error');
    }

    try {
      let successCount = 0;
      for (const slot of bookingModal.slots) {
        const data = await api.createBooking({
          tutorId: bookingModal.tutor?.id,
          tutorName: bookingModal.tutor?.name,
          tutorInitials: bookingModal.tutor?.initials,
          tutorColor: bookingModal.tutor?.color,
          subject: bookingModal.tutor?.subjects?.[0] || '',
          date: slot.date,
          time: slot.time,
          duration: 45,
          price: bookingModal.tutor?.price || 0
        });

        dispatch({ type: 'ADD_BOOKING', payload: data.booking });
        successCount++;
      }
      
      // Update wallet if logged in
      if (state.currentUser) {
        try {
          const walletData = await api.getWallet();
          dispatch({ type: 'SET_WALLET', payload: walletData.wallet });
        } catch (_e) {}
      }

      dispatch({ type: 'SET_BOOKING_MODAL', payload: { open: false, tutor: null } });
      showToast(`Đã đặt thành công ${successCount} buổi học với ${bookingModal.tutor?.name}!`, 'success');
      navigate('dashboard');
    } catch (err) {
      showToast(err.message || 'Có lỗi xảy ra khi đặt lịch', 'error');
    }
  };
  const cancelBooking = (id) => { dispatch({ type: 'CANCEL_BOOKING', payload: id }); showToast('Đã hủy buổi học thành công', 'success'); };
  const openReviewModal = (tutorName) => dispatch({ type: 'SET_REVIEW_MODAL', payload: { open: true, tutorName, rating: '5', comment: '' } });
  const submitReview = () => { const { reviewModal } = state; if (!reviewModal.comment.trim()) return showToast('Vui lòng nhập nhận xét', 'error'); dispatch({ type: 'SET_REVIEW_MODAL', payload: { open: false, tutorName: '', rating: '5', comment: '' } }); showToast('Đã gửi đánh giá thành công! Cảm ơn bạn.', 'success'); };
  const openReportModal = (booking) => dispatch({ type: 'SET_REPORT_MODAL', payload: { open: true, bookingId: booking.id, tutorName: booking.tutorName, issue: 'quality', detail: '' } });
  const submitReport = () => {
    const { reportModal, currentUser } = state;
    if (!reportModal.detail.trim()) return showToast('Vui lòng nhập nội dung báo cáo', 'error');
    dispatch({ type: 'ADD_REPORT', payload: { id: Date.now(), bookingId: reportModal.bookingId, tutorName: reportModal.tutorName, studentName: currentUser?.name || 'Học viên', issue: reportModal.issue, detail: reportModal.detail, status: 'pending', createdAt: new Date().toISOString() } });
    dispatch({ type: 'SET_REPORT_MODAL', payload: { open: false, bookingId: null, tutorName: '', issue: 'quality', detail: '' } });
    showToast('Đã gửi báo cáo/khiếu nại đến quản lý', 'success');
  };
  return { openBookingModal, submitBooking, cancelBooking, openReviewModal, submitReview, openReportModal, submitReport };
}

export function useWallet() {
  const { state, dispatch, showToast } = useApp();
  const { wallet, withdraw } = state;
  const topUp = () => { const amount = Number(wallet.topup || 0); if (!amount || amount < 100000) return showToast('Mức nạp tối thiểu là 100.000đ', 'error'); dispatch({ type: 'SET_WALLET', payload: { balance: wallet.balance + amount, transactions: [{ id: Date.now(), label: 'Nạp tiền thành công', amount, type: 'in', time: 'Vừa xong' }, ...wallet.transactions] } }); showToast(`Đã nạp ${amount.toLocaleString()}đ vào ví`, 'success'); };
  const saveBank = () => { const bank = wallet.selectedBank.trim(); if (!bank) return showToast('Vui lòng nhập số tài khoản', 'error'); if (wallet.banks.includes(bank)) return showToast('Tài khoản đã có trong danh sách', 'error'); dispatch({ type: 'SET_WALLET', payload: { banks: [...wallet.banks, bank] } }); showToast('Đã lưu tài khoản ngân hàng', 'success'); };
  const startWithdraw = () => { const amount = Number(withdraw.amount || 0); if (!amount || amount < 50000) return showToast('Mức rút tối thiểu là 50.000đ', 'error'); if (amount > wallet.balance) { dispatch({ type: 'SET_WITHDRAW', payload: { step: 'insufficient' } }); return showToast('Số tiền vượt số dư khả dụng', 'error'); } dispatch({ type: 'SET_WITHDRAW', payload: { step: 'otp' } }); };
  const confirmWithdraw = () => { if (withdraw.otp.join('').length < 6) return showToast('Vui lòng nhập đủ OTP', 'error'); const amount = Number(withdraw.amount || 0); dispatch({ type: 'SET_WALLET', payload: { balance: wallet.balance - amount, transactions: [{ id: Date.now(), label: `Rút tiền về ${withdraw.bank}`, amount, type: 'out', time: 'Vừa xong' }, ...wallet.transactions] } }); dispatch({ type: 'SET_WITHDRAW', payload: { step: 'done' } }); showToast('Rút tiền thành công', 'success'); };
  return { wallet, withdraw, topUp, saveBank, startWithdraw, confirmWithdraw };
}

export function useTutorForm() {
  const { state, dispatch, navigate, showToast } = useApp();
  const { tutorForm } = state;
  const setField = (field, value) => dispatch({ type: 'SET_TUTOR_FORM', payload: { [field]: value } });
  const toggleSubject = (subject) => {
    const subjects = tutorForm.subjects.includes(subject) ? tutorForm.subjects.filter((s) => s !== subject) : [...tutorForm.subjects, subject];
    dispatch({ type: 'SET_TUTOR_FORM', payload: { subjects } });
  };
  const submit = () => { if (!tutorForm.name || !tutorForm.email) return showToast('Vui lòng nhập họ tên và email', 'error'); if (!tutorForm.subjects.length) return showToast('Vui lòng chọn ít nhất 1 môn học', 'error'); dispatch({ type: 'ADD_APPLICATION', payload: { ...tutorForm, id: Date.now(), createdAt: new Date().toISOString(), status: 'pending' } }); dispatch({ type: 'RESET_TUTOR_FORM' }); showToast('🎉 Đăng ký thành công! Chúng tôi sẽ liên hệ trong 24h.', 'success'); setTimeout(() => navigate('home'), 1500); };
  return { tutorForm, setField, toggleSubject, submit };
}

export function useProfile() {
  const { state, dispatch, showToast } = useApp();
  const { currentUser } = state;

  const updateName = async (name) => {
    if (!name.trim()) return showToast('Tên không được để trống', 'error');
    try {
      const data = await api.updateMe({ name: name.trim() });
      const avatar = data.user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
      dispatch({ type: 'SET_CURRENT_USER', payload: { ...currentUser, name: data.user.name, avatar } });
      showToast('Đã cập nhật tên thành công', 'success');
    } catch (err) {
      showToast(err.message || 'Cập nhật thất bại', 'error');
    }
  };

  return { updateName };
}
