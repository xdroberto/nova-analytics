import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Unit tests only. Playwright e2e (`e2e/*.spec.ts`) runs under @playwright/test,
    // not Vitest — scope this runner to src unit tests so the two never collide.
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
