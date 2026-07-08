# Nova Analytics — Roadmap (canonical map)

> Session boot: read this file → BRAIN.md → latest SESSION-LOG.md entry, in that order, before any action.

## North star (PRD deliverables)
- [ ] Public repo fork with clear commits + README (stack, setup, env vars)
- [x] Whitelabel: zero original-branding traces in visible UI
- [x] Landing: hero + features + CTA, responsive, polished
- [x] Working signup/login (self-hosted) → redirect to dashboard
- [x] Live HTTPS deployment, stable through review window
- [ ] Video walkthrough (5–10 min) + submission package + behavioral questionnaire
- [ ] Bonus: process logs, CI/CD, tests, custom domain, monitoring/analytics

## Phases
| # | Phase | Status | Exit criteria | Closed at (commit) |
|---|---|---|---|---|
| 0 | Setup & scaffolding | ✅ | App runs locally; CI green on skeleton | 423d359 |
| 1 | Auth (spike → stabilize) | ✅ | e2e: signup→login→dashboard→logout | dac7bd1 |
| 2 | Whitelabel | ✅ | Branding grep = 0 hits, CI-enforced | 1e6a511 |
| 3 | Landing | ✅ | Lighthouse ≥90 mobile; CTA→signup works | 6cd239e |
| 4 | Deploy | ✅ | Public HTTPS + push-to-deploy + audit gate + uptime monitoring (UptimeRobot **LIVE**) | af6625c |
| 5 | Hardening | ⬜ | Full suite green in CI; review findings fixed | — |
| 6 | Delivery | ⬜ | PRD checklist 100% + final audit gate | — |

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
