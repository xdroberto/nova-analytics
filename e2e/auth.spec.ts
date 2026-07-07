import { expect, test } from "@playwright/test";

const password = "E2eTest123!";

test("signup → dashboard → logout → login", async ({ page }) => {
  // Generated inside the test so a CI retry gets a fresh email — module scope
  // would reuse the first one and collide with "user already exists".
  const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@novaanalytics.io`;
  await page.goto("/signup");
  await page.getByLabel(/^name$/i).fill("E2E User");
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByLabel(/confirm password/i).fill(password);
  await page.getByRole("button", { name: /register/i }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });

  // Log out via the sidebar user menu (accessible name contains the user's name).
  await page.getByRole("button", { name: /e2e user/i }).click();
  await page.getByRole("menuitem", { name: /log ?out/i }).click();
  await expect(page).toHaveURL(/login/, { timeout: 15_000 });

  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole("button", { name: /^login$/i }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
});

test("anonymous /dashboard redirects to login", async ({ page }) => {
  await page.goto("/dashboard/default");
  await expect(page).toHaveURL(/login/);
});
