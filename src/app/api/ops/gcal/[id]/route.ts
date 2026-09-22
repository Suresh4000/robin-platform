import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        await prisma.googleIntegration.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
