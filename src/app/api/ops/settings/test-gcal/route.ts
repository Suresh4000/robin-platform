import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { gcalClientEmail, gcalPrivateKey, gcalCalendarId } = body;

        if (!gcalClientEmail || !gcalPrivateKey || !gcalCalendarId) {
            return NextResponse.json({ success: false, error: 'All 3 fields are required.' }, { status: 400 });
        }

        const privateKey = gcalPrivateKey.replace(/\\n/g, '\n');

        const auth = new google.auth.JWT({
            email: gcalClientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly']
        });

        const calendar = google.calendar({ version: 'v3', auth });

        // Attempt to fetch the designated calendar
        await calendar.calendars.get({ calendarId: gcalCalendarId });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Test GCal Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to authenticate with Google Calendar.'
        }, { status: 500 });
    }
}
