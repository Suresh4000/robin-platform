import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { createProjectSchema } from '@/features/projects/schema';

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                client: {
                    select: { name: true, company: true }
                },
                _count: {
                    select: { tasks: true, timeLogs: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ data: projects });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = createProjectSchema.parse(body);

        const newProject = await prisma.project.create({
            data: validatedData,
            include: {
                client: { select: { name: true } }
            }
        });

        return NextResponse.json({ data: newProject }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Invalid data', details: error.errors || error.message },
            { status: 400 }
        );
    }
}
