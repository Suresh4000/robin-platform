import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './shared/lib/jwt';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Paths that do not require authentication
    const isPublicRoute =
        pathname.startsWith('/api/public') ||
        pathname.startsWith('/api/crm/leads') ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/portfolio') ||
        pathname.startsWith('/blog') ||
        pathname.startsWith('/home') ||
        pathname.startsWith('/about') ||
        pathname.startsWith('/services') ||
        pathname.startsWith('/insights') ||
        pathname.startsWith('/events') ||
        pathname.startsWith('/contact') ||
        pathname === '/';

    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Check for JWT HTTP-only cookie
    const token = request.cookies.get('rbos_token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const verifiedPayload = await verifyToken(token);

    if (!verifiedPayload) {
        // Token is invalid or expired
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('rbos_token');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
