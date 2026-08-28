import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { updatePortfolioItemSchema } from '@/features/portfolio/schema';

const prisma = new PrismaClient();

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const item = await prisma.portfolioItem.findUnique({
            where: { id: params.id }
        });
        if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        return NextResponse.json({ data: item });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to find item' }, { status: 500 });
    }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const body = await request.json();
        const validatedData = updatePortfolioItemSchema.parse(body);

        const dataToUpdate: any = { ...validatedData };
        if (validatedData.status === 'Published') {
            dataToUpdate.publishedAt = new Date();
        }

        const updatedItem = await prisma.portfolioItem.update({
            where: { id: params.id },
            data: dataToUpdate,
        });

        return NextResponse.json({ data: updatedItem });
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
            return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        await prisma.portfolioItem.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
