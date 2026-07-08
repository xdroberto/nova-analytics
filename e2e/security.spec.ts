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
test("repeated failed sign-ins are rate limited with 429", async ({ request }) => {
  const email = `sec-ratelimit-${Date.now()}@novaanalytics.io`; // nonexistent user
  let sawTooManyRequests = false;
  let lastStatus = 0;
  // Custom rule is 10 per 60s on /sign-in/email; 14 attempts guarantees crossing it.
  for (let i = 0; i < 14; i++) {
    const res = await request.post("/api/auth/sign-in/email", {
      data: { email, password: "definitely-wrong-1!" },
    });
    lastStatus = res.status();
    if (lastStatus === 429) {
      sawTooManyRequests = true;
      break;
    }
  }
  expect(sawTooManyRequests, `never saw 429; last status: ${lastStatus}`).toBe(true);
});
