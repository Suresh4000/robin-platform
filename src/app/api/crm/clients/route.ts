import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { createClientSchema } from '@/features/clients/schema';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isDeleted = searchParams.get('isDeleted') === 'true';

        const clients = await prisma.client.findMany({
            where: { isDeleted },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ data: clients });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = createClientSchema.parse(body);

        const newClient = await prisma.client.create({
            data: validatedData,
        });

        return NextResponse.json({ data: newClient }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Invalid data', details: error.errors || error.message },
            { status: 400 }
        );
    }
}
