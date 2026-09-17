import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.googleIntegration.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
