//src/middleware/authMiddleware.ts
import { NextResponse, type NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/profile', '/settings', '/logintestpage'];


export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get('accessToken')?.value;
    const {pathname} = req.nextUrl;

    // Admin route check - only allow access if token is 'admin-token'
    if(pathname.startsWith('/admin')){
        if(accessToken !== 'admin-token'){
            return new NextResponse('Forbidden', {status: 403});
        }
    }

    // ReRoute to login if trying to access protected route without token
    if (protectedPaths.some(path => pathname.startsWith(path)) && !accessToken) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Rewrite to maintenance page if in maintenance mode
    if(pathname.startsWith('/dashboard') && process.env.MAINTENANCE_MODE === 'true'){
        return NextResponse.rewrite(new URL('/maintenance', req.url));
    }

    //todo : validate access token and refresh if needed
    return NextResponse.next();
};

const config = {
    matcher: protectedPaths.flatMap(path => [path, `${path}/:path*`]),
};
export { config };