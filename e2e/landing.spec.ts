import { expect, test } from "@playwright/test";

test("landing renders hero and hero CTA leads to signup", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /see your data become light/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /start seeing clearly/i })).toBeVisible();

  // "Get started" exists in nav, hero, and CTA band — take the hero one.
  await page
    .getByRole("link", { name: /^get started$/i })
    .nth(1)
    .click();
  await expect(page).toHaveURL(/signup/);
  await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
});

test.describe("mobile viewport", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("landing has no horizontal overflow at 375px", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /see your data become light/i })).toBeVisible();
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > 375);
    expect(overflows).toBe(false);
  });
});
