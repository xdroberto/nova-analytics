import { auth } from "../src/lib/auth";

async function main() {
  const email = "admin@novaanalytics.io";
  const res = await auth.api
    .signUpEmail({
      body: { email, password: process.env.SEED_PASSWORD ?? "NovaReview2026!", name: "Nova Admin" },
    })
    .catch((e: unknown) => ({ error: String(e) }));
  console.log("seed:", "error" in (res as object) ? "already exists (ok)" : "created", email);
}

main()
  .then(() => process.exit(0))
  .catch((e: unknown) => {
    console.error("seed failed:", e);
    process.exit(1);
  });
