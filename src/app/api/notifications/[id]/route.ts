import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const updated = await prisma.notification.update({
            where: { id: resolvedParams.id },
            data: { isRead: true }
        });
        return NextResponse.json({ data: updated });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
}
