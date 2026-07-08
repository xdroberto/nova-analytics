import { APIError } from "better-auth/api";

import { auth } from "../src/lib/auth";

async function main() {
  const email = "admin@novaanalytics.io";
  // Fail closed: never seed a privileged account with a repo-visible default.
  const password = process.env.SEED_PASSWORD;
  if (!password) {
    throw new Error(
      "SEED_PASSWORD is required — refusing to seed with a hardcoded default. " +
        "Set it in .env (see .env.example) or the shell before running `npm run seed`.",
    );
  }
  try {
    await auth.api.signUpEmail({ body: { email, password, name: "Nova Admin" } });
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
