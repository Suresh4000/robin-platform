import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/shared/lib/jwt';
import { logActivity } from '@/shared/lib/audit';

export async function DELETE(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('rbos_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const sessionPayload = await verifyToken(token);
        if (!sessionPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Integration ID is required' }, { status: 400 });
        }

        const admins = await prisma.admin.findMany({ take: 1 });
        if (admins.length > 0) {
            const admin = admins[0];

            const integration = await prisma.googleIntegration.findUnique({
                where: { id: id }
            });

            if (integration) {
                await prisma.googleIntegration.delete({
                    where: { id: id }
                });

                await logActivity("DELETE", "Calendar", admin.id, {
                    title: "Removed Shared Calendar",
                    message: `Removed shared calendar: ${integration.email}`
                });
            }

            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'No admin found' }, { status: 404 });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
