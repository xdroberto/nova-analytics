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
      // A `__Secure-`-prefixed cookie can ONLY be cleared by a Set-Cookie that also
      // carries `Secure` — otherwise the browser REJECTS the deletion and the stale
      // prod cookie survives, re-triggering the /login<->/dashboard loop this route
      // exists to break. `cookies.delete(name)` omits Secure, so set an expired
      // cookie and match Secure to the name's prefix (dev is plain http, no prefix).
      response.cookies.set(cookie.name, "", {
        path: "/",
        maxAge: 0,
        secure: cookie.name.startsWith("__Secure-"),
      });
    }
  }
  return response;
}
