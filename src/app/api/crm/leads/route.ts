import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { createLeadSchema } from '@/features/leads/schema';
import { sendNotificationEmail } from '@/shared/lib/email';
import { logActivity } from '@/shared/lib/audit';


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isDeleted = searchParams.get('isDeleted') === 'true';

        const leads = await prisma.lead.findMany({
            where: { isDeleted },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ data: leads });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = createLeadSchema.parse(body);

        const newLead = await prisma.lead.create({
            data: validatedData,
        });

        await logActivity("CREATE", "Lead", newLead.id, {
            name: validatedData.name,
            email: validatedData.email,
            status: validatedData.status,
            message: `Captured a new lead enquiry from ${validatedData.name}`
        });

        await prisma.notification.create({
            data: {
                title: 'New Lead Inquiry',
                message: `${validatedData.name} has reached out via ${validatedData.source}`,
                link: '/crm/leads'
            }
        });

        // Send Internal Email Notification to Admins
        const adminEmailHTML = `
            <h2>New Entry received via ${validatedData.source}</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone || 'N/A'}</p>
            <p><strong>Company:</strong> ${validatedData.company || 'N/A'}</p>
            <h3>Notes:</h3>
            <pre style="font-family: inherit; white-space: pre-wrap;">${validatedData.notes}</pre>
        `;

        await sendNotificationEmail(
            `New Lead Inquiry: ${validatedData.name}`,
            adminEmailHTML
        );

        // Send Auto-Response Thank You Email to the Lead
        if (validatedData.email) {
            const leadThankYouHTML = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #171b29;">
                    <p>Hi ${validatedData.name.split(' ')[0]},</p>
                    <p>Thank you for reaching out to the Robin Business Hub! Your inquiry has been successfully received.</p>
                    <p>I am currently reviewing your information and will personally get back to you shortly to discuss how we might build a robust growth engine for your team.</p>
                    <div style="margin: 32px 0; padding: 24px; background-color: #f1f3f7; border-radius: 8px;">
                        <p style="margin-bottom: 0; font-weight: bold; color: #517352;">What to expect next?</p>
                        <p style="margin-top: 8px; font-size: 14px; color: #5b6478;">I will evaluate your notes and reach out with an invitation for an initial discovery call so we can align on your specific friction points.</p>
                    </div>
                    <p>Best regards,<br>Robin Jones</p>
                </div>
            `;
            await sendNotificationEmail(
                `Thank you for reaching out! - Robin Jones`,
                leadThankYouHTML,
                [validatedData.email]
            );
        }

        return NextResponse.json({ data: newLead }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Invalid data', details: error.errors || error.message },
            { status: 400 }
        );
    }
}
