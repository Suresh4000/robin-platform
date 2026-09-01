import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const body = await request.json();

        // Allow status and isDeleted updates
        if (body.status === undefined && body.isDeleted === undefined) {
            return NextResponse.json({ error: 'Status or isDeleted is required' }, { status: 400 });
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id: params.id },
            data: {
                ...(body.status !== undefined && { status: body.status }),
                ...(body.isDeleted !== undefined && { isDeleted: body.isDeleted })
            },
        });

        return NextResponse.json({ data: updatedInvoice });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update invoice', details: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const { searchParams } = new URL(request.url);
        const hardDelete = searchParams.get('hardDelete') === 'true';

        if (hardDelete) {
            await prisma.$transaction(async (tx) => {
                await tx.timeEntry.updateMany({
                    where: { invoiceId: params.id },
                    data: { invoiceId: null }
                });
                await tx.invoice.delete({
                    where: { id: params.id },
                });
            });
        } else {
            await prisma.invoice.update({
                where: { id: params.id },
                data: { isDeleted: true }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to void/delete invoice' }, { status: 500 });
    }
}
