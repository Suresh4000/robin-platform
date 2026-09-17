import { google } from 'googleapis';
import { prisma } from './prisma';

export async function getCalendarAuth() {
    const admins = await (prisma as any).admin.findMany({ take: 1 });
    if (!admins.length) return null;
    const admin = admins[0];

    if (!admin.gcalClientEmail || !admin.gcalPrivateKey || !admin.gcalCalendarId) {
        return null;
    }

    // Google API requires newlines in the private key to be literal \n
    const privateKey = admin.gcalPrivateKey.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
        email: admin.gcalClientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/calendar.events']
    });

    return { auth, calendarId: admin.gcalCalendarId };
}

export async function createGoogleCalendarEvent(options: {
    leadEmail?: string;
    leadName?: string;
    description: string;
    subject: string;
    startDateObj: Date;
    durationMinutes: number;
}) {
    const creds = await getCalendarAuth();
    if (!creds) throw new Error('Google Calendar credentials not configured in Settings.');

    const calendar = google.calendar({ version: 'v3', auth: creds.auth });

    const endDate = new Date(options.startDateObj.getTime() + options.durationMinutes * 60000);

    const event = {
        summary: options.subject,
        description: options.description,
        start: {
            dateTime: options.startDateObj.toISOString(),
        },
        end: {
            dateTime: endDate.toISOString(),
        },
        attendees: options.leadEmail ? [{ email: options.leadEmail }] : [],
        // To natively generate a meet link we can request conference data
        conferenceData: {
            createRequest: {
                requestId: Math.random().toString(36).substring(7),
                conferenceSolutionKey: {
                    type: 'hangoutsMeet'
                }
            }
        }
    };

    const res = await calendar.events.insert({
        calendarId: creds.calendarId,
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all' // send email invite automatically via google!
    });

    return res.data;
}
