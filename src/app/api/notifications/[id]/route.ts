import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const id = params.id;
        const updated = await prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
        return NextResponse.json({ data: updated });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
}
