import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { createLeadSchema } from '@/features/leads/schema';


export async function GET() {
    try {
        const leads = await prisma.lead.findMany({
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

        return NextResponse.json({ data: newLead }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Invalid data', details: error.errors || error.message },
            { status: 400 }
        );
    }
}
