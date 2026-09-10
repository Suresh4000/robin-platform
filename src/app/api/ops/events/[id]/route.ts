import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { updateEventSchema } from '@/features/events/schema';

const prisma = new PrismaClient();

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const event = await prisma.event.findUnique({
            where: { id: params.id },
            include: { attendees: true }
        });
        if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        return NextResponse.json({ data: event });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to find event' }, { status: 500 });
    }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const body = await request.json();
        const validatedData = updateEventSchema.parse(body);

        const updatedEvent = await prisma.event.update({
            where: { id: params.id },
            data: validatedData,
        });

        return NextResponse.json({ data: updatedEvent });
    } catch (error: any) {
        return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        await prisma.event.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
