import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { updateProjectSchema } from '@/features/projects/schema';

const prisma = new PrismaClient();

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const project = await prisma.project.findUnique({
            where: { id: params.id },
            include: {
                client: true,
                tasks: { orderBy: { createdAt: 'desc' } },
                timeLogs: { orderBy: { date: 'desc' } }
            }
        });
        if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        return NextResponse.json({ data: project });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const body = await request.json();
        const validatedData = updateProjectSchema.parse(body);

        const updatedProject = await prisma.project.update({
            where: { id: params.id },
            data: validatedData,
        });

        return NextResponse.json({ data: updatedProject });
    } catch (error: any) {
        return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        await prisma.project.update({
            where: { id: params.id },
            data: { isDeleted: true }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
