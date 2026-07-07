# Key prompts per phase — appended as phases close

> How problems were decomposed for the agent team. One section per phase, written
> fresh from repo context (no raw transcripts, no personal content).

## Phase 0 — Setup & scaffolding

**Lead boot prompt (summary):** read the design spec and implementation plan in order;
confirm understanding in 5 lines; propose the phase's model/effort table before executing;
run Tasks 1–5 sequentially with verification at every step; stop only at decisions reserved
for the human (spike gate, VPS credentials, DNS, analytics pick).

**builder (Haiku, low) — agent role transcription:** "Create 10 agent-role definition files
with EXACTLY this content [full file contents inlined]. Do NOT run git. Do NOT create other
files. Verify by listing the directory and reporting filenames + line counts." — Pure
transcription task: full content provided, zero improvisation allowed, self-verification step
required, git reserved to the Lead.

## Phase 1 — Auth (spike → stabilize)

**Spike framing (Lead/auth-engineer):** time-boxed exploration on `spike/better-auth` to learn
real behavior before formalizing: session cookie name/flags, middleware visibility, App Router
caching quirks. Findings land in BRAIN, not in promises. Gate: if the integration fails
fundamentally within the time-box → stop, write findings, consult Roberto, execute the ADR-002
fallback (Auth.js v5). It didn't fail — gate passed.

**builder (Haiku, low) — seed script:** exact file content + package.json script line inlined;
explicit constraint that tsx does not auto-load .env (hence `--env-file=.env`); verification
protocol = run twice, expect "created" then "already exists (ok)"; report exact console output;
stop on any unexpected error instead of improvising.

**reviewer (adversarial, high effort) — PR #1:** "You are adversarial. Your job is to find
what's wrong, not to approve." Scope pinned to the diff (`git diff develop...feature/auth`)
with a context block of known/by-design decisions (dev port 5434, `--force` in CI, branding
deferred to Phase 2) to prevent noise findings. Focus areas enumerated: session/cookie
handling, auth config hardening, error paths, secret leaks, seed honesty, e2e flakiness.
Required output: findings with severity + file:line + concrete failure scenario + suggested
fix, ending in MERGE / MERGE AFTER FIXES / DO NOT MERGE. Result: 3 MAJOR + 4 MINOR found,
verdict MERGE AFTER FIXES — all fixed or explicitly waived with rationale (see BRAIN).
