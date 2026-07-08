# Nova Analytics — Cost & Model Report

> The `model-strategist` role's deliverable (design spec §5, §7): which model + reasoning effort ran
> each task, and where the budget went. This is a **qualitative allocation report** reconstructed from
> the per-phase assignment tables in `BRAIN.md`. The trial did not meter per-task tokens/dollars, so the
> honest artifact is the model/effort **discipline**, not a billed ledger.

## Allocation policy

- Mechanical work → **Haiku 4.5 / low** effort.
- Standard implementation → **Sonnet 5 / medium**.
- Auth, architecture, adversarial review, hard debugging → **Opus 4.8 / high**.

The Lead session's own model was switched by the operator (`/model`) across phases; Lead-executed tasks
ran on the session model of the day — **Opus 4.8** early, then **Fable 5** from Phase 0's close onward.

## Per-phase actuals (from the BRAIN model/effort tables)

### Phase 0 — Setup & scaffolding
| Task | Model (actual) | Effort | Executor | Note |
|---|---|---|---|---|
| 1 Fork/clone/boot | Opus 4.8 | high | Lead | env discovery — needed judgment |
| 2 Docs + canonical state | Opus 4.8 | high | Lead | foundational precision; kept off Sonnet deliberately |
| 3 CLAUDE.md | Opus 4.8 | high | Lead | foundational |
| 4 Agent roles (10 files) | Haiku 4.5 | low | builder subagent | delegated as planned; Lead verified |
| 5 CI skeleton | Opus 4.8 | high | Lead | pre-validated lint/tsc/build locally before push |
> Tasks 2/3/5 could have gone to Sonnet to save budget; kept on Lead as high-leverage, low-volume
> foundational artifacts.

### Phase 1 — Auth (spike → stabilize)
| Task | Model (proposed) | Model (actual) | Effort | Executor |
|---|---|---|---|---|
| 6 Local Postgres | Sonnet / medium | Fable 5 (session) | high | Lead — port-collision debugging |
| 7 SPIKE Better Auth | Opus / high | Fable 5 (session) | high | Lead (auth-engineer hat) — succeeded inside time-box |
| 8–12 wire/protect/seed/e2e/review | Opus→Haiku per task | Fable 5 (session) + reviewer subagent | high→low | Lead + reviewer |
> Session model switched to Fable 5 after Phase 0 (operator `/model`); Lead-executed tasks ran on it.

### Phase 2 — Whitelabel
Branding inventory by **workflow finder agents** (Haiku / low, quota-limited to 1 of 6); an adversarial
**reviewer (Sonnet)** for the PR pass. Naming sweep + aurora tokens + the CI branding gate authored by the Lead.

### Phase 3 — Landing
| Task | Model | Effort | Executor |
|---|---|---|---|
| 17 Route structure | Fable 5 (session) | high | Lead |
| 18 Landing sections | Fable 5 (session) | high | Lead (ui-designer hat — subagents quota-limited) |
| 19 Quality gate (Lighthouse + e2e) | Fable 5 (session) | medium | Lead |
> Subagent quota (session limit + monthly spend cap) forced Lead-direct execution for Phase 3.

### Phases 4–5 — Deploy & Hardening
Devops (hat) for VPS / Docker / Nginx / TLS / CD; an **Opus-class reviewer subagent** for the capstone
adversarial review (dual mandate: auth/security depth + general correctness over the diff); a **security
(hat)** for SSH hardening + fail2ban verification.

### Phases 5.5 / 6 — UI polish, diagrams, delivery, audit
Landing v2 built in an **isolated git worktree** (ui-designer hat, screenshot-gated); a **multi-agent
dashboard-data workflow** for coherent metrics; and a **10-dimension pre-submission audit workflow**
(20 agents = 10 finders + 10 adversarial verifiers, ~1.38M subagent tokens) whose findings drove
`AUDIT-PRE-SUBMISSION.md`.

## Cost-discipline observations (honest)

- **Front-loaded foundational work on the strongest model** (Phase 0 process artifacts on Opus / Lead)
  instead of optimizing early tokens — high leverage, low volume.
- **Delegated the mechanical bulk cheaply** (agent-role files on Haiku; branding inventory on workflow
  finders) whenever subagent quota allowed.
- **Subagent quota was a real constraint** (session limit + monthly cap in Phase 3) — several phases ran
  Lead-direct as a result; the strategist logged it rather than hiding it.
- **Reserved multi-agent fan-out for where breadth pays** — branding inventory, dashboard-data coherence,
  and the pre-submission audit — not for routine implementation.
