import { NextResponse, NextRequest } from 'next/server';
import { checkAuth, getUserRole, adminRoutes, nonAdminRoutes } from './authUtils';

export async function middleware(req) {
  const authTokens = req.cookies.get('authTokens')?.value;
  
  if (!authTokens) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const isAuthenticated = await checkAuth(authTokens);

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const role = await getUserRole(authTokens);
  const isAdmin = role === 'ROLE_GENERAL_ADMIN';
  const allowedRoutes = role === 'ROLE_GENERAL_ADMIN' ? adminRoutes : nonAdminRoutes;

  if (!isAdmin && req.nextUrl.pathname === '/appareils/create') {
    return NextResponse.redirect(new URL('/not-authorized', req.url));
  }

  if (!isAdmin && req.nextUrl.pathname === '/paiement/create') {
    return NextResponse.redirect(new URL('/not-authorized', req.url));
  }

  const pathMatched = allowedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (!pathMatched) {
    return NextResponse.redirect(new URL('/not-authorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/utilisateurs/:path*",
    "/appareils/:path*",
    "/automobiles/:path*",
    "/companies/:path*",
    "/notifications/:path*",
    "/paiement/:path*",
    "/tracking/:path*",
    "/rapports/:path*"
  ],
};

