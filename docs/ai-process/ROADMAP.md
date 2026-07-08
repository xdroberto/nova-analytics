# Nova Analytics — Roadmap (canonical map)

> Session boot: read this file → BRAIN.md → latest SESSION-LOG.md entry, in that order, before any action.

## North star (PRD deliverables)
- [x] Public repo fork with clear commits + README (stack, setup, env vars) — polished, badges, `SUBMISSION.md`
- [x] Whitelabel: zero original-branding traces in visible UI
- [x] Landing: hero + features + CTA, responsive, polished
- [x] Working signup/login (self-hosted) → redirect to dashboard
- [x] Live HTTPS deployment, stable through review window
- [ ] Video walkthrough (5–10 min) + submission package + behavioral questionnaire — **package ✅ (`SUBMISSION.md`)**; video + questionnaire pending (Roberto)
- [x] Bonus: process logs, CI/CD, tests, custom domain, monitoring (analytics deferred by decision — ADR-004)

## Phases
| # | Phase | Status | Exit criteria | Closed at (commit) |
|---|---|---|---|---|
| 0 | Setup & scaffolding | ✅ | App runs locally; CI green on skeleton | 423d359 |
| 1 | Auth (spike → stabilize) | ✅ | e2e: signup→login→dashboard→logout | dac7bd1 |
| 2 | Whitelabel | ✅ | Branding grep = 0 hits, CI-enforced | 1e6a511 |
| 3 | Landing | ✅ | Lighthouse ≥90 mobile; CTA→signup works | 6cd239e |
| 4 | Deploy | ✅ | Public HTTPS + push-to-deploy + audit gate + uptime monitoring (UptimeRobot **LIVE**) | af6625c |
| 5 | Hardening | ✅ | Full suite green in CI; review findings fixed; **security bypass suite green** (no-cookie / invalid / expired → deny·redirect; auth rate-limit responds) | b531e52 |
| 5.5 | UI/UX polish & diagrams | 🔄 | (1) ✅ Mermaid diagram suite renders on GitHub (6 diagrams); (2) 🔄 formal responsive audit @360/375/768/1024/1440 not run as a discrete deliverable — e2e pins 375px no-overflow and the landing is live (noted in `limitations.md`); (3) ✅ landing v2 + micro-interaction polish merged (PR #8/#9/#11) + login-polish (PR #15) | 9eb31e3 |
| 6 | Delivery | 🔄 | Package ✅ (SUBMISSION, README badges, creds rotated, `COST-REPORT.md`, `AUDIT-PRE-SUBMISSION.md`, v1.0.0 cut); final audit gate ✅; **video walkthrough + behavioral questionnaire pending (Roberto)** | — |

## Milestone log
| Date | Milestone | Commit |
|---|---|---|
| 2026-07-07 | Design spec approved | (planning repo) |
| 2026-07-07 | Phase 0 closed: local boot + CI green on skeleton | 423d359 |
| 2026-07-07 | First self-hosted signup via curl (Better Auth spike gate passed) | 4aae990 |
| 2026-07-07 | Phase 1 closed: auth merged after adversarial review; e2e green in CI | dac7bd1 |
| 2026-07-07 | Phase 2 closed: full whitelabel, CI branding gate enforcing zero hits | 1e6a511 |
| 2026-07-07 | Phase 3 closed: landing live locally — Lighthouse 94 mobile / 100 desktop | 6cd239e |
| 2026-07-08 | Infra pivot: reuse existing CPX11 with container isolation (ADR-003 amended) | b2977a7 |
| 2026-07-08 | FIRST LIVE DEPLOY — https://nova.robertobh.dev up (TLS, health ok, Secure cookie, signup/login) | 67f9382 |
| 2026-07-08 | Phase 4 closed: push-to-deploy demoed end-to-end (rollback-safe CD), security headers live, audit gate passed | af6625c |
| 2026-07-08 | Phase 4 promoted to production (PR #6 develop→main); push-to-deploy verified from merge (~3m09s), health ok | 4325946 |
| 2026-07-08 | UptimeRobot monitor LIVE (/api/health · 5-min · email + SSL-expiry) — **Phase 4 FULLY CLOSED** | 4325946 |
| 2026-07-08 | **Phase 5 CLOSED + promoted to production** (PR #7 develop→main, 19 commits); adversarial review 1 HIGH fixed; deploy success, health ok | b531e52 |
| 2026-07-08 | Phase 5.5 (1/3): Mermaid diagram suite (6) in docs/architecture.md — verified rendering on GitHub | 8c0acb0 |
| 2026-07-08 | Landing v2 + micro-interaction polish merged (PR #8/#9/#11) → promoted to main (PR #13) | 12bce63 |
| 2026-07-08 | Dashboard: coherent Nova metrics on default/analytics/ecommerce + finance reframed as Usage & Billing (PR #12) | d9cdccc |
| 2026-07-08 | Security-audit batch: CSP/CSRF findings documented, all CI actions pinned to SHAs (PR #10) | 4208cdc |
| 2026-07-08 | Login-polish: aurora background + trust badges on /login → main (PR #15) | 46d8359 |
| 2026-07-08 | Logout/bfcache fix: Back can't show a cached dashboard after logout (PR #14) | 6178f19 |
| 2026-07-08 | Landing v2 Lighthouse: desktop 100, mobile ~89–90 (CLS 0) — supersedes v1's 94-mobile static landing | 2306403 |
| 2026-07-08 | Pre-submission audit (10-dimension multi-agent + adversarial verify) + UI seam trim + docs reconcile; `COST-REPORT.md` + `AUDIT-PRE-SUBMISSION.md` added; **v1.0.0 release cut** | f4758a0 |
