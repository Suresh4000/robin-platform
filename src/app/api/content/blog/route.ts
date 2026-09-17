import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { createBlogSchema } from '@/features/blog/schema';

export async function GET() {
    try {
        // LAZY EXECUTOR: Auto-publish any scheduled drafts whose time has arrived!
        await prisma.blogPost.updateMany({
            where: {
                status: 'Draft',
                publishedAt: { lte: new Date() } // Published at is strictly in the past
            },
            data: {
                status: 'Published'
            }
        });

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

        let finalPublishedAt = null;
        if (validatedData.status === 'Published') {
            finalPublishedAt = new Date();
        } else if (validatedData.publishedAt) {
            // User supplied a specific date for auto-publishing
            finalPublishedAt = new Date(validatedData.publishedAt);
        }

        const dataToSave = { ...validatedData };
        delete dataToSave.publishedAt; // handled manually

        const newItem = await prisma.blogPost.create({
            data: {
                ...dataToSave,
                publishedAt: finalPublishedAt,
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
