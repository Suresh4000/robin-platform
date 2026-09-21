import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { google } from 'googleapis';

export async function GET(request: Request) {
    try {
        const admins = await prisma.admin.findMany({
            include: { googleAccounts: true }
        });

        if (admins.length === 0) {
            return NextResponse.json({ data: [] });
        }

        const admin = admins[0];
        const integrations = admin.googleAccounts || [];

        if (integrations.length === 0 || !admin.googleClientId || !admin.googleClientSecret) {
            return NextResponse.json({ data: [] });
        }

        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;
        const redirectUri = `${baseUrl}/api/ops/gcal/callback`;

        const allGoogleEvents: any[] = [];

        // Loop through all integrated accounts to fetch their calendars
        for (const integration of integrations) {
            if (integration.accessToken === 'SHARED_NO_AUTH') continue;

            const oauth2Client = new google.auth.OAuth2(
                admin.googleClientId,
                admin.googleClientSecret,
                redirectUri
            );

            oauth2Client.setCredentials({
                access_token: integration.accessToken,
                refresh_token: integration.refreshToken,
                expiry_date: Number(integration.expiryDate) || undefined,
            });

            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            try {
                // Fetch primary calendar events from today onwards
                const now = new Date();
                now.setHours(0, 0, 0, 0);

                const response = await calendar.events.list({
                    calendarId: 'primary',
                    timeMin: now.toISOString(),
                    maxResults: 50,
                    singleEvents: true,
                    orderBy: 'startTime',
                });

                const events = response.data.items || [];

                events.forEach(event => {
                    const eventStart = event.start?.dateTime || event.start?.date;
                    if (eventStart) {
                        allGoogleEvents.push({
                            id: `gcal_${integration.id}_${event.id}`,
                            sourceEmail: integration.email,
                            type: 'Event',
                            title: event.summary || 'Busy',
                            date: eventStart,
                            status: 'Google Calendar'
                        });
                    }
                });
            } catch (err: any) {
                console.error(`Failed to fetch calendar for ${integration.email}:`, err.message);
                // Continue to the next account even if one fails
            }
        }

        return NextResponse.json({ data: allGoogleEvents });

    } catch (e: any) {
        console.error('Failed to fetch Google Calendar Events:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { accountId, summary, description, date, time } = body;

        if (!accountId || !date || !time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const admins = await prisma.admin.findMany({
            include: { googleAccounts: true }
        });
        if (admins.length === 0) return NextResponse.json({ error: 'No admin' }, { status: 400 });

        const admin = admins[0];
        const integration = admin.googleAccounts.find((acc: any) => acc.id === accountId);

        if (!integration || !admin.googleClientId || !admin.googleClientSecret) {
            return NextResponse.json({ error: 'OAuth credentials not set or account not found.' }, { status: 400 });
        }

        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;
        const redirectUri = `${baseUrl}/api/ops/gcal/callback`;

        const oauth2Client = new google.auth.OAuth2(
            admin.googleClientId,
            admin.googleClientSecret,
            redirectUri
        );

        oauth2Client.setCredentials({
            access_token: integration.accessToken,
            refresh_token: integration.refreshToken,
            expiry_date: integration.expiryDate ? Number(integration.expiryDate) : undefined,
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // Explicitly maintain local time formats and enforce Asia/Kolkata timezone
        // This prevents Node.js from silently slipping the Date object into UTC
        const tempStart = new Date(`${date}T${time}:00`);
        const tempEnd = new Date(tempStart.getTime() + 60 * 60 * 1000); // +1 hour

        // Format end time cleanly (YYYY-MM-DDTHH:mm:00)
        const endHH = tempEnd.getHours().toString().padStart(2, '0');
        const endMM = tempEnd.getMinutes().toString().padStart(2, '0');
        const endDD = tempEnd.getDate().toString().padStart(2, '0');
        const endMo = (tempEnd.getMonth() + 1).toString().padStart(2, '0');
        const endYYYY = tempEnd.getFullYear();
        const endStr = `${endYYYY}-${endMo}-${endDD}T${endHH}:${endMM}:00`;

        const newEvent = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: summary,
                description: description,
                start: { dateTime: `${date}T${time}:00`, timeZone: 'Asia/Kolkata' },
                end: { dateTime: endStr, timeZone: 'Asia/Kolkata' },
            },
        });

        return NextResponse.json({ data: newEvent.data }, { status: 201 });
    } catch (e: any) {
        console.error('Failed to create calendar event:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
