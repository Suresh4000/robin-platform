import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET() {
    try {
        await prisma.lead.updateMany({
            where: { status: 'New Inquiry' },
            data: { status: 'New Lead' }
        });
        await prisma.lead.updateMany({
            where: { status: 'Discovery Scheduled' },
            data: { status: 'Meeting Scheduled' }
        });
        await prisma.lead.updateMany({
            where: { status: 'Discovery Completed' },
            data: { status: 'Proposal Sent' }
        });
        return NextResponse.json({ success: true, message: 'Leads migrated' });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
