import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const body = await request.json();
        const entry = await prisma.timeEntry.update({ where: { id: params.id }, data: body });
        return NextResponse.json({ data: entry });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        await prisma.timeEntry.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
