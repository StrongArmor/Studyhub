# StudyHub API Documentation

Backend chạy tại `http://localhost:4000`. Frontend proxy Vite trỏ `/api` → `http://localhost:4000`, nên FE gọi `/api/...` là được.

---

## Response envelope

Mọi response đều theo cấu trúc:

```json
{
  "success": true,
  "message": "Lấy dữ liệu thành công",
  "data": { ... },
  "errors": null,
  "meta": { "timestamp": "2026-05-30T00:00:00.000Z" }
}
```

Khi lỗi:

```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng",
  "data": null,
  "errors": null,
  "meta": { "timestamp": "..." }
}
```

Các ví dụ bên dưới chỉ show phần `data`.

---

## Auth

### POST `/api/login`

Body:

```json
{ "email": "user@studyhub.vn", "password": "12345678" }
```

`data`:

```json
{
  "access_token": "eyJ...",
  "user": { "id": 1, "name": "Học viên Demo", "email": "user@studyhub.vn", "role": "user", "status": "active", "avatar": null }
}
```

Errors: `401` email/mật khẩu sai — `403` tài khoản bị khóa.

---

### POST `/api/register`

Body:

```json
{ "name": "Nguyễn Văn A", "email": "a@example.com", "password": "12345678" }
```

`data`:

```json
{
  "token": "eyJ...",
  "user": { "id": 5, "name": "Nguyễn Văn A", "email": "a@example.com", "role": "user" }
}
```

Errors: `400` thiếu field — `409` email đã tồn tại.

---

### POST `/api/auth/otp/send`

Body: `{ "email": "a@example.com" }`

`data`:

```json
{ "email": "a@example.com", "code": "482931", "expiresIn": 300 }
```

> `code` trả về trong response vì đây là demo (không gửi email thật).

---

### POST `/api/auth/otp/verify`

Body: `{ "email": "a@example.com", "otp": "482931" }`

`data`: `null` (chỉ cần `success: true`)

Errors: `401` OTP không hợp lệ hoặc hết hạn.

---

## User

### PATCH `/api/users/me` 🔒

Cập nhật thông tin cá nhân của user đang đăng nhập.

Body (tất cả optional):

```json
{ "name": "Tên mới", "avatar": "NM" }
```

`data`:

```json
{
  "user": { "id": 1, "name": "Tên mới", "email": "user@studyhub.vn", "role": "user", "status": "active", "avatar": "NM" }
}
```

---

## Tutors

### GET `/api/tutors`

Query params: `search`, `subject`, `minRating`, `maxPrice`.

`data`:

```json
{
  "tutors": [
    { "id": 1, "name": "Nguyễn Minh Anh", "initials": "NMA", "subjects": ["Toán học", "Vật lý"], "rating": 4.9, "reviews": 127, "price": 150000, "sessions": 856, "status": "Online", "bio": "..." }
  ]
}
```

---

### GET `/api/subjects`

`data`: `{ "subjects": ["IELTS", "Toán học", "Vật lý"] }`

---

## Tutor profile

### GET `/api/tutor/profile` 🔒

`data`:

```json
{
  "profile": {
    "bio": "...",
    "skills": ["Toán cơ bản", "Ôn thi THPT"],
    "certificates": [{ "id": 1, "name": "Chứng chỉ A", "url": "#", "issuedAt": "2026-01-01T..." }],
    "documents": [],
    "coverImage": "",
    "totalHours": 856,
    "totalStudents": 127,
    "rating": 4.9,
    "scheduleSlots": [],
    "selectedSlots": [],
    "declineCount": 0
  }
}
```

---

### PATCH `/api/tutor/profile` 🔒 (role: tutor)

Body (tất cả optional):

```json
{
  "bio": "Giới thiệu mới",
  "skills": ["Toán học", "Lý"],
  "coverImage": "",
  "totalHours": 900,
  "totalStudents": 130,
  "rating": 4.9,
  "scheduleSlots": [],
  "selectedSlots": [],
  "declineCount": 0
}
```

`data`: `{ "profile": { ... } }` (same shape as GET)

---

### POST `/api/tutor/profile/certificates` 🔒 (role: tutor)

Body: `{ "name": "Chứng chỉ B", "url": "#", "issuedAt": "2026-01-01" }`

`data`: `{ "certificate": { "id": 2, ... } }`

---

### POST `/api/tutor/profile/documents` 🔒 (role: tutor)

Body: `{ "name": "Tài liệu C", "url": "#" }`

`data`: `{ "document": { "id": 3, ... } }`

---

## Bookings

### GET `/api/bookings`

`data`:

```json
{
  "bookings": [
    { "id": 1, "tutorName": "Nguyễn Minh Anh", "subject": "Toán học", "date": "2026-05-08", "time": "19:00", "duration": 45, "price": 150000, "status": "confirmed" }
  ]
}
```

---

### POST `/api/bookings` 🔒

Body:

```json
{ "tutorId": 1, "subject": "Toán học", "date": "2026-05-20", "time": "19:00", "duration": 45, "price": 150000 }
```

`data`: `{ "booking": { ... } }`

---

### PATCH `/api/bookings/:id/cancel` 🔒

`data`: `{ "booking": { "id": 1, "status": "cancelled" } }`

---

### POST `/api/bookings/:id/reviews` 🔒

Body: `{ "rating": 5, "comment": "Rất tốt!" }`

`data`: `{ "booking": { ... } }`

---

## Reports

### POST `/api/reports` 🔒

Body:

```json
{ "bookingId": 1, "tutorName": "Nguyễn Minh Anh", "issue": "quality", "detail": "Nội dung không đúng cam kết" }
```

`data`: `{ "report": { "id": 2, "status": "pending", ... } }`

---

## Wallet

### GET `/api/wallet` 🔒

`data`:

```json
{
  "wallet": {
    "balance": 7250000,
    "topup": "500000",
    "selectedBank": "VCB **** 2891",
    "banks": ["VCB **** 2891", "MB **** 1122"],
    "transactions": [
      { "id": 1, "label": "Nạp tiền", "amount": 500000, "type": "in", "time": "Vừa xong", "createdAt": "2026-05-30T..." }
    ]
  }
}
```

---

### POST `/api/wallet/topup` 🔒

Body: `{ "amount": 500000, "bank": "VCB **** 2891" }`

`data`:

```json
{
  "wallet": { "balance": 7750000, "topup": "500000", "selectedBank": "VCB **** 2891", "banks": [...], "transactions": [...] },
  "transaction": { "id": 4, "label": "Nạp tiền", "amount": 500000, "type": "in", "time": "Vừa xong", "createdAt": "..." }
}
```

---

### POST `/api/wallet/withdraw` 🔒

Body: `{ "amount": 1000000, "bank": "VCB **** 2891" }`

`data`:

```json
{
  "wallet": { "balance": 6250000, "topup": "500000", "selectedBank": "VCB **** 2891", "banks": [...], "transactions": [...] },
  "transaction": { "id": 5, "label": "Rút tiền về ngân hàng", "amount": 1000000, "type": "out", "time": "Vừa xong", "createdAt": "..." }
}
```

Errors: `400` số dư không đủ.

---

## Dashboard summary

### GET `/api/dashboard`

`data`:

```json
{
  "stats": { "tutors": 6, "bookings": 3, "onlineNow": 4, "applications": 2 },
  "featuredTutors": [...],
  "bookings": [...],
  "applications": [...]
}
```

---

## Admin (🔒 role: admin)

### GET `/api/admin/overview`

`data`:

```json
{
  "stats": { "totalUsers": 3, "activeTutors": 1, "pendingApplications": 1, "todayRevenue": 12400000, "totalBookings": 3, "onlineTutors": 4, "approvalRate": 33, "avgRating": 4.87 },
  "revenueSeries": [{ "label": "T2", "value": 8.2 }],
  "bookingStatus": [{ "label": "Đã xác nhận", "value": 52 }],
  "activities": []
}
```

---

### GET `/api/admin/users`

`data`: `{ "users": [{ "id": 1, "name": "...", "email": "...", "role": "user", "status": "active" }] }`

---

### GET `/api/admin/tutors`

`data`: `{ "tutors": [...] }`

---

### GET `/api/admin/applications`

`data`: `{ "applications": [...] }`

---

### GET `/api/admin/reports`

`data`: `{ stats, revenueSeries, bookingStatus, activities, applications, users, tutors }`

---

### PATCH `/api/admin/applications/:id`

Body: `{ "status": "approved" }`

`data`: `{ "application": { ... } }`

---

### PATCH `/api/admin/users/:email/status`

Body: `{ "status": "blocked" }`

`data`: `{ "user": { "email": "...", "status": "blocked" } }`

---

## 🔒 Authentication

Các endpoint có 🔒 yêu cầu header:

```
Authorization: Bearer <access_token>
```

Token lấy từ response của `/api/login` hoặc `/api/register`, hết hạn sau 7 ngày.

---

## Trạng thái tích hợp FE ↔ BE

| Feature | Endpoint | FE wired? |
|---|---|---|
| Đăng nhập | `POST /login` | ✅ |
| Đăng ký + OTP | `POST /auth/otp/send` + `POST /auth/otp/verify` + `POST /register` | ✅ |
| Nạp tiền | `POST /wallet/topup` | ✅ |
| Rút tiền | `POST /wallet/withdraw` | ✅ |
| Sửa tên (student) | `PATCH /users/me` | ✅ |
| Sửa bio (tutor) | `PATCH /tutor/profile` | ✅ |
| Tạo booking | `POST /bookings` | ❌ mock |
| Hủy booking | `PATCH /bookings/:id/cancel` | ❌ mock |
| Đánh giá | `POST /bookings/:id/reviews` | ❌ mock |
| Báo cáo | `POST /reports` | ❌ mock |
| Load wallet | `GET /wallet` | ❌ mock (chỉ đọc từ state) |
| Tutor profile load | `GET /tutor/profile` | ❌ mock |
| Upload chứng chỉ | `POST /tutor/profile/certificates` | ❌ mock |
| Admin panel | `GET /admin/*` | ❌ mock |

---

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Student | student@studyhub.vn | 12345678 |
| Tutor | tutor@studyhub.vn | 12345678 |
| Admin | admin@studyhub.vn | 12345678 |
