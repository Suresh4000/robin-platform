import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { updateClientSchema } from '@/features/clients/schema';

const prisma = new PrismaClient();

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const client = await prisma.client.findUnique({
            where: { id: params.id },
            include: {
                projects: true,
                invoices: true,
            }
        });
        if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        return NextResponse.json({ data: client });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to find client' }, { status: 500 });
    }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const body = await request.json();
        const validatedData = updateClientSchema.parse(body);

        const updatedClient = await prisma.client.update({
            where: { id: params.id },
            data: validatedData,
        });

        return NextResponse.json({ data: updatedClient });
    } catch (error: any) {
        return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        await prisma.client.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
    }
}
