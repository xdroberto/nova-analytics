import { type NextRequest, NextResponse } from "next/server";

/**
 * Clears stale Better Auth cookies — present in the browser but no longer
 * backed by a valid server-side session (DB reset, revocation, secret rotation).
 *
 * Server Components cannot modify cookies, so the dashboard layout redirects
 * here when its authoritative session check fails. Without this hop, the
 * proxy's optimistic cookie check and the layout's server check would bounce
 * the request between /login and /dashboard forever (ERR_TOO_MANY_REDIRECTS).
 */
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  for (const cookie of request.cookies.getAll()) {
    // Covers both "better-auth.*" and the "__Secure-better-auth.*" prod variants.
    if (cookie.name.includes("better-auth")) {
      response.cookies.delete(cookie.name);
    }
  }
  return response;
}
