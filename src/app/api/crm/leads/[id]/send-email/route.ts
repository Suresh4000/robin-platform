import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { sendNotificationEmail } from '@/shared/lib/email';
import { createGoogleCalendarEvent } from '@/shared/lib/gcal';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const body = await request.json();
        let { subject, message, meetLink, useNativeGcal, googleIntegrationId, meetingDateObj } = body;

        const lead = await prisma.lead.findUnique({
            where: { id: params.id }
        });

        if (!lead || !lead.email) {
            return NextResponse.json({ error: 'Lead not found or has no email address.' }, { status: 404 });
        }

        if (useNativeGcal && meetingDateObj && googleIntegrationId) {
            try {
                const gcalEvent = await createGoogleCalendarEvent({
                    integrationId: googleIntegrationId,
                    leadEmail: lead.email,
                    leadName: lead.name,
                    subject: subject,
                    description: message,
                    startDateObj: new Date(meetingDateObj),
                    durationMinutes: 30
                });
                if (gcalEvent.meetLink) {
                    meetLink = gcalEvent.meetLink;
                }
            } catch (err) {
                console.error("Google Calendar Native Sync Failed:", err);
            }
        }

        let emailContent = message;
        if (meetLink) {
            emailContent = emailContent.replace('[INSERT_CALENDAR_LINK_OR_PROPOSE_TIME]', meetLink);
        }

        // Build the HTML for the email
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #171b29;">
                <p style="white-space: pre-wrap;">${emailContent}</p>
                
                ${meetLink ? `
                <div style="margin: 32px 0; padding: 24px; background-color: #f1f3f7; border-radius: 8px; text-align: center;">
                    <p style="margin-bottom: 16px; font-weight: bold;">Google Meet Link</p>
                    <a href="${meetLink}" style="background-color: #0d8a6b; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Join Video Meeting</a>
                    <p style="margin-top: 16px; font-size: 13px; color: #5b6478;">Or copy the link directly: <br><a href="${meetLink}">${meetLink}</a></p>
                </div>
                ` : ''}
            </div>
        `;

        const success = await sendNotificationEmail(subject, htmlContent, [lead.email]);

        if (!success) {
            return NextResponse.json({ error: 'Failed to send email. Check SMTP credentials.' }, { status: 500 });
        }

        // Log this action securely in the database
        const logDate = new Date().toLocaleString();
        const divider = `\n\n--- System Log: Sent Email '${subject}' on ${logDate} ---\n`;
        const updatedNotes = (lead.notes || '') + divider + `Included Meet Link: ${meetLink || 'None'}`;

        await prisma.lead.update({
            where: { id: params.id },
            data: { notes: updatedNotes }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
    }
}
