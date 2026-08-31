import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { updateLeadSchema } from '@/features/leads/schema';

const prisma = new PrismaClient();

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const body = await request.json();
        const validatedData = updateLeadSchema.parse(body);

        const oldLead = await prisma.lead.findUnique({ where: { id: params.id } });
        if (!oldLead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        const updatedLead = await prisma.lead.update({
            where: { id: params.id },
            data: validatedData,
        });

        // Removed Discovery Call event creation logic as Discovery Calls form part of Lead management.

        return NextResponse.json({ data: updatedLead });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        await prisma.lead.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
    }
}
