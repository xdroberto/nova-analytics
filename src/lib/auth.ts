import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import * as schema from "@/db/auth-schema";

import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  // Explicit rate limiting (Better Auth's default only enables it in prod):
  // config-driven instead of environment-driven, so dev/CI exercise the same
  // defense the e2e suite pins. Stricter window on the credential endpoint
  // as brute-force mitigation; in-memory storage is fine single-instance.
  rateLimit: {
    enabled: true,
    window: 10,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 10 },
    },
  },
});
