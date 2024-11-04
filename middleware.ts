import { NextResponse } from 'next/server';

export default function middleware() {
  // const token = null;
  // if (!token) {
  //   const url = req.nextUrl.clone();
  //   url.pathname = '/sign-in';
  //   return NextResponse.redirect(url); // Use absolute URL
  // }

  

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!.+.[w]+$|_next).*)","/","/(api|trpc)(.*)"
  ],
};