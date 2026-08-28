import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { updateTaskSchema } from '@/features/tasks/schema';

const prisma = new PrismaClient();

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const body = await request.json();
        const validatedData = updateTaskSchema.parse(body);

        const updatedTask = await prisma.task.update({
            where: { id: params.id },
            data: validatedData,
        });

        return NextResponse.json({ data: updatedTask });
    } catch (error: any) {
        return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        await prisma.task.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}
