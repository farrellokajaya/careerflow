import { NextResponse } from "next/server";

import { auth } from "@/auth";

const GUEST_ONLY_ROUTES = ["/login", "/register"];
const PROTECTED_ROUTES = ["/dashboard", "/admin"];

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export default auth((request) => {
  const pathname = request.nextUrl.pathname;

  const isAuthenticated = Boolean(request.auth?.user?.id) && request.auth?.user?.isActive === true;

  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.some((route) => matchesRoute(pathname, route));

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => matchesRoute(pathname, route));

  if (isGuestOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/admin/:path*"],
};
