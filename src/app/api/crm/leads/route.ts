import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { createLeadSchema } from '@/features/leads/schema';


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isDeleted = searchParams.get('isDeleted') === 'true';

        const leads = await prisma.lead.findMany({
            where: { isDeleted },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ data: leads });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = createLeadSchema.parse(body);

        const newLead = await prisma.lead.create({
            data: validatedData,
        });

        await prisma.notification.create({
            data: {
                title: 'New Lead Inquiry',
                message: `${validatedData.name} has reached out via ${validatedData.source}`,
                link: '/crm/leads'
            }
        });

        return NextResponse.json({ data: newLead }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Invalid data', details: error.errors || error.message },
            { status: 400 }
        );
    }
}
