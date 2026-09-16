import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { createLeadSchema } from '@/features/leads/schema';
import { sendNotificationEmail } from '@/shared/lib/email';


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

        await prisma.notification.create({
            data: {
                title: 'New Lead Inquiry',
                message: `${validatedData.name} has reached out via ${validatedData.source}`,
                link: '/crm/leads'
            }
        });

        // Send Email Notification
        const emailHTML = `
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
            emailHTML
        );

        return NextResponse.json({ data: newLead }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Invalid data', details: error.errors || error.message },
            { status: 400 }
        );
    }
}
