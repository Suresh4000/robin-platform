import { NextResponse } from 'next/server';
import { signToken } from '@/shared/lib/jwt';
import { cookies } from 'next/headers';


export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        // HARDCODED BYPASS FOR VERCEL (Since SQLite cannot be written to in Serverless)
        if (email.toLowerCase() === 'admin@rbos.com' && password === 'password123') {
            const token = await signToken({ email: 'admin@rbos.com', role: 'admin' });
            const cookieStore = await cookies();
            cookieStore.set('rbos_token', token, { httpOnly: true, path: '/' });
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: `Internal server error: ${(err as Error).message}` }, { status: 500 });
    }
}
