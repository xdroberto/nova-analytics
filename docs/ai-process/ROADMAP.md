# Nova Analytics — Roadmap (canonical map)

> Session boot: read this file → BRAIN.md → latest SESSION-LOG.md entry, in that order, before any action.

## North star (PRD deliverables)
- [ ] Public repo fork with clear commits + README (stack, setup, env vars)
- [ ] Whitelabel: zero original-branding traces in visible UI
- [ ] Landing: hero + features + CTA, responsive, polished
- [x] Working signup/login (self-hosted) → redirect to dashboard
- [ ] Live HTTPS deployment, stable through review window
- [ ] Video walkthrough (5–10 min) + submission package + behavioral questionnaire
- [ ] Bonus: process logs, CI/CD, tests, custom domain, monitoring/analytics

## Phases
| # | Phase | Status | Exit criteria | Closed at (commit) |
|---|---|---|---|---|
| 0 | Setup & scaffolding | ✅ | App runs locally; CI green on skeleton | 423d359 |
| 1 | Auth (spike → stabilize) | ✅ | e2e: signup→login→dashboard→logout | dac7bd1 |
| 2 | Whitelabel | ⬜ | Branding grep = 0 hits, CI-enforced | — |
| 3 | Landing | ⬜ | Lighthouse ≥90 mobile; CTA→signup works | — |
| 4 | Deploy | ⬜ | Public HTTPS + push-to-deploy + monitoring + audit gate | — |
| 5 | Hardening | ⬜ | Full suite green in CI; review findings fixed | — |
| 6 | Delivery | ⬜ | PRD checklist 100% + final audit gate | — |

## Milestone log
| Date | Milestone | Commit |
|---|---|---|
| 2026-07-07 | Design spec approved | (planning repo) |
| 2026-07-07 | Phase 0 closed: local boot + CI green on skeleton | 423d359 |
| 2026-07-07 | First self-hosted signup via curl (Better Auth spike gate passed) | 4aae990 |
| 2026-07-07 | Phase 1 closed: auth merged after adversarial review; e2e green in CI | dac7bd1 |
