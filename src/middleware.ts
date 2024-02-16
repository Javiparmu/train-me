import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from '@/app/routes';
import NextAuth from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const getTrainerIp = (req: NextRequest) => {
  let trainerIp = req.ip ?? req.headers.get('x-real-ip');

  const forwardedFor = req.headers.get('x-forwarded-for');

  if (!trainerIp && forwardedFor) {
    trainerIp = forwardedFor.split(',').at(0) ?? 'Unknown';
  }

  return trainerIp ?? 'Unknown';
};

const { auth } = NextAuth({
  providers: [],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default auth((req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !req.auth?.code && !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(`/auth/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  const response = NextResponse.next();
  const trainerIp = getTrainerIp(req);

  if (trainerIp !== 'Unknown') {
    response.cookies.set('trainer-ip', trainerIp, {
      httpOnly: false,
    });
  }

  return response;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
