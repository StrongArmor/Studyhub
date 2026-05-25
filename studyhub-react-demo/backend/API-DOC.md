# StudyHub Frontend API Doc

Tài liệu này được viết từ mock data và state hiện có trong frontend, để frontend có thể thay dần dữ liệu demo bằng API thật.

## 1. Nguồn mock data hiện tại

Các nguồn dữ liệu demo chính đang nằm trong:

- `src/store/AppContext.jsx`
- `src/hooks/index.js`
- `src/components/home/index.jsx`
- `src/components/tutors/index.jsx`
- `src/components/dashboard/index.jsx`
- `src/components/booking/index.jsx`
- `src/components/wallet/index.jsx`
- `src/components/admin/index.jsx`
- `src/components/auth/index.jsx`

Frontend hiện đang render dữ liệu từ state nội bộ, chưa gọi API thật.

## 2. Data models dùng trong frontend

### 2.1 User / Auth user

```ts
{
  email: string;
  password?: string; // chỉ mock/local
  role: 'user' | 'tutor' | 'admin';
  name: string;
  status?: 'active' | 'blocked';
  avatar?: string;
}
```

### 2.2 Tutor

Mock hiện có cả trường backend và trường UI-only:

```ts
{
  id: number;
  name: string;
  initials: string;
  subjects: string[];
  rating: number;
  reviews: number;
  price: number;
  sessions: number;
  status: 'Online' | 'Offline';
  bio?: string;
  desc?: string;        // UI-only
  color?: string;       // UI-only
  timeSlot?: 'morning' | 'afternoon' | 'evening';
  availableSlots?: string[]; // UI-only, dùng cho booking demo
  active?: boolean;
}
```

### 2.3 Booking

```ts
{
  id: number;
  tutorName: string;
  tutorInitials?: string;
  tutorColor?: string;
  subject: string;
  date: string;     // YYYY-MM-DD
  time: string;     // HH:mm
  duration: number;
  price: number;
  status: 'confirmed' | 'completed' | 'cancelled';
}
```

### 2.4 Application / tutor registration

```ts
{
  id: number;
  name: string;
  email: string;
  phone?: string;
  subjects: string[];
  education?: string;
  experience?: string;
  price?: number | string;
  bio?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
```

### 2.5 Activity

```ts
{
  id: number;
  type: "booking" | "application" | "user" | "report";
  title: string;
  detail: string;
  time: string;
}
```

### 2.6 Admin stats

```ts
{
  totalUsers: number;
  activeTutors: number;
  pendingApplications: number;
  todayRevenue: number;
  totalBookings: number;
  onlineTutors: number;
  approvalRate: number;
  avgRating: number;
}
```

### 2.7 Wallet / withdraw state

Đây hiện là mock-only, chưa có API backend tương ứng:

```ts
{
  balance: number;
  topup: string;
  selectedBank: string;
  banks: string[];
  transactions: Array<{
    id: number;
    label: string;
    amount: number;
    type: 'in' | 'out';
    time: string;
  }>;
}
```

## 3. API hiện có ở backend

Proxy đang trỏ `/api` sang `http://localhost:4000` trong `vite.config.js`.

### 3.1 Health / reference

#### GET `/api/health`

Response:

```json
{
  "ok": true,
  "service": "StudyHub API",
  "timestamp": "2026-05-24T00:00:00.000Z"
}
```

#### GET `/api/subjects`

Response:

```json
{
  "subjects": ["Toán học", "Vật lý"]
}
```

### 3.2 Home / discovery

#### GET `/api/dashboard`

Used by: home page, dashboard summary.

Response:

```json
{
  "stats": {
    "tutors": 6,
    "bookings": 3,
    "onlineNow": 4,
    "applications": 3
  },
  "featuredTutors": [
    {
      "id": 1,
      "name": "Nguyễn Minh Anh",
      "initials": "NMA",
      "subjects": ["Toán học", "Vật lý"],
      "rating": 4.9,
      "reviews": 127,
      "price": 150000,
      "sessions": 856,
      "status": "Online",
      "bio": "Giáo viên Toán - Lý với 8 năm kinh nghiệm."
    }
  ],
  "bookings": [],
  "applications": []
}
```

#### GET `/api/tutors?search=&subject=&minRating=&maxPrice=`

Used by: tutor list page.

Response:

```json
{
  "tutors": [
    {
      "id": 1,
      "name": "Nguyễn Minh Anh",
      "initials": "NMA",
      "subjects": ["Toán học", "Vật lý"],
      "rating": 4.9,
      "reviews": 127,
      "price": 150000,
      "sessions": 856,
      "status": "Online",
      "bio": "Giáo viên Toán - Lý với 8 năm kinh nghiệm."
    }
  ]
}
```

Query contract:

- `search`: text search theo tên hoặc môn học.
- `subject`: lọc theo môn học.
- `minRating`: lọc rating tối thiểu.
- `maxPrice`: lọc giá tối đa.

### 3.3 Booking / dashboard

#### GET `/api/bookings`

Response:

```json
{
  "bookings": [
    {
      "id": 1,
      "tutor": "Nguyễn Minh Anh",
      "subject": "Toán học",
      "date": "2026-05-08",
      "time": "19:00",
      "duration": 45,
      "price": 150000,
      "status": "confirmed"
    }
  ]
}
```

### 3.4 Auth

#### POST `/api/login`

Body:

```json
{
  "email": "user@studyhub.vn",
  "password": "12345678"
}
```

Success response:

```json
{
  "ok": true,
  "user": {
    "email": "user@studyhub.vn",
    "name": "Học viên Demo",
    "role": "user"
  }
}
```

Error response:

```json
{
  "ok": false,
  "message": "Email hoặc mật khẩu không đúng"
}
```

#### POST `/api/register`

Body:

```json
{
  "name": "Nguyễn Văn A",
  "email": "a@example.com",
  "password": "12345678",
  "role": "user"
}
```

Success response:

```json
{
  "ok": true,
  "user": {
    "name": "Nguyễn Văn A",
    "email": "a@example.com",
    "role": "user"
  }
}
```

Error responses:

```json
{ "ok": false, "message": "Thiếu thông tin đăng ký" }
```

```json
{ "ok": false, "message": "Email đã tồn tại" }
```

### 3.5 Tutor application

#### POST `/api/applications`

Body:

```json
{
  "name": "Lê Minh Khoa",
  "email": "khoa@example.com",
  "phone": "0909000001",
  "subjects": ["Toán học", "Vật lý"],
  "education": "ĐH Bách Khoa",
  "experience": "3 năm luyện thi THPT",
  "price": 180000,
  "bio": "Tập trung vào nền tảng và luyện đề"
}
```

Success response:

```json
{
  "ok": true,
  "application": {
    "id": 4,
    "name": "Lê Minh Khoa",
    "email": "khoa@example.com",
    "phone": "0909000001",
    "subjects": ["Toán học", "Vật lý"],
    "education": "ĐH Bách Khoa",
    "experience": "3 năm luyện thi THPT",
    "price": 180000,
    "bio": "Tập trung vào nền tảng và luyện đề",
    "createdAt": "2026-05-24T00:00:00.000Z",
    "status": "pending"
  }
}
```

### 3.6 Admin

#### GET `/api/admin/overview`

Response:

```json
{
  "stats": {
    "totalUsers": 3,
    "activeTutors": 1,
    "pendingApplications": 1,
    "todayRevenue": 12400000,
    "totalBookings": 3,
    "onlineTutors": 4,
    "approvalRate": 33,
    "avgRating": 4.87
  },
  "revenueSeries": [{ "label": "T2", "value": 8.2 }],
  "bookingStatus": [{ "label": "Đã xác nhận", "value": 52 }],
  "activities": []
}
```

#### GET `/api/admin/users`

Response:

```json
{
  "users": [
    {
      "email": "user@studyhub.vn",
      "role": "user",
      "name": "Học viên Demo",
      "status": "active"
    }
  ]
}
```

#### GET `/api/admin/tutors`

Response: `{ "tutors": Tutor[] }`

#### GET `/api/admin/applications`

Response: `{ "applications": Application[] }`

#### GET `/api/admin/reports`

Response: `{ stats, revenueSeries, bookingStatus, activities, applications, users, tutors }`

#### GET `/api/admin/activities`

Response: `{ "activities": Activity[] }`

#### PATCH `/api/admin/applications/:id`

Body:

```json
{ "status": "approved" }
```

Response:

```json
{
  "ok": true,
  "application": {}
}
```

#### PATCH `/api/admin/users/:email/status`

Body:

```json
{ "status": "blocked" }
```

Response:

```json
{
  "ok": true,
  "user": {
    "email": "user@studyhub.vn",
    "name": "Học viên Demo",
    "role": "user",
    "status": "blocked"
  }
}
```

## 4. API còn đang mock ở frontend nhưng chưa có backend

Các màn hình dưới đây đang dùng state nội bộ và hiện chưa có endpoint thật:

- Booking flow: tạo booking, hủy booking, gửi đánh giá, gửi báo cáo/khiếu nại.
- Wallet: nạp tiền, rút tiền, lưu ngân hàng, lịch sử giao dịch.
- Tutor profile: upload chứng chỉ/tài liệu, quản lý lịch dạy, duyệt/từ chối slot.
- OTP flow: gửi OTP, xác thực OTP, resend OTP.

### 4.1 API nên bổ sung nếu muốn bỏ mock hoàn toàn

Đề xuất contract tối thiểu:

- POST `/api/bookings`
- PATCH `/api/bookings/:id/cancel`
- POST `/api/bookings/:id/reviews`
- POST `/api/reports`
- GET `/api/wallet`
- POST `/api/wallet/topup`
- POST `/api/wallet/withdraw`
- GET `/api/wallet/transactions`
- GET `/api/tutor/profile`
- PATCH `/api/tutor/profile`
- POST `/api/tutor/profile/certificates`
- POST `/api/tutor/profile/documents`
- POST `/api/auth/otp/send`
- POST `/api/auth/otp/verify`

## 5. Frontend screen to API mapping

- Home: `/api/dashboard`, `/api/subjects`
- Tutor list: `/api/tutors`
- Student dashboard: `/api/bookings`
- Auth: `/api/login`, `/api/register`, later thêm OTP endpoints
- Become tutor: `/api/applications`
- Admin panel: `/api/admin/overview`, `/api/admin/users`, `/api/admin/tutors`, `/api/admin/applications`, `/api/admin/reports`, `/api/admin/activities`
- Wallet / booking / tutor profile: hiện vẫn mock, cần bổ sung API ở phần 4.1

## 6. Notes

- Backend hiện đã có CORS và proxy Vite đang trỏ `/api` sang `http://localhost:4000`.
- Một số field trong UI chỉ là demo, ví dụ `color`, `desc`, `availableSlots`, `transactions`, `otp`.
- Khi chuyển sang API thật, nên giữ đồng bộ shape giữa backend và `AppContext` để tránh phải map lại quá nhiều ở component.
