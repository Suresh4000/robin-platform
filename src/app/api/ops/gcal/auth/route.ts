import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { google } from 'googleapis';

export async function GET(request: Request) {
    try {
        const admins = await prisma.admin.findMany({ take: 1 });
        if (admins.length === 0) return NextResponse.json({ error: 'No admin found.' }, { status: 400 });

        const admin = admins[0];

        if (!admin.googleClientId || !admin.googleClientSecret) {
            return NextResponse.json({ error: 'OAuth credentials not set in settings.' }, { status: 400 });
        }

        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;
        const redirectUri = `${baseUrl}/api/ops/gcal/callback`;

        const oauth2Client = new google.auth.OAuth2(
            admin.googleClientId,
            admin.googleClientSecret,
            redirectUri
        );

        const scopes = [
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/userinfo.email',
        ];

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline', // Requests a refresh token
            scope: scopes,
            prompt: 'consent', // Force consent screen to ensure refresh token is returned
        });

        return NextResponse.redirect(authUrl);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
