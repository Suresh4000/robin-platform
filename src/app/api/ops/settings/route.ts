import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/shared/lib/jwt';

export async function GET() {
    try {
        const adminUsers = await (prisma as any).admin.findMany();
        if (adminUsers.length === 0) return NextResponse.json({ schedulingUrl: '' });
        return NextResponse.json({ schedulingUrl: adminUsers[0].schedulingUrl || '' });
    } catch {
        return NextResponse.json({ schedulingUrl: '' });
    }
}

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('rbos_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const sessionPayload = await verifyToken(token);
        if (!sessionPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        // Update the first admin user (since it's a single tenant system)
        const admins = await (prisma as any).admin.findMany({ take: 1 });
        if (admins.length > 0) {
            await (prisma as any).admin.update({
                where: { id: admins[0].id },
                data: { schedulingUrl: body.schedulingUrl }
            });
            return NextResponse.json({ success: true, schedulingUrl: body.schedulingUrl });
        }

        return NextResponse.json({ success: false });
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
