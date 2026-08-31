import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { createEventSchema } from '@/features/events/schema';

export async function GET() {
    try {
        const events = await prisma.event.findMany({ where: { type: { not: 'Discovery Call' } },
            include: {
                _count: { select: { attendees: true } }
            },
            orderBy: { date: 'asc' }
        });
        return NextResponse.json({ data: events });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = createEventSchema.parse(body);

        const newEvent = await prisma.event.create({
            data: validatedData,
        });

        return NextResponse.json({ data: newEvent }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Invalid data', details: error.errors || error.message },
            { status: 400 }
        );
    }
}
