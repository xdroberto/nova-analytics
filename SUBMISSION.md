# Nova Analytics — Submission

A self-hosted analytics dashboard built for the technical trial: whitelabelled from an open-source
admin template, wired with real self-hosted auth, and deployed live with CI/CD and monitoring.

## Live

- **App:** https://nova.robertobh.dev
- **Repository:** https://github.com/xdroberto/nova-analytics
- **Health:** https://nova.robertobh.dev/api/health → `{"status":"ok","db":"up"}`

## Reviewer access

| | |
|---|---|
| Email | `admin@novaanalytics.io` |
| Password | `Nova-a9d6e1-Rev26!` |

Sign in at https://nova.robertobh.dev/login. The credential is intentionally shared for review; sign-in is
rate-limited and sessions are revocable.

## What was built

**Core (PRD requirements):**
- **Whitelabel** — zero original-template branding remains visible; CI-enforced by a branding gate.
- **Landing** — hero + features + CTA, dark-first, responsive (Lighthouse 94 mobile / 100 desktop).
- **Self-hosted auth** — email/password via Better Auth + Drizzle + Postgres (no managed vendors).
  Signup/login → dashboard; revocable DB-backed sessions; `/dashboard/*` guarded by an optimistic edge
  check plus an authoritative server-side session check.
- **Live HTTPS deployment**, stable across the review window.

**Bonus delivered:**
- **CI/CD** — GitHub Actions: conventional-commit gate, lint + typecheck + unit + e2e, and rollback-safe
  push-to-deploy (build → GHCR → SSH → health-retry → auto-rollback on failure).
- **Tests** — Vitest unit tests + Playwright e2e, including a **security bypass suite** (no-cookie /
  forged / expired-session denial, sign-in rate-limiting, security-header regression).
- **Security hardening** — app-layer rate limiting, security headers (HSTS / X-Frame-Options / etc.),
  supply-chain `ignore-scripts`, VPS SSH hardening (key-only + fail2ban), and an adversarial code review.
- **Monitoring** — UptimeRobot on `/api/health` (5-minute interval, email + SSL-expiry alerts).
- **Custom domain** — nova.robertobh.dev with TLS via certbot.
- **Process transparency** — the full agentic build process is kept as canonical state (below).

## Deeper docs

- **Architecture (6 diagrams):** [`docs/architecture.md`](docs/architecture.md) — system, DB ERD, auth
  flow, CI/CD, VPS topology, branching model.
- **AI development process:** [`docs/ai-process/`](docs/ai-process/) — roadmap, live BRAIN (canonical
  state), session log, agent team, prompts.
- **Deployment:** [`docs/deployment.md`](docs/deployment.md) · **ADRs:** [`docs/adr/`](docs/adr/) ·
  **Honest limitations:** [`docs/limitations.md`](docs/limitations.md).

## Walkthrough video

> **TODO (Roberto):** [VIDEO LINK]

## Behavioral questionnaire

> **TODO (Roberto):** [behavioral questionnaire]
