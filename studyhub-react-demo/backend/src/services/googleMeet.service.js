import { google } from 'googleapis';

const getAuth = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2Client.setCredentials({ refresh_token: refreshToken });
  return oAuth2Client;
};

export const createGoogleMeetEvent = async ({ summary, description, startDateTime, endDateTime, attendees = [] }) => {
  const auth = getAuth();
  if (!auth) {
    return null;
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary,
    description,
    start: { dateTime: startDateTime, timeZone: process.env.GOOGLE_TIMEZONE || 'Asia/Ho_Chi_Minh' },
    end: { dateTime: endDateTime, timeZone: process.env.GOOGLE_TIMEZONE || 'Asia/Ho_Chi_Minh' },
    conferenceData: {
      createRequest: {
        requestId: `studyhub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    // Không yêu cầu attendees - ai có link cũng vào được
    guestCanModify: false,
    guestCanInviteOthers: true,
    guestCanSeeOtherGuests: true,
  };

  // Thêm attendees nếu có, nhưng không bắt buộc
  if (attendees && attendees.length > 0) {
    event.attendees = attendees.map((email) => ({ email }));
  }

  const response = await calendar.events.insert({
    calendarId,
    resource: event,
    conferenceDataVersion: 1,
    sendUpdates: attendees && attendees.length > 0 ? 'all' : 'none',
  });

  // Log để debug
  console.log('Google Meet Response:', {
    conferenceData: response.data.conferenceData,
    hangoutLink: response.data.hangoutLink,
    eventId: response.data.id,
  });

  const meetLink = response.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri || response.data.hangoutLink || null;

  return {
    eventId: response.data.id,
    meetLink,
    htmlLink: response.data.htmlLink,
  };
};

export const isGoogleMeetConfigured = () => {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
};
