# StudyHub React Demo

Demo full-stack project for StudyHub using React + Express.

## Structure
- `frontend/` — React + Vite UI
- `backend/` — Express API (port 4000)

## Chạy trên Windows Native

### Bước 1 — Clone repo
```bash
git clone https://github.com/StrongArmor/Studyhub
cd Studyhub/studyhub-react-demo
```

### Bước 2 — Install dependencies
```bash
npm install
```
> Chạy một lần ở root là đủ (npm workspaces tự hoist dependencies cho cả frontend và backend)

### Bước 3 — Chạy Backend (port 4000)
Mở terminal 1:
```bash
cd backend
node server.js
```

### Bước 4 — Chạy Frontend (port 5173)
Mở terminal 2:
```bash
cd frontend
npx vite
```

### Bước 5 — Mở trình duyệt
```
http://localhost:5173
```

## Demo accounts

| Role    | Email                  | Password |
|---------|------------------------|----------|
| Student | student@studyhub.vn    | 12345678 |
| Tutor   | tutor@studyhub.vn      | 12345678 |
| Admin   | admin@studyhub.vn      | 12345678 |

## Demo features
- Dashboard overview
- Tutor list with filters
- Bookings list
- Tutor application form
- Mock API endpoints

## Lưu ý
- Nếu dùng **WSL**, cần `npm install` từ trong WSL (không dùng lại node_modules đã install từ Windows native vì khác native binaries).
