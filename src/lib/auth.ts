import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import * as schema from "@/db/auth-schema";

import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  // Rate limiting enabled explicitly — Better Auth's default is prod-only
  // (`enabled ?? isProduction`), so this makes the defense environment-independent:
  // dev/CI exercise the very rule the e2e suite pins. An explicit customRule (rather
  // than leaning on the built-in /sign-in default, which can shift across versions)
  // caps credential submission at 5 / 60s — a deliberate brute-force↔UX balance, NOT
  // claimed to beat the built-in 3/10s on burst. In-memory storage is fine on a single
  // instance. KNOWN GAP (docs/limitations.md): behind nginx the per-IP key needs
  // `advanced.ipAddress.trustedProxies` to recover the real client IP in prod.
  rateLimit: {
    enabled: true,
    window: 10,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
    },
  },
});
