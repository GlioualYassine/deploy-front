import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';

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
    "/","/utilisateurs"
  ],
};

const checkAuth = async (token) => {
  try {
    const res = await axios.get('http://localhost:8080/api/v1/auth/check-auth', {
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
