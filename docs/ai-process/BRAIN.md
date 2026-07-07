# BRAIN — canonical live state (the GPS)

> Rules: (1) read me first, (2) fix me if any file contradicts me, (3) update me after
> every significant action, (4) never reconstruct state from chat memory.

## Current position
- Phase: 0 (Setup & scaffolding)
- Current task: Tasks 2–5 (canonical state, CLAUDE.md, agent roles, CI skeleton) — in progress
- Blockers: none

## Immediate next step
Finish Phase 0 (Tasks 2–5) in order, verify CI green, then open Phase 1 (auth spike).

## Environment facts (discovered in Task 1 — source of truth for later tasks)
- Fork: `github.com/xdroberto/nova-analytics` — owner `xdroberto` → GHCR image `ghcr.io/xdroberto/nova-analytics`.
- Package manager: **npm** (`package-lock.json`). Node 24 local; CI/Docker pin Node 22.
- Framework: Next.js **16.2.10** (Turbopack), React 19.2, Tailwind v4, shadcn/ui.
- App dir: **`src/app`** (not root `app/`). Template package name: `studio-admin` (branding target).
- Lint/format: **Biome** (`npm run lint` = `biome lint`; `npm run check`). No `typecheck` script → CI uses `npx tsc --noEmit`.
- Routing today: `/` → 307 redirect (template sends `/` elsewhere; becomes landing in Phase 3). `/login` → 404 (auth screens live under another path — locate in Phase 1 / Task 8).
- Theme presets system present (`src/scripts/generate-theme-presets.ts`, `npm run generate:presets`) → whitelabel via a `nova` preset (Task 14).
- ⚠ Known issue: Next infers workspace root from a stray `C:\Users\xdrob\package-lock.json`. Fix by setting `turbopack.root` + `outputFileTracingRoot` to the project dir in `next.config.mjs` when touching it (Task 20; earlier if build tracing misbehaves).
- `npm audit`: 2 moderate vulnerabilities noted → review in Phase 4 audit gate.

## Decisions log (newest first)
- 2026-07-07: Spike & stabilize for auth; auditor role added; capture-as-you-go evidence. (spec §5–§8)
- 2026-07-07: Dedicated Hetzner CPX11 for hosting; builds only in CI; GHCR images. (ADR-003)
- 2026-07-07: Better Auth + Drizzle + Postgres 17; NO Supabase/managed auth. (ADR-002)
- 2026-07-07: Base repo: arhamkhnz/next-shadcn-admin-dashboard. (ADR-001)

## Model/effort assignments (Phase 0)
| Task | Nature | Model | Effort | Executor |
|---|---|---|---|---|
| 1 Fork/clone/boot | Operational (gh, npm, docker) | Opus 4.8 | high | Lead |
| 2 Docs + canonical state | Foundational file creation | Sonnet 5 | medium | Lead |
| 3 CLAUDE.md | Boot protocol + real commands | Sonnet 5 | medium | Lead |
| 4 Agent roles (10 files) | Mechanical, repeated pattern | Haiku 4.5 | low | builder subagent |
| 5 CI skeleton | Standard YAML + verify green | Sonnet 5 | medium | Lead |

## Open items
- Deadline answer from employer (asked 2026-07-07)
- Logo asset from Roberto (placeholder spark in use)
- VPS credentials (Phase 4), DNS for `nova.robertobh.dev` (Phase 4), analytics pick (Phase 4)
