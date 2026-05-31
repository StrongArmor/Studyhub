// Test script để kiểm tra Google Meet API
import { google } from 'googleapis';
import 'dotenv/config';

const testGoogleMeet = async () => {
  console.log('🔍 Kiểm tra Google Meet API Configuration...\n');

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  console.log('✓ Client ID:', clientId ? clientId.substring(0, 30) + '...' : '❌ MISSING');
  console.log('✓ Client Secret:', clientSecret ? '✅ Có' : '❌ MISSING');
  console.log('✓ Refresh Token:', refreshToken ? '✅ Có' : '❌ MISSING');

  if (!clientId || !clientSecret || !refreshToken) {
	console.log('\n❌ Thiếu credentials!');
	return;
  }

  try {
	console.log('\n📡 Đang kết nối với Google OAuth2...');
	const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
	oAuth2Client.setCredentials({ refresh_token: refreshToken });

	console.log('✅ OAuth2 Client tạo thành công');

	console.log('\n📡 Đang lấy Access Token...');
	const { token } = await oAuth2Client.getAccessToken();
	console.log('✅ Access Token:', token ? token.substring(0, 30) + '...' : '❌ Failed');

	console.log('\n📡 Đang kiểm tra Google Calendar API...');
	const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

	// Lấy danh sách events để test
	const events = await calendar.events.list({
	  calendarId: 'primary',
	  maxResults: 1,
	});

	console.log('✅ Google Calendar API hoạt động');
	console.log('   Events tìm được:', events.data.items?.length || 0);

	console.log('\n✅ TẤT CẢ KIỂM TRA THÀNH CÔNG!');
	console.log('\n💡 Nếu vẫn gặp lỗi "mã cuộc họp sai", hãy:');
	console.log('   1. Xóa .env file');
	console.log('   2. Lấy Refresh Token mới từ OAuth2 Playground');
	console.log('   3. Thêm vào .env');

  } catch (error) {
	console.log('\n❌ LỖI:', error.message);
	console.log('\n🔧 Cách khắc phục:');
	console.log('   1. Kiểm tra Refresh Token có hết hạn không');
	console.log('   2. Xóa file .env và lấy token mới');
	console.log('   3. Chắc chắn Google Calendar API đã enable');
  }
};

testGoogleMeet();
