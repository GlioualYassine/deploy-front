import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';
import axiosInstance from './lib/axiosInstance';

export default async function middleware(req) {
  const authTokens = req.cookies.get('authTokens');
  
  const isAuthenticated = await checkAuth(authTokens?.value);

  console.log(isAuthenticated);
  console.log('middleware');

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // Page d'accueil
    "/utilisateurs/:path*", // Page utilisateurs
    "/appareils/:path*", // Sous-routes des appareils
    "/automobiles/:path*", // Sous-routes des automobiles
    "/companies/:path*", // Sous-routes des entreprises
    "/notifications/:path*", // Notifications
    "/paiement/:path*", // Paiement
    "/tracking/:path*", // Tracking (sous-dossier components/Map inclus)
  ],
};


const checkAuth = async (token) => {
  try {
    const res = await axiosInstance.get('auth/check-auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Si la réponse est réussie, tu renvoies true.
    return true;
  } catch (err) {
    // En cas d'erreur (auth échouée), tu renvoies false.
    return false;
  }
};
