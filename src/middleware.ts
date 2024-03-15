import NextAuth from 'next-auth';
import {
  DEFAULT_LOGIN_REDIRECT,
  adminEmail,
  adminLoginRedirect,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from './app/routes';

const { auth } = NextAuth({
  providers: [],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default auth((req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !req.auth?.code && !!req.auth;
  const isAdmin = req.auth?.user?.email === adminEmail;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (isAdmin) {
        return Response.redirect(new URL(adminLoginRedirect, nextUrl));
      }

      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return null;
  }

  if (isLoggedIn && isAdmin && !isAdminRoute) {
    return Response.redirect(new URL(adminLoginRedirect, nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(`/auth/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  return null;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
