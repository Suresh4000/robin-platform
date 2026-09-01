import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const body = await request.json();

        // Only allow status updates for now
        if (!body.status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id: params.id },
            data: { status: body.status },
        });

        return NextResponse.json({ data: updatedInvoice });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update invoice', details: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        await prisma.$transaction(async (tx) => {
            // First unlink all time entries
            await tx.timeEntry.updateMany({
                where: { invoiceId: params.id },
                data: { invoiceId: null }
            });

            // Then delete the invoice
            await tx.invoice.delete({
                where: { id: params.id },
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to void/delete invoice' }, { status: 500 });
    }
}
