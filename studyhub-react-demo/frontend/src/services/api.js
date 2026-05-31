const BASE = '/api';

const getToken = () => {
  try {
    const raw = localStorage.getItem('studyhub-auth');
    return raw ? JSON.parse(raw).token : null;
  } catch { return null; }
};

const req = async (method, path, body) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Có lỗi xảy ra');
  return json.data;
};

export const api = {
  getWallet:          ()                       => req('GET',  '/wallet'),
  login:              (email, password)        => req('POST', '/login',              { email, password }),
  sendOtp:            (email)                  => req('POST', '/auth/otp/send',      { email }),
  verifyOtp:          (email, otp)             => req('POST', '/auth/otp/verify',    { email, otp }),
  register:           (name, email, password)  => req('POST', '/register',           { name, email, password }),
  topup:              (amount, bank)           => req('POST', '/wallet/topup',       { amount, bank }),
  withdraw:           (amount, bank)           => req('POST', '/wallet/withdraw',    { amount, bank }),
  updateMe:           (data)                   => req('PATCH', '/users/me',          data),
  updateTutorProfile: (data)                   => req('PATCH', '/tutor/profile',     data),
  createBooking:      (data)                   => req('POST', '/bookings',           data),
  cancelBooking:      (id)                     => req('PATCH', `/bookings/${id}/cancel`),
  completeBooking:    (id)                     => req('PATCH', `/bookings/${id}/complete`),
  addReview:          (id, rating, comment)    => req('POST', `/bookings/${id}/reviews`,    { rating: Number(rating), comment }),
  createApplication:  (data)                   => req('POST', '/applications',       data),
  getApplications:    ()                       => req('GET',  '/admin/applications'),
  patchApplication:   (id, status)             => req('PATCH', `/admin/applications/${id}`, { status }),
};
