import { type NextRequest, NextResponse } from "next/server";

import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic session check at the edge (Next 16 proxy, formerly middleware).
 * Only inspects the session cookie's presence — the authoritative check runs
 * server-side in the dashboard layout via auth.api.getSession().
 */
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (!sessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard/default", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // ALLOW-LIST: only these paths run the edge check, so every protected route MUST
  // live under /dashboard/* (guarded here + by the dashboard layout's authoritative
  // getSession). A protected route added OUTSIDE /dashboard/* without listing it here
  // is silently PUBLIC — this bit us once (orphaned /chat + /mail served the app shell
  // to anonymous visitors until deleted; regression-pinned in e2e/security.spec.ts).
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
