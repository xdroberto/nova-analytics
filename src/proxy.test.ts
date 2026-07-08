import { NextRequest } from "next/server";

import { describe, expect, it } from "vitest";

import { proxy } from "./proxy";

// Dev/e2e cookie name; the proxy only checks presence, never validity — the
// authoritative check lives in the dashboard layout (see e2e/security.spec.ts).
const SESSION_COOKIE = "better-auth.session_token=any-value-presence-only";

function request(path: string, cookie?: string) {
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: cookie ? { cookie } : {},
  });
}

describe("proxy (edge optimistic session check)", () => {
  it("redirects anonymous requests on /dashboard/* to /login", () => {
    const res = proxy(request("/dashboard/default"));
    expect(res.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("lets anonymous requests reach /login (no redirect loop)", () => {
    const res = proxy(request("/login"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("lets anonymous requests reach /signup", () => {
    const res = proxy(request("/signup"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("bounces cookie-holders off /login to the dashboard", () => {
    const res = proxy(request("/login", SESSION_COOKIE));
    expect(res.headers.get("location")).toBe("http://localhost:3000/dashboard/default");
  });

  it("bounces cookie-holders off /signup to the dashboard", () => {
    const res = proxy(request("/signup", SESSION_COOKIE));
    expect(res.headers.get("location")).toBe("http://localhost:3000/dashboard/default");
  });

  it("passes cookie-holders through to /dashboard/*", () => {
    const res = proxy(request("/dashboard/default", SESSION_COOKIE));
    expect(res.headers.get("location")).toBeNull();
  });
});
