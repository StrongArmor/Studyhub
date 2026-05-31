// Test tạo Google Meet event
import { google } from 'googleapis';
import 'dotenv/config';

const testCreateMeetEvent = async () => {
  console.log('🧪 Test Tạo Google Meet Event\n');

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  try {
	const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
	oAuth2Client.setCredentials({ refresh_token: refreshToken });

	const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

	// Tạo event với Google Meet
	const event = {
	  summary: 'Test Google Meet Event',
	  description: 'Test tạo phòng Meet',
	  start: {
		dateTime: new Date(Date.now() + 3600000).toISOString(), // 1 giờ từ giờ
		timeZone: 'Asia/Ho_Chi_Minh',
	  },
	  end: {
		dateTime: new Date(Date.now() + 7200000).toISOString(), // 2 giờ từ giờ
		timeZone: 'Asia/Ho_Chi_Minh',
	  },
	  conferenceData: {
		createRequest: {
		  requestId: `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		  conferenceSolutionKey: { type: 'hangoutsMeet' },
		},
	  },
	  guestCanModify: false,
	  guestCanInviteOthers: true,
	  guestCanSeeOtherGuests: true,
	};

	console.log('📡 Đang tạo Google Meet event...\n');
	console.log('Event config:', JSON.stringify(event, null, 2));

	const response = await calendar.events.insert({
	  calendarId: 'primary',
	  resource: event,
	  conferenceDataVersion: 1,
	  sendUpdates: 'none',
	});

	console.log('\n✅ Event tạo thành công!\n');
	console.log('Event ID:', response.data.id);
	console.log('Event Link:', response.data.htmlLink);
	console.log('\nConference Data:', JSON.stringify(response.data.conferenceData, null, 2));

	const meetLink = response.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri || response.data.hangoutLink;
	console.log('\n🎥 Google Meet Link:', meetLink);

	if (meetLink) {
	  console.log('\n✅ Google Meet link tạo thành công!');
	} else {
	  console.log('\n❌ LỖI: Không lấy được Meet link!');
	  console.log('Response data:', JSON.stringify(response.data, null, 2));
	}

  } catch (error) {
	console.log('❌ LỖI:', error.message);
	console.log('\nFull Error:', error);
  }
};

testCreateMeetEvent();
