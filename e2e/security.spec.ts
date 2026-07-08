import { expect, test } from "@playwright/test";
import { Client } from "pg";

// Local fallback matches docker-compose.dev.yml (host port 5434); CI provides
// DATABASE_URL pointing at the service container on 5432.
const DB_URL = process.env.DATABASE_URL ?? "postgresql://nova:novadev@localhost:5434/nova";

// NOTE ON ORDERING: workers=1 + no full parallelism run specs alphabetically
// (auth < landing < security) and tests in declaration order. The rate-limit
// test MUST stay LAST in this (last) file: rate limiting is per-IP and all of
// Playwright is one localhost IP — its poisoned 60s window would 429 any
// login that ran after it.

test("baseline security headers are present on responses", async ({ page }) => {
  const response = await page.goto("/");
  if (!response) throw new Error("no response from /");
  const headers = response.headers();
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["strict-transport-security"]).toContain("max-age=31536000");
  expect(headers["permissions-policy"]).toContain("camera=()");
});

test("after logout, reloading the dashboard lands on /login (never re-shows the authenticated view)", async ({
  page,
  context,
}) => {
  // This is the redirect the client BfcacheGuard triggers when a page is restored
  // from the browser's back/forward cache. Dashboard pages are dynamically rendered
  // and Next owns their Cache-Control (it serves `no-cache`, not `no-store`), so the
  // guard reloads any bfcache-restored page (`pageshow` + `persisted`) — and, as
  // asserted here, a logged-out reload redirects to /login rather than re-showing the
  // stale dashboard. (Real-bfcache Back is verified manually; headless bfcache is
  // unreliable to trigger, and window.location.reload can't be spied in Chromium.)
  const email = `sec-bfcache-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@novaanalytics.io`;
  const signup = await page.request.post("/api/auth/sign-up/email", {
    data: { name: "Bfcache Probe", email, password: "SecPass123!" },
  });
  expect(signup.ok()).toBeTruthy();

  await page.goto("/dashboard/default");
  await expect(page).toHaveURL(/dashboard/);

  await context.clearCookies(); // log out
  await page.reload();
  await expect(page).toHaveURL(/login/);
});

test("anonymous request to a protected page is redirected to /login at the edge", async ({ request }) => {
  const res = await request.get("/dashboard/default", { maxRedirects: 0 });
  expect(res.status()).toBe(307);
  expect(res.headers().location).toContain("/login");
});

test("session API returns no session for anonymous requests", async ({ request }) => {
  const res = await request.get("/api/auth/get-session");
  expect(res.status()).toBe(200);
  expect(await res.json()).toBeNull();
});

test("a forged session cookie is denied by the authoritative server-side check", async ({ browser }) => {
  // A present-but-invalid cookie passes the optimistic proxy on purpose; the
  // dashboard layout's auth.api.getSession() must reject it (signature check),
  // route through /api/session/clear (stale-cookie loop breaker) and land on /login.
  const context = await browser.newContext();
  await context.addCookies([
    {
      name: "better-auth.session_token",
      value: "forged-token-with-invalid-signature",
      url: "http://localhost:3000",
    },
  ]);
  const page = await context.newPage();
  await page.goto("/dashboard/default");
  await expect(page).toHaveURL(/login/, { timeout: 15_000 });
  await context.close();
});

test("an expired session is denied by the authoritative DB check", async ({ request }) => {
  // Distinct defense layer from the forged-cookie test: here the cookie
  // signature is VALID — only the session row in the DB is stale.
  const email = `sec-expiry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@novaanalytics.io`;
  const signup = await request.post("/api/auth/sign-up/email", {
    data: { name: "Expiry Probe", email, password: "SecPass123!" },
  });
  expect(signup.ok()).toBeTruthy();

  // Sanity: with the fresh session the dashboard actually renders.
  const before = await request.get("/dashboard/default");
  expect(before.url()).toContain("/dashboard");

  const client = new Client({ connectionString: DB_URL });
  await client.connect();
  try {
    const updated = await client.query(
      `UPDATE "session" SET "expires_at" = NOW() - INTERVAL '1 day'
       WHERE "user_id" = (SELECT "id" FROM "user" WHERE "email" = $1)`,
      [email],
    );
    expect(updated.rowCount).toBeGreaterThan(0);
  } finally {
    await client.end();
  }

  const after = await request.get("/dashboard/default");
  expect(after.url()).toContain("/login");
});

test("orphaned top-level app routes (/chat, /mail) are not reachable unauthenticated", async ({ request }) => {
  // The real chat/mail live under the guarded /dashboard/*. These top-level
  // (main)/chat and (main)/mail duplicates had NO auth check (proxy matcher is
  // /dashboard/* only) and served the app shell to anonymous visitors. They are
  // deleted; assert they no longer serve a page.
  for (const path of ["/chat", "/mail"]) {
    const res = await request.get(path, { maxRedirects: 0 });
    expect(res.status(), `${path} must not serve 200 to an anonymous visitor`).not.toBe(200);
  }
});

// LAST ON PURPOSE — see ordering note at the top of this file.
test("failed sign-ins are rate limited (429) at or before the configured 5-attempt ceiling", async ({ request }) => {
  const email = `sec-ratelimit-${Date.now()}@novaanalytics.io`; // nonexistent user
  const statuses: number[] = [];
  for (let i = 0; i < 9; i++) {
    const res = await request.post("/api/auth/sign-in/email", {
      data: { email, password: "definitely-wrong-1!" },
    });
    statuses.push(res.status());
    if (res.status() === 429) break;
  }
  const firstBlocked = statuses.indexOf(429);
  // A 429 MUST appear — rate limiting is active on the credential endpoint.
  expect(firstBlocked, `no 429 seen in ${statuses.join(",")}`).toBeGreaterThanOrEqual(0);
  // ...and no later than our configured max of 5. A block past 5 would mean the rule is
  // looser or gone. Exact count is intentionally NOT pinned: Playwright shares ONE localhost
  // IP, so an earlier spec's sign-in can pre-warm this same /sign-in/email bucket within the
  // 60s window (lowering the count) — the ≤5 ceiling stays robust, and a fallback to the
  // stricter built-in 3/10s is not a regression. Everything before the block is a plain 401.
  expect(firstBlocked, `429 landed past the 5-attempt ceiling: ${statuses.join(",")}`).toBeLessThanOrEqual(5);
  expect(statuses.slice(0, firstBlocked).every((s) => s === 401)).toBe(true);
});
