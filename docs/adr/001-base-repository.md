# ADR-001: Base repository — arhamkhnz/next-shadcn-admin-dashboard

**Status:** Accepted (2026-07-07) · **Deciders:** Lead + Roberto (research: 3 parallel agents)

## Context

The trial requires forking an open-source dashboard and whitelabeling it as a real product
with self-hosted auth. The base repo choice drives every later phase: auth integration
friction, whitelabel surface, deploy weight, and license obligations.

## Decision

Fork [`arhamkhnz/next-shadcn-admin-dashboard`](https://github.com/arhamkhnz/next-shadcn-admin-dashboard).

- Next.js 16 App Router + TypeScript + Tailwind v4 + shadcn/ui; actively maintained; MIT.
- **No auth vendor to rip out** — auth screens are pre-designed but unwired, so our
  Better Auth stack plugs in cleanly (validated in Phase 1: zero fundamental friction).
- Theme-preset system → whitelabel via design tokens with a single source of truth
  (validated in Phase 2: the Nova palette shipped as the default preset in one file).

## Alternatives considered

- `Kiranism/next-shadcn-dashboard-starter` — more stars, but Clerk (managed auth) deeply
  wired; ripping it out conflicts with the self-hosted constraint and adds risk.
- `satnaing/shadcn-admin` — Vite SPA; mismatched with SSR session auth.
- `shadcn/taxonomy` — archived, stale dependencies.
- ToolJet / Directus / NocoDB — full products, AGPL or heavyweight; wrong license/scale
  for a 2GB VPS and a whitelabel exercise.

## Consequences

- MIT attribution retained in LICENSE and README (enforced by keeping them out of the
  branding gate's scan scope).
- Template ships many demo dashboards and mock-data modules — whitelabel had to sweep
  personas/company names across ~10 data files (done, CI-enforced).
- Upstream is pinned: no syncs during the trial (lockfile committed).
