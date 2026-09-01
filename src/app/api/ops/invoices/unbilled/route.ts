import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get('clientId');

        if (!clientId) {
            return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
        }

        const unbilledEntries = await prisma.timeEntry.findMany({
            where: {
                isBillable: true,
                invoiceId: null,
                project: {
                    clientId: clientId,
                    isDeleted: false
                }
            },
            include: {
                project: {
                    select: { title: true }
                }
            },
            orderBy: { date: 'asc' }
        });

        // Group by project (optional, but good for UI)
        return NextResponse.json({ data: unbilledEntries });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch unbilled time' }, { status: 500 });
    }
}
