import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET(request: Request) {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        return NextResponse.json({ data: notifications });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const notification = await prisma.notification.create({
            data: {
                title: body.title,
                message: body.message,
                link: body.link || null,
            }
        });
        return NextResponse.json({ data: notification });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await prisma.notification.deleteMany(); // Clear all notifications
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete notifications' }, { status: 500 });
    }
}
