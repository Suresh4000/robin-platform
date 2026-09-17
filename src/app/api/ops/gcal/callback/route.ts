import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { google } from 'googleapis';
import { logActivity } from '@/shared/lib/audit';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
            return NextResponse.redirect(new URL('/settings', request.url));
        }

        if (!code) {
            return NextResponse.json({ error: 'No authorization code found.' }, { status: 400 });
        }

        const admins = await prisma.admin.findMany({ take: 1 });
        if (admins.length === 0) return NextResponse.json({ error: 'No admin found.' }, { status: 400 });
        const admin = admins[0];

        if (!admin.googleClientId || !admin.googleClientSecret) {
            return NextResponse.json({ error: 'OAuth credentials not set.' }, { status: 400 });
        }

        const baseUrl = `${url.protocol}//${url.host}`;
        const redirectUri = `${baseUrl}/api/ops/gcal/callback`;

        const oauth2Client = new google.auth.OAuth2(
            admin.googleClientId,
            admin.googleClientSecret,
            redirectUri
        );

        // Exchange authorization code for access token
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Get the user's email address
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();
        const email = userInfo.data.email;

        if (!email) {
            return NextResponse.json({ error: 'Failed to fetch user email.' }, { status: 400 });
        }

        // Save to Database
        // Upsert based on email
        const existingIntegration = await prisma.googleIntegration.findFirst({
            where: { email: email }
        });

        if (existingIntegration) {
            await prisma.googleIntegration.update({
                where: { id: existingIntegration.id },
                data: {
                    accessToken: tokens.access_token || existingIntegration.accessToken,
                    refreshToken: tokens.refresh_token || existingIntegration.refreshToken,
                    expiryDate: tokens.expiry_date || existingIntegration.expiryDate,
                }
            });
            await logActivity("UPDATE", "Settings", existingIntegration.id, {
                title: "Google Calendar",
                message: `Re-authorized connection to Google account ${email}`
            });
        } else {
            const newAcc = await prisma.googleIntegration.create({
                data: {
                    adminId: admin.id,
                    email: email,
                    accessToken: tokens.access_token!,
                    refreshToken: tokens.refresh_token,
                    expiryDate: tokens.expiry_date,
                }
            });
            await logActivity("CREATE", "Settings", newAcc.id, {
                title: "Google Calendar",
                message: `Connected new Google Account: ${email}`
            });
        }

        return NextResponse.redirect(new URL('/settings', request.url));
    } catch (e: any) {
        console.error('OAuth Callback Error:', e);
        return NextResponse.redirect(new URL('/settings?oauth_error=failed', request.url));
    }
}
