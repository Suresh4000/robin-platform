import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { z } from 'zod';
import { sendNotificationEmail } from '@/shared/lib/email';

const createAttendeeSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    company: z.string().optional()
});

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const eventId = resolvedParams.id;

        // Ensure event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { _count: { select: { attendees: true } } }
        });
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        if (event._count.attendees >= event.capacity) {
            return NextResponse.json({ error: 'Event is at full capacity' }, { status: 400 });
        }

        const body = await request.json();
        const validatedData = createAttendeeSchema.parse(body);

        // Check if user already registered for this event
        const existingAttendee = await prisma.attendee.findFirst({
            where: { email: validatedData.email, eventId }
        });

        if (existingAttendee) {
            return NextResponse.json({ error: 'You are already registered for this event' }, { status: 400 });
        }

        const newAttendee = await prisma.attendee.create({
            data: {
                ...validatedData,
                eventId
            }
        });

        // Trigger Notification
        await prisma.notification.create({
            data: {
                title: 'New Event Registration',
                message: `${validatedData.name} registered for ${event.title}`,
                link: '/ops/events'
            }
        });

        // Send Email Notification
        const emailHTML = `
            <h2>New Event Registration</h2>
            <p><strong>Event:</strong> ${event.title}</p>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone || 'N/A'}</p>
            <p><strong>Company:</strong> ${validatedData.company || 'N/A'}</p>
        `;

        await sendNotificationEmail(
            `New Event Registration: ${validatedData.name}`,
            emailHTML
        );

        return NextResponse.json({ data: newAttendee }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Invalid submission data', details: error.errors || error.message },
            { status: 400 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const attendees = await prisma.attendee.findMany({
            where: { eventId: resolvedParams.id },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ data: attendees });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch attendees' }, { status: 500 });
    }
}
