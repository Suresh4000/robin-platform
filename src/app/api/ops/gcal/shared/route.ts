import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/shared/lib/jwt';
import { logActivity } from '@/shared/lib/audit';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('rbos_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const sessionPayload = await verifyToken(token);
        if (!sessionPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const admins = await prisma.admin.findMany({ take: 1 });
        if (admins.length > 0) {
            const admin = admins[0];

            await prisma.googleIntegration.create({
                data: {
                    adminId: admin.id,
                    email: email,
                    accessToken: 'SHARED_NO_AUTH', // Dummy token for zero-auth share
                    refreshToken: null,
                    expiryDate: null
                }
            });

            await logActivity("CREATE", "Calendar", admin.id, {
                title: "Added Shared Calendar",
                message: `Added shared calendar: ${email}`
            });

            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'No admin found' }, { status: 404 });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
