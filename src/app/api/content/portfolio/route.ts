import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createPortfolioItemSchema } from '@/features/portfolio/schema';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const items = await prisma.portfolioItem.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ data: items });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = createPortfolioItemSchema.parse(body);

        const newItem = await prisma.portfolioItem.create({
            data: {
                ...validatedData,
                publishedAt: validatedData.status === 'Published' ? new Date() : null,
            },
        });

        return NextResponse.json({ data: newItem }, { status: 201 });
    } catch (error: any) {
        // Check for unique constraint on slug
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
            return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
        }
        return NextResponse.json(
            { error: 'Invalid data', details: error.errors || error.message },
            { status: 400 }
        );
    }
}
