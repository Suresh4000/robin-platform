import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { createBlogSchema } from '@/features/blog/schema';

export async function GET() {
    try {
        const items = await prisma.blogPost.findMany({
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
        const validatedData = createBlogSchema.parse(body);

        const newItem = await prisma.blogPost.create({
            data: {
                ...validatedData,
                publishedAt: validatedData.status === 'Published' ? new Date() : null,
            },
        });

        return NextResponse.json({ data: newItem }, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
            return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
        }
        return NextResponse.json(
            { error: 'Invalid data', details: error.errors || error.message },
            { status: 400 }
        );
    }
}
