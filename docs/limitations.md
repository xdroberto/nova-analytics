# Limitations & honest notes

The trial is a real, working product built on sample data — not a live business. This is the
honest list of what is intentionally out of scope or imperfect, kept current as things surface.

## Product scope (by design — YAGNI for a trial)

- **Sample data, not live ingestion.** Dashboards render realistic mock data; there is no
  real analytics pipeline behind them.
- **No email verification / password reset flows.** Signup logs you straight in; enough to
  demonstrate self-hosted credential auth, not a full account-lifecycle system.
- **No OAuth/social login.** Email + password only (the template's social button was removed).
- **Single region.** One VPS in Ashburn; no multi-region or CDN for the app itself.
- **No product analytics deployed.** Deferred on purpose (ADR-004) — self-hosting Plausible
  would bust the shared-host memory budget; uptime monitoring covers operational visibility.

## Infrastructure trade-offs

- **Shared host, not dedicated.** Nova runs alongside a portfolio + other sites on one CPX11
  (ADR-003 amendment, driven by a 3× price change). Blast radius is capped by container
  memory limits + swap + restart policies, but it is a shared host — honestly a weaker
  isolation story than the originally-planned dedicated box.
- **Reboot startup ordering.** Nova's web and Postgres are separate Compose projects, so a
  host reboot can briefly 500 the DB-backed dashboard routes until the pool reconnects
  (~seconds). The landing stays up throughout; accepted rather than blocking startup on the DB.
- **CI deploys as `root`** over SSH via a dedicated, revocable key. On this host `docker`
  group ≈ root, so a locked-down deploy user adds little real isolation; noted as future work.
- **Package manager: npm (not pnpm).** pnpm was considered for stricter, content-addressed installs
  and a smaller store, but a mid-trial migration wasn't worth the churn against the live review window —
  and registry supply-chain risk is client-agnostic anyway. The lockfile is pinned to the CI/prod
  toolchain (Node 22 → npm 10) via `.nvmrc` + `engines`; see BRAIN for the npm-11-vs-10 lockfile incident
  that motivated the pin.

## Known accepted findings

- **`npm audit`:** 6 moderate advisories, none runtime-exploitable — postcss via Next (build-time CSS
  tooling, no user-supplied CSS at runtime) and esbuild via drizzle-kit (dev-only migration tooling, not
  in the prod image). Fixes are breaking downgrades (Next / drizzle-kit); re-evaluated per upstream minor
  rather than force-fixed.
- **Auth rate-limit IP behind the proxy** (adversarial-review finding). Rate limiting is enabled and the
  e2e suite pins the 5/60s sign-in rule, but in production behind nginx the per-IP key needs
  `advanced.ipAddress.trustedProxies` (nginx / docker-bridge CIDR) to recover the real client IP —
  otherwise every `X-Forwarded-For`-bearing client collapses into one shared `no-trusted-ip` bucket
  (coarser throttling; a narrow same-bucket DoS). NOT remotely exploitable: the container binds
  `127.0.0.1:3000`, so a forged single-value XFF can't reach the app directly. Follow-up: set
  `trustedProxies` and verify against the live nginx→container hop.
- **No RBAC** (adversarial-review finding). `role: "admin"` is hardcoded for every authenticated user
  (display-only; the `user` table has no role column), so there is a single access tier — every logged-in
  user has full `/dashboard/*` access. Fine for a single-reviewer trial; a real product needs a DB-backed
  role + server-side authorization before any role-gated feature.
- **No Content-Security-Policy header** (audit finding — DEFERRED on purpose). The other baseline headers
  ship (HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy); CSP is the defense-in-depth
  layer against XSS. Deferred right before the deadline because a strict `script-src`/`style-src` can silently
  break Next.js inline styles/scripts and needs careful per-directive testing. No proven injection path today
  (no `dangerouslySetInnerHTML` over user data; the arbitrary cookie-read server action was removed in the
  security-audit batch). Next step: ship a report-only CSP first, tune, then enforce.
- **Forced-logout CSRF on `GET /api/session/clear`** (audit finding — DEFERRED, low). A cross-site
  `<img src=".../api/session/clear">` can force-log-out a visitor — nuisance only: no data exposure, deletion
  is scoped to `better-auth*` cookie names, and the redirect target is a static same-origin `/login`. Proper
  fix is a POST with an Origin/CSRF check; deferred as cosmetic for the trial.

## Process slips caught & fixed (repo hygiene)

Two repository-hygiene slips got through in early phases; both are fixed, and the safeguard
below now prevents recurrence:

1. **34 inherited upstream branches** were never pruned after the fork (distributed ownership,
   no single guardian of branch hygiene). **Fixed 2026-07-08:** the `repo-steward` pruned the 34
   inherited branches from `origin` (safety-guarded, with a full-SHA reversibility log archived in
   `evidence/`); `origin` now carries only `develop`/`main` plus whatever short-lived working branches
   are in flight.
2. **A deploy script was silently swallowed by `.gitignore`.** The Phase-4 `*.sh` ignore rule
   only excepted `scripts/*.sh`, so `deploy/remote-deploy.sh` was untracked; the first
   push-to-deploy failed at the `scp` step (`tar: empty archive`) with no deployment and no
   downtime. Fixed in `171fc1e` (`!deploy/*.sh` exception + the script committed).

**Safeguard (Phase 4):** a `repo-steward` role was added with **mechanical** enforcement — a
commitlint CI gate (conventional commits, scoped strictly to each PR's own commit range, never
inherited history) — so repo cleanliness is checked by CI, not left to good intentions.

## Product surface: template scaffolding still present

- **Off-brand demo modules removed from the nav, routes still in the build.** The whitelabel /
  coherence work targets the primary analytics pages (Default, Analytics, E-commerce, Usage & Billing).
  The most off-brand template modules — Academy, Logistics, Infrastructure, and the "Legacy" V1
  dashboards (personal-finance demos) — were **removed from the sidebar** so they aren't user-visible,
  but their routes still exist in the build; a production build would delete them outright. A handful
  of generic admin modules (Mail, Chat, Calendar, Kanban, Tasks, Invoice, Users, Roles, CRM) remain in
  the nav as template scaffolding — functional, but not part of the analytics story.
- **Secondary-page metric coherence is partial.** Coherent Nova metrics were authored for the primary
  pages; some secondary/legacy pages still carry template-flavored figures. This is documented
  in-progress polish, not a data pipeline (the product runs on sample data by design).

## Delivery & tooling honesty

- **CD is not hard-gated on CI inside the pipeline.** `deploy.yml` triggers on push to `main` and does
  not `needs`/`workflow_run` on `ci.yml`, so a red lint/unit/e2e would not itself block a deploy. The
  real gates are (a) promotion goes through a develop→main **PR where full CI must pass** (quality + e2e
  + commitlint), and (b) `deploy/remote-deploy.sh` is **rollback-safe** (health-retry → auto-rollback to
  the previous image → exit 1). A `workflow_run`/branch-protection required-check gate is future work.
- **e2e runs against the dev server in CI.** `playwright.config.ts` boots `next dev` rather than the
  built/standalone server §8 of the design spec describes; the money-path + security-bypass coverage is
  unchanged, but the exact prod server mode isn't exercised by e2e. Future: point the webServer at
  `build && start`. Unit tests likewise cover the health endpoint + edge proxy, not yet the Zod
  credential validators.
- **The prod compose file isn't auto-shipped.** `deploy.yml` scps only `remote-deploy.sh`;
  `deploy/docker-compose.prod.yml` was placed on the VPS during the first-deploy checklist, so repo
  edits to it don't propagate automatically. Future: scp the compose file alongside the deploy script.
- **Architecture diagrams are faithful but simplified.** The 6 Mermaid diagrams in
  `docs/architecture.md` show the system's shape, not every column/edge: the ERD elides some
  OAuth/`updated_at` columns (email-password only, per PRD non-goals), the CI→deploy edge is a logical
  relationship (deploy isn't hard-gated on CI — see above), and `imcore` is drawn as a reserved/future
  co-tenant. Documented simplifications, not inaccuracies.
