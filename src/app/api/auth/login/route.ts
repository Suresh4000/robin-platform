import { NextResponse } from 'next/server';
import { signToken } from '@/shared/lib/jwt';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        // Check if system has any admins
        const adminCount = await prisma.admin.count();

        // First time setup: auto-create the admin if DB is completely raw
        if (adminCount === 0) {
            await prisma.admin.create({
                data: {
                    email: 'admin@rbos.com',
                    password: 'password123', // In real prod, this MUST be bcrypt hashed
                }
            });
        }

        // Verify against DB
        const adminUser = await prisma.admin.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!adminUser || adminUser.password !== password) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const token = await signToken({ email: adminUser.email, role: 'admin' });
        const cookieStore = await cookies();
        cookieStore.set('rbos_token', token, { httpOnly: true, path: '/' });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
