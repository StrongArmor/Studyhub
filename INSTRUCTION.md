# Hướng Dẫn Tích Hợp Google Meet API (Miễn Phí)

Để tạo link Google Meet hoàn toàn miễn phí, chúng ta sẽ sử dụng **Google Calendar API** thông qua xác thực **OAuth 2.0** với thông tin `Client ID` và `Client Secret` mà bạn đã có trong Google Cloud Console.

Quy trình này đòi hỏi 3 thông số cấu hình chính:
1. `GOOGLE_CLIENT_ID`
2. `GOOGLE_CLIENT_SECRET`
3. `GOOGLE_REFRESH_TOKEN`

Dưới đây là các bước để lấy `Refresh Token` và cấu hình hệ thống:

## Bước 1: Thiết lập OAuth Consent Screen và Redirect URI
1. Trong Google Cloud Console, vào **APIs & Services > Credentials**.
2. Nhấp vào OAuth 2.0 Client ID của bạn.
3. Trong phần **Authorized redirect URIs**, thêm đường dẫn sau: `https://developers.google.com/oauthplayground`
4. Lưu lại thay đổi.
*(Lưu ý: Bạn cũng cần đảm bảo đã Enable "Google Calendar API" trong thư viện API)*

## Bước 2: Lấy Refresh Token qua Google OAuth2 Playground
1. Truy cập [Google OAuth2 Playground](https://developers.google.com/oauthplayground/).
2. Nhấp vào biểu tượng bánh răng ⚙️ (OAuth 2.0 configuration) ở góc trên bên phải.
3. Tích vào ô **"Use your own OAuth credentials"**.
4. Nhập `Client ID` và `Client secret` của bạn vào 2 ô tương ứng, sau đó đóng menu cài đặt.
5. Ở cột bên trái (Step 1), tìm đến phần **Google Calendar API v3**.
6. Mở rộng nó ra và chọn quyền (scope): `https://www.googleapis.com/auth/calendar.events`
7. Bấm nút **Authorize APIs**. Hệ thống sẽ chuyển hướng bạn đến trang đăng nhập Google. Hãy chọn tài khoản Google mà bạn muốn dùng để tạo phòng học Meet và cấp quyền.
8. Sau khi cấp quyền xong, bạn sẽ được đưa về lại Playground (chuyển sang Step 2).
9. Bấm nút **Exchange authorization code for tokens**.
10. Hệ thống sẽ trả về một bảng thông tin. Bạn hãy copy đoạn mã của **`refresh_token`**.

## Bước 3: Cấu hình biến môi trường (.env)
Mở file `.env` trong thư mục `studyhub-react-demo/backend/` và cập nhật các biến sau:

```env
GOOGLE_CLIENT_ID="Client ID của bạn"
GOOGLE_CLIENT_SECRET="Client Secret của bạn"
GOOGLE_REFRESH_TOKEN="Refresh token vừa copy ở Bước 2"

# Mặc định tạo sự kiện trên lịch chính của tài khoản
GOOGLE_CALENDAR_ID="primary"
GOOGLE_TIMEZONE="Asia/Ho_Chi_Minh"
```

---

> **Lưu ý quan trọng:**
> - Giải pháp này hoàn toàn miễn phí (giới hạn API của Google cho phép tạo hàng chục ngàn sự kiện mỗi tháng mà không tốn phí).
> - Mỗi khi có học viên đặt lịch, hệ thống sẽ tự động dùng Refresh Token để xin lại Access Token mới và tạo phòng Meet.
> - Nếu chưa cấu hình đủ 3 biến trên, hệ thống sẽ tự động sinh ra một link Meet mô phỏng (dummy link) để hệ thống không bị lỗi.
