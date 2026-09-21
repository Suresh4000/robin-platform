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
