import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/shared/lib/jwt';
import { logActivity } from '@/shared/lib/audit';

export async function GET() {
    try {
        const adminUsers = await prisma.admin.findMany({
            include: { googleAccounts: true }
        });
        if (adminUsers.length === 0) return NextResponse.json({});
        const admin = adminUsers[0];
        return NextResponse.json({
            googleClientId: admin.googleClientId || '',
            googleClientSecret: admin.googleClientSecret || '',
            googleAccounts: (admin.googleAccounts || []).map((acc: any) => ({
                ...acc,
                expiryDate: acc.expiryDate ? Number(acc.expiryDate) : null
            }))
        });
    } catch {
        return NextResponse.json({});
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
        const admins = await prisma.admin.findMany({ take: 1 });
        if (admins.length > 0) {
            await prisma.admin.update({
                where: { id: admins[0].id },
                data: {
                    googleClientId: typeof body.googleClientId === 'string' ? body.googleClientId.replace(/^https?:\/\//, '').trim() : body.googleClientId,
                    googleClientSecret: typeof body.googleClientSecret === 'string' ? body.googleClientSecret.trim() : body.googleClientSecret,
                }
            });

            await logActivity("UPDATE", "Settings", admins[0].id, {
                title: "Google OAuth Client Credentials",
                message: "Updated Global OAuth integration settings"
            });

            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'No admin found' }, { status: 404 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
