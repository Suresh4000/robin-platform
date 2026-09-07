import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const media = await prisma.media.findUnique({ where: { id } });

        if (!media) {
            return new NextResponse('Not found', { status: 404 });
        }

        let base64 = media.data;
        if (base64.includes(',')) {
            base64 = base64.split(',')[1];
        }

        const buffer = Buffer.from(base64, 'base64');
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': media.type,
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        });
    } catch (e: any) {
        return new NextResponse('Internal error', { status: 500 });
    }
}
