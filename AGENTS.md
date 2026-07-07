# AGENTS.md

Nova Analytics — a self-hosted analytics dashboard (Next.js 16, React 19, TypeScript,
Tailwind CSS v4, shadcn/ui, Better Auth, Drizzle, Postgres 17).

**All agent operating context lives in [`CLAUDE.md`](CLAUDE.md)** — session boot protocol,
inviolable rules, working agreement, and commands. Read it first; then follow its boot
sequence (`docs/ai-process/ROADMAP.md` → `BRAIN.md` → latest `SESSION-LOG.md` entry).

Note on shadcn styles: this repo uses the shadcn `radix-nova` style (Radix UI primitives).
Always inspect the local wrappers in `src/components/ui/` before assuming primitive behavior.
