import { google } from 'googleapis';
import { prisma } from './prisma';

export async function createGoogleCalendarEvent(options: {
    integrationId: string;
    leadEmail: string;
    leadName: string;
    subject: string;
    description: string;
    startDateObj: Date;
    durationMinutes: number;
}) {
    const integration = await prisma.googleIntegration.findUnique({
        where: { id: options.integrationId },
        include: { admin: true }
    });

    if (!integration || !integration.admin.googleClientId || !integration.admin.googleClientSecret) {
        throw new Error("Invalid OAuth configuration");
    }

    const oauth2Client = new google.auth.OAuth2(
        integration.admin.googleClientId,
        integration.admin.googleClientSecret
    );
    oauth2Client.setCredentials({
        access_token: integration.accessToken,
        refresh_token: integration.refreshToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const endDate = new Date(options.startDateObj.getTime() + options.durationMinutes * 60000);

    const event = {
        summary: options.subject,
        description: options.description,
        start: { dateTime: options.startDateObj.toISOString() },
        end: { dateTime: endDate.toISOString() },
        attendees: [
            { email: options.leadEmail, displayName: options.leadName }
        ],
        conferenceData: {
            createRequest: {
                requestId: Math.random().toString(36).substring(7),
                conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
        }
    };

    const res = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: 1, // required for meet links
    });

    return {
        eventId: res.data.id,
        meetLink: res.data.hangoutLink,
        status: res.data.status,
    };
}
