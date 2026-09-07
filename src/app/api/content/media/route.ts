import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const viewDeleted = searchParams.get('viewDeleted') === 'true';

        const media = await prisma.media.findMany({
            where: { isDeleted: viewDeleted },
            orderBy: { createdAt: 'desc' }
        });

        // Remove the base64 data for the list view
        const sanitizedMedia = media.map(m => ({
            id: m.id,
            filename: m.filename,
            type: m.type,
            size: m.size,
            isDeleted: m.isDeleted,
            createdAt: m.createdAt,
            url: `/api/content/media/${m.id}/raw`
        }));

        return NextResponse.json(sanitizedMedia);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { filename, type, size, data: base64Data } = data;

        const media = await prisma.media.create({
            data: {
                filename,
                type,
                size,
                data: base64Data
            }
        });
        return NextResponse.json({ success: true, id: media.id, url: `/api/content/media/${media.id}/raw` });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
