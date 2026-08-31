import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            where: {
                title: { contains: 'Discovery Call' }
            }
        });

        for (const ev of events) {
            await prisma.attendee.deleteMany({ where: { eventId: ev.id } });
            await prisma.event.delete({ where: { id: ev.id } });
        }

        return NextResponse.json({ success: true, count: events.length, events });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
