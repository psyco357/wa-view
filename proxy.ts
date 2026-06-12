import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy untuk proteksi routes yang memerlukan authentication
 * Menggunakan konvensi proxy.ts (deprecation dari middleware.ts)
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes yang memerlukan authentication
  const protectedRoutes = [
    '/admin',
    '/chat',
    '/dashboard',
    '/daftar-kendaraan',
    '/import-kendaraan',
    '/reports',
  ];

  // Cek apakah route ini memerlukan auth
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Cek token dari cookie atau localStorage (untuk API calls, cek header)
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      // Redirect ke login
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect admin routes
    '/admin/:path*',
    // Protect chat route
    '/chat/:path*',
    // Protect dashboard
    '/dashboard/:path*',
    // Protect kendaraan routes
    '/daftar-kendaraan/:path*',
    '/import-kendaraan/:path*',
    '/reports/:path*',
    // API routes
    '/api/proxy/:path*',
  ],
};
