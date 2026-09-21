import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './shared/lib/jwt';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define protected route prefixes
    const isProtectedRoute =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/finance') ||
        pathname.startsWith('/content') ||
        pathname.startsWith('/crm') ||
        pathname.startsWith('/ops') ||
        pathname.startsWith('/settings') ||
        (pathname.startsWith('/api') && !(
            pathname.startsWith('/api/public') ||
            pathname.startsWith('/api/crm/leads') ||
            pathname.startsWith('/api/auth') ||
            pathname.startsWith('/api/content/media') ||
            pathname.startsWith('/api/chat')
        ));

    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    // Check for JWT HTTP-only cookie
    const token = request.cookies.get('rbos_token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    const verifiedPayload = await verifyToken(token);

    if (!verifiedPayload) {
        // Token is invalid or expired
        const response = NextResponse.redirect(new URL('/admin-login', request.url));
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
