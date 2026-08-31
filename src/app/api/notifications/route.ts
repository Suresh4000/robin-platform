import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET() {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        return NextResponse.json({ data: notifications });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await prisma.notification.deleteMany({});
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to clear notifications' }, { status: 500 });
    }
}
