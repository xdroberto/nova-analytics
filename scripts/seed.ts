import { APIError } from "better-auth/api";

import { auth } from "../src/lib/auth";

async function main() {
  const email = "admin@novaanalytics.io";
  try {
    await auth.api.signUpEmail({
      body: { email, password: process.env.SEED_PASSWORD ?? "NovaReview2026!", name: "Nova Admin" },
    });
    console.log("seed: created", email);
  } catch (e: unknown) {
    // Only the "already exists" case is expected; anything else must fail loudly
    // (DB down, wrong DATABASE_URL, missing migrations) instead of reporting ok.
    const isAlreadyExists =
      e instanceof APIError && (e.body?.code === "USER_ALREADY_EXISTS" || /already exist/i.test(e.message));
    if (!isAlreadyExists) {
      throw e;
    }
    console.log("seed: already exists (ok)", email);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e: unknown) => {
    console.error("seed failed:", e);
    process.exit(1);
  });
