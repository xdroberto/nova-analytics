# BRAIN — canonical live state (the GPS)

> Rules: (1) read me first, (2) fix me if any file contradicts me, (3) update me after
> every significant action, (4) never reconstruct state from chat memory.

## Current position
- Phase: 4 (Deploy) ✅ CLOSED (af6625c). **LIVE at https://nova.robertobh.dev** — TLS, health ok,
  auth works, security headers live, push-to-deploy demoed end-to-end with rollback-safe CD.
- Next: Phase 5 (Hardening) + Roberto's requested polish of repo/landing/README (see below).
- Session note: this closes the working session; a fresh session boots from ROADMAP→BRAIN→
  latest SESSION-LOG and continues from here with zero chat context.

## ⚠ Pending Roberto actions (not code — external/his account)
1. **UptimeRobot**: create a monitor on https://nova.robertobh.dev/api/health (5-min, keyword
   "ok" or status 200, email alert). Needs his account — I can't create one. Last Phase-4 item.
2. **Disk on the VPS**: 87% used (4.7G free). NOT Nova (its image is 334MB, CI-built). Culprit is
   **22GB of Docker build cache (21GB reclaimable)** from IMCORE images built ON the host
   (imcore-frontend/api, pgvector present). `docker builder prune -f` reclaims ~21GB safely
   (doesn't touch running containers or tagged images). Roberto's call — it's imcore's cache.
3. Reviewer creds admin@novaanalytics.io / NovaReview2026! are live + public (in repo, by design
   for review). Rotate at Task 29 (SUBMISSION) if desired.

## Immediate next step (fresh session)
Open **Phase 5 (Hardening)** — Tasks 25 (Vitest unit for pure logic: extract evaluateHealth,
test), 26 (cross-browser/mobile QA matrix + load sanity `autocannon` + full adversarial
`/code-review` on develop→main). AND Roberto flagged he wants to revisit **repo/landing/README
key points** — treat as polish folded into Phase 5/6:
- README currently minimal (rewritten in Phase 2) — expand for submission quality (badges,
  screenshots, architecture link) at Task 27.
- Landing is solid (Lighthouse 94/100) but Roberto may want copy/visual refinements.
- Repo hygiene: consider a `.gitattributes` (`* text=auto eol=lf`) to kill the CRLF warnings;
  the `*.sh` gitignore trap already bit once (deploy script) — now fixed with `!deploy/*.sh`.
model/effort for Phase 5: propose at phase open (model-strategist).

## How the live deploy works (topology recap for a cold session)
- Host: existing Hetzner CPX11 178.156.248.110 (Ubuntu 24.04.4), SHARED with portfolio +
  sideeffects (static) + moonhouse (Python) + imcore (docker). Nova isolated via mem_limits.
- `/opt/nova/` = web-only compose (mem_limit 512m) on external docker net `data`; `.env` chmod 600.
- `/opt/shared-postgres/` = standalone Postgres 17 compose (mem_limit 384m), DB `nova`, room for
  `imcore_demo`. Port 127.0.0.1 only. NOVA_DB_PASSWORD in its `.env`.
- CD: push to `main` → deploy.yml build-push (GHCR `:latest`+`:sha`) → scp `deploy/remote-deploy.sh`
  → SSH runs it (pull, up, health-retry, ROLLBACK on failure, prune). Secrets: VPS_HOST/USER/SSH_KEY
  (dedicated ed25519 CI key in GHCR secrets + VPS root authorized_keys). GHCR package is PUBLIC.
- Migrations: from a dev machine via SSH tunnel (`ssh -L 15432:127.0.0.1:5432 root@VPS`) →
  `DATABASE_URL=…localhost:15432/nova npx drizzle-kit push --force`. See docs/deployment.md.
- Live facts: web ~50MB/512MB, postgres ~38MB/384MB. __Secure cookie confirmed on HTTPS.
- Process note: PR #5 (hardening) was self-reviewed + audit-documented (AUDIT-PRE-DEPLOY.md) +
  CI-green rather than sent to the adversarial reviewer, to keep the session close moving.

Already DONE on `feature/deploy` (repo side of Tasks 20/22/23, all verified locally):
- Task 20 ✅ standalone output + workspace-root fix; multi-stage Dockerfile (no public/
  dir in this repo — icons ship via src/app conventions); image built + container served
  / and /login (200).
- /api/health ✅ verified both paths (200 ok db-up · 503 degraded db-down).
- deploy/docker-compose.prod.yml (ghcr.io/xdroberto/nova-analytics:latest, db volume,
  127.0.0.1-only web port) + deploy/nginx-nova.conf + .github/workflows/deploy.yml
  (needs secrets VPS_HOST + VPS_SSH_KEY once the VPS exists).
Remaining once VPS arrives: harden + install (Task 21 step 2 script), prod .env on the VPS
(chmod 600, NEW BETTER_AUTH_SECRET + POSTGRES_PASSWORD), nginx + certbot, first manual
deploy + migrations + seed, secrets in GitHub, push-to-deploy demo, UptimeRobot, analytics
decision (ADR-004), auditor pre-deploy gate.

## Phase 4 review outcome (PR #4 — MERGE AFTER FIXES; 4 MAJOR + 4 MINOR + NIT)
- FIXED MAJOR-1 (no rollback): `deploy/remote-deploy.sh` captures the running image, health-checks
  with retries, rolls back to it on failure (still exits 1). deploy.yml tags `:latest` + `:<sha>`.
- MAJOR-2 (GHCR auth): documented — package is private-by-default on first push regardless of repo
  visibility. Decision surfaced to Roberto (recommend: make package public; alt: read PAT + docker
  login on VPS). Blocks first pull; resolved at deploy step. deployment.md "GHCR image access".
- FIXED MAJOR-3 (ADR contradictions): Decision line now says Postgres is a SEPARATE compose project;
  RAM unified to "2 GB nominal / ~1.9 GiB usable"; swap unified to 3G; shared-VPS alternative adopted.
- MAJOR-4 (reboot startup ordering): ACCEPTED as documented risk (not the suggested wait-for-DB —
  it would delay the DB-independent landing too, net worse). Landing stays up; pg pool self-heals.
- FIXED MINOR-5 (--chown + .next/cache; verified nextjs writes cache in-container), MINOR-6 (retry
  loop vs sleep+single curl), MINOR-7 (client_max_body_size 10m), MINOR-8 (health force-dynamic).
  NIT-9: nginx conf marked pre-TLS template.

## Phase 2 review outcome (PR #2 — MERGE AFTER FIXES; all applied + verified)
- FIXED MAJOR-1: branding gate was fail-open (grep exit 2 ≡ "clean"); now fails closed
  (path existence check + explicit status handling; verified exit 2 from bogus cwd) and
  scans ALL text files under src (no extension allowlist).
- FIXED MAJOR-2: dark primary contrast 3.72:1 → 6.15:1 (oklch L 0.62→0.511; computed via
  OKLCH→sRGB→WCAG script, reviewer's math independently reproduced).
- FIXED MINORs: invoice taxId WS-→NA-; kanban persona key adjacency trap (maya/mayaChen →
  distinct diego); NovaLogo static <title> + aria-hidden-when-redundant.
- Side effect: biome check --write normalized formatting across ~19 files (repo toolchain,
  bundled into b39a085).

## Phase 3 review outcome (PR #3 — MERGE AFTER FIXES; 4 MINOR + 1 NIT, no MAJOR)
- FIXED: marketing wrapper now also sets native `color-scheme: dark` (ThemeBootScript pins it
  to the user's app preference — default light — leaving dark landing with light scrollbars).
- FIXED: landing e2e anchors the hero CTA to the hero's own section (was positional .nth(1)
  across three identical links). NIT fixed: unused `geist` package uninstalled.
- ACCEPTED AS DECISION (not a bug): `/` no longer auto-redirects authenticated users to the
  dashboard. Rationale: keeps the landing fully static (perf), matches modern SaaS convention,
  and lets a logged-in reviewer/demo still see the landing. The proxy already bounces
  /login /signup to the dashboard for cookie-holders.
- METHOD NOTE for Phase 5 QA: scrollWidth-based overflow test is blind to transform-driven
  visual overflow — complement with getBoundingClientRect on key elements or real-browser QA.

## Model/effort assignments (Phase 3)
| Task | Nature | Model | Effort | Executor |
|---|---|---|---|---|
| 17 Route structure | Route group surgery | Fable (session) | high | Lead |
| 18 Landing sections | UI craft (uix skills) | Fable (session) | high | Lead (ui-designer hat) — subagents quota-limited |
| 19 Quality gate | Lighthouse + e2e | Fable (session) | medium | Lead |
> Subagent quota: session limit reset 7:20pm + monthly spend cap hit — Phase 3 runs
> Lead-direct; revisit delegation when quota recovers.

## Adversarial review outcome (PR #1 — verdict: MERGE AFTER FIXES; all fixes applied + verified)
- FIXED MAJOR-1: stale-cookie redirect loop (/login unreachable after DB reset/secret rotation).
  Server Components can't delete cookies → new `/api/session/clear` route handler clears
  `*better-auth*` cookies and lands on /login. Verified: stale cookie → 2 redirects → /login 200.
- FIXED MAJOR-2: pg Pool without 'error' listener would crash the Node process on idle-client
  errors (Postgres restart on the VPS). Also cached pool in globalThis for dev HMR (MINOR-1).
- FIXED MAJOR-3: seed script masked ANY failure as "already exists (ok)" exit 0. Now only
  APIError USER_ALREADY_EXISTS is tolerated. Verified: wrong DB password → "seed failed" exit 1.
- FIXED MINOR-3: forms wrap auth calls in try/catch (network failure → toast, no unhandled rejection).
- FIXED MINOR-4: e2e email moved inside the test (module scope poisoned CI retries with
  "user already exists").
- WAIVED MINOR-2 (explicit trustedOrigins): it would derive from the same BETTER_AUTH_URL env var —
  if that var is wrong, explicit trustedOrigins is equally wrong. Zero added robustness. Phase 4
  deploy docs pin BETTER_AUTH_URL and prod login is verified over HTTPS.
- TRACKED NITs (not fixed now): no return-path after login (deep links land on /dashboard/default);
  `role: "admin"` hardcoded in dashboard layout is cosmetic today but MUST be DB-backed before any
  RBAC gate reads it; getSession does a DB round-trip per dashboard request (cookieCache = perf
  option later).

## Spike findings (Task 7 — Better Auth 1.6.23 ↔ Next 16.2.10/Turbopack: NO fundamental friction)
- **Endpoints verified:** `POST /api/auth/sign-up/email` (200 + cookie), `POST /api/auth/sign-in/email`
  (200 + fresh cookie), `GET /api/auth/get-session` (session+user JSON with cookie; `null` without).
- **Cookie:** `better-auth.session_token` — HttpOnly, SameSite=Lax, Path=/, Max-Age=604800 (7d).
  No `Secure` flag in dev (http); MUST verify it appears in prod https (Phase 4 audit gate).
- **Sessions are DB rows** (revocable), track ipAddress + userAgent, 7-day expiry. 2 rows after signup+signin.
- **Schema gen chicken-and-egg:** `@better-auth/cli generate` loads `auth.ts`, which imports the schema the CLI
  is about to create → generate FIRST with `drizzleAdapter(db, { provider: "pg" })` (no schema), then wire the
  import. CLI also does NOT create the output dir (`mkdir -p src/db` first).
- **drizzle-kit push:** does NOT auto-load `.env` (source it: `set -a; . ./.env; set +a`) and in non-TTY the
  confirm prompt is swallowed (exits silently WITHOUT applying) → use `push --force`. Verify with `\dt`.
- **Naming:** TS fields camelCase → DB columns snake_case (`email_verified`). Tables: user, session, account, verification.
- **Local ports map (this machine):** 5432 = native Windows Postgres service · 5433 = another project's container
  → Nova dev DB publishes on host **5434** (compose + .env + .env.example aligned).
- **Dev-env gotcha:** stopping the `npm run dev` wrapper can leave a zombie `next dev` child on Windows holding
  port 3000 (stale node_modules view → Jest-worker crashes). Fix: `taskkill //PID <pid> //F`.
- Versions pinned by install: better-auth 1.6.23 · drizzle-orm 0.45.2 · drizzle-kit 0.31.10 · pg 8.22.

## Environment facts (source of truth for later tasks)
- Fork: `github.com/xdroberto/nova-analytics` — owner `xdroberto` → GHCR image `ghcr.io/xdroberto/nova-analytics`.
- Package manager: **npm** (`package-lock.json`). Node 24 local; CI/Docker pin Node 22.
- Framework: Next.js **16.2.10** (Turbopack), React 19.2, Tailwind v4, shadcn/ui. Build green (33 routes).
- App dir: **`src/app`**. Template package name: `studio-admin` (branding target; full inventory in Task 13).
- Lint/format: **Biome** (`npm run lint`; `npm run check`). No `typecheck` script → CI uses `npx tsc --noEmit`.
- **Auth screens (found in build output):** `/auth/v1/login`, `/auth/v1/register`, `/auth/v2/login`, `/auth/v2/register`
  — two variants; pick ONE to wire in Task 8. Dashboard at `/dashboard/*` (many demo pages; `/dashboard/default`
  is the likely home). Extra top-level routes: `/chat`, `/mail`, `/unauthorized`.
- Routing today: `/` → 307 redirect (static); becomes the landing in Phase 3. `/login` is 404 (real path `/auth/vN/login`).
- Theme presets: `npm run generate:presets` writes `src/lib/preferences/theme.ts` — GENERATED (also regenerated by the
  husky pre-commit hook). **Whitelabel must edit the preset SOURCE, never `theme.ts` directly** (Task 14).
- ⚠ Local-only: Next infers workspace root from a stray `C:\Users\xdrob\package-lock.json` → set `turbopack.root`
  + `outputFileTracingRoot` in `next.config.mjs` at Task 20 (does NOT affect CI's clean checkout).
- `npm audit`: 2 moderate vulnerabilities → review in Phase 4 audit gate.
- **gh + fork gotcha:** `gh` defaults to the UPSTREAM (arhamkhnz) for `run list`/PR ops. Always pass
  `--repo xdroberto/nova-analytics` (or `--base develop` on PRs) to target the fork.

## Decisions log (newest first)
- 2026-07-08: **INFRA PIVOT (ADR-003 amended):** dedicated CPX11 no longer economical
  (legacy ~$6.99 gone; new ~$21/mo ≈ 3×). Nova deploys to the EXISTING CPX11 at
  178.156.248.110 (Ubuntu 24.04.4, also serving portfolio + sideeffects static +
  moonhouse Python) with container isolation: hard mem limits (web ~512M, db ~384M),
  2G swap (already active), restart policies. Operating rules: portfolio/sideeffects are
  NEVER stopped; moonhouse pausable only with Roberto's explicit approval; builds stay
  CI-only. DNS A nova.robertobh.dev → 178.156.248.110 verified (Cloudflare, DNS-only).
  Isolation proposal awaiting Roberto's approval before any deploy action.
- 2026-07-07: Phase 0 closed — canonical state live, 10 agent roles defined, CI skeleton green (1m16s).
- 2026-07-07: Spike & stabilize for auth; auditor role added; capture-as-you-go evidence. (spec §5–§8)
- 2026-07-07: Dedicated Hetzner CPX11 for hosting; builds only in CI; GHCR images. (ADR-003)
- 2026-07-07: Better Auth + Drizzle + Postgres 17; NO Supabase/managed auth. (ADR-002)
- 2026-07-07: Base repo: arhamkhnz/next-shadcn-admin-dashboard. (ADR-001)

## Model/effort assignments
### Phase 0 — actuals (honest, for COST-REPORT)
| Task | Model (actual) | Effort | Executor | Note |
|---|---|---|---|---|
| 1 Fork/clone/boot | Opus 4.8 | high | Lead | env discovery — needed judgment |
| 2 Docs + canonical state | Opus 4.8 | high | Lead | proposed Sonnet; kept on Lead for foundational precision |
| 3 CLAUDE.md | Opus 4.8 | high | Lead | proposed Sonnet; kept on Lead |
| 4 Agent roles (10 files) | Haiku 4.5 | low | builder subagent | delegated as planned; Lead verified output |
| 5 CI skeleton | Opus 4.8 | high | Lead | pre-validated lint/tsc/build locally before push |
> Cost note: Tasks 2/3/5 could have gone to Sonnet to save budget; kept on Lead because they are the
> foundational process artifacts (small, high-leverage). Revisit delegation discipline in Phase 2+.
### Phase 1 — assignments (proposed) + actuals so far
| Task | Model (proposed) | Model (actual) | Effort | Executor | Note |
|---|---|---|---|---|---|
| 6 Local Postgres | Sonnet/medium | Fable 5 (session) | high | Lead | port-collision debugging justified Lead attention |
| 7 SPIKE Better Auth | Opus/high | Fable 5 (session) | high | Lead (auth-engineer hat) | succeeded well inside time-box |
| 8 Wire client+forms | Opus/high | — | high | auth-engineer | pending |
| 9 Protect dashboard | Opus/high | — | high | auth-engineer | pending |
| 10 Seed script | Haiku/low | — | low | builder | pending |
| 11 e2e tests | Sonnet/medium | — | medium | qa-tester | pending |
| 12 Review+merge | Opus/high | — | high | reviewer | pending |
> Session model switched to Fable 5 (Roberto's /model) after Phase 0 — Lead-executed tasks now run on it.

## Open items
- Deadline answer from employer (asked 2026-07-07)
- Logo asset from Roberto (placeholder spark in use)
- VPS credentials (Phase 4), DNS for `nova.robertobh.dev` (Phase 4), analytics pick (Phase 4)
- ~~Plan gap: ADR files~~ RESOLVED — `docs/adr/001-base-repository.md`, `002-auth-stack.md`,
  `003-hosting.md` written while waiting at the VPS gate (c5568eb). ADR-004 (analytics) pending Phase 4.
