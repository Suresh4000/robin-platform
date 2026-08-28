import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const createSchema = z.object({
    description: z.string().min(1),
    hours: z.number().positive(),
    isBillable: z.boolean().default(true),
    date: z.string(),
    projectId: z.string().min(1),
    invoiceId: z.string().optional(),
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    try {
        const entries = await prisma.timeEntry.findMany({
            where: projectId ? { projectId } : undefined,
            include: { project: { select: { title: true } } },
            orderBy: { date: 'desc' },
        });
        return NextResponse.json({ data: entries });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch time entries' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = createSchema.parse({ ...body, date: body.date || new Date().toISOString() });
        const entry = await prisma.timeEntry.create({ data: { ...data, date: new Date(data.date) } });
        return NextResponse.json({ data: entry }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: 'Invalid data', details: e.errors || e.message }, { status: 400 });
    }
}
