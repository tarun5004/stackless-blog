/**
 * Auth Middleware — protects /admin routes.
 *
 * All routes under /admin/* (except /admin/login) require an
 * authenticated session. Unauthenticated requests are redirected
 * to /admin/login.
 *
 * NextAuth v5 provides the `auth` export which acts as middleware.
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow login page and auth API routes without auth
  if (pathname === "/admin/login" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  // Only run middleware on admin routes and auth API
  matcher: ["/admin/:path*", "/api/auth/:path*"],
};
