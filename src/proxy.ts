import { NextResponse } from "next/server";

import { auth } from "@/auth";

const protectedRoutePrefixes = ["/dashboard", "/admin", "/companies"] as const;

const guestOnlyRoutes = new Set(["/login", "/register"]);

function matchesRoutePrefix(pathname: string, routePrefix: string): boolean {
  return pathname === routePrefix || pathname.startsWith(`${routePrefix}/`);
}

export const proxy = auth((request) => {
  const pathname = request.nextUrl.pathname;

  const hasActiveSession = Boolean(request.auth?.user && request.auth.user.isActive);

  const isProtectedRoute = protectedRoutePrefixes.some((routePrefix) =>
    matchesRoutePrefix(pathname, routePrefix),
  );

  const isGuestOnlyRoute = guestOnlyRoutes.has(pathname);

  if (isProtectedRoute && !hasActiveSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isGuestOnlyRoute && hasActiveSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/admin/:path*", "/companies/:path*"],
};
