import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { createTaskSchema } from '@/features/tasks/schema';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const isDeleted = searchParams.get('isDeleted');

    try {
        const whereClause: any = {};
        if (projectId) whereClause.projectId = projectId;
        whereClause.isDeleted = isDeleted === 'true';

        const tasks = await prisma.task.findMany({
            where: whereClause,
            include: {
                project: { select: { title: true, client: { select: { name: true } } } }
            },
            orderBy: { dueDate: 'asc' }
        });
        return NextResponse.json({ data: tasks });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = createTaskSchema.parse(body);

        const newTask = await prisma.task.create({
            data: validatedData,
            include: {
                project: { select: { title: true } }
            }
        });

        return NextResponse.json({ data: newTask }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Invalid data', details: error.errors || error.message },
            { status: 400 }
        );
    }
}
