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

        const events = await prisma.event.findMany({ select: { bannerImage: true } });
        const portfolios = await prisma.portfolioItem.findMany({ select: { coverImage: true } });
        const blogs = await prisma.blogPost.findMany({ select: { coverImage: true } });

        const usedUrls = new Set([
            ...events.map(e => e.bannerImage),
            ...portfolios.map(p => p.coverImage),
            ...blogs.map(b => b.coverImage)
        ].filter(Boolean));

        const usedUrlArray = Array.from(usedUrls);

        // Remove the base64 data for the list view
        const sanitizedMedia = media.map(m => {
            const mediaUrl = `/api/content/media/${m.id}/raw`;

            // Smart matching to handle remote URLs vs local seeded filenames (e.g. 1780964714422-removebg-preview.png vs ...1780964714422.png)
            const nameChunks = m.filename.split(/[\.\-_]/).filter(c => c.length > 4);
            const isUsed = usedUrlArray.some(url => {
                if (!url) return false;
                if (url.includes(mediaUrl) || url.includes(m.id)) return true;
                return nameChunks.some(chunk => url.includes(chunk));
            });
            return {
                id: m.id,
                filename: m.filename,
                type: m.type,
                size: m.size,
                isDeleted: m.isDeleted,
                createdAt: m.createdAt,
                url: mediaUrl,
                isUsedOnWebsite: isUsed
            };
        });

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
