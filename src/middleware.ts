import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if ((pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && !pathname.startsWith('/admin/login') && !pathname.endsWith('/login') && !request.cookies.has('adventure_hub_admin')) {
    if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
