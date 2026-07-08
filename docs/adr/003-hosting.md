# ADR-003: Hosting — Hetzner CPX11, CI-built images

**Status:** Accepted (2026-07-07) · **Amended 2026-07-08** (infra pivot, see below) ·
**Deciders:** Lead + Roberto

## Context

The product must stay publicly available and stable through an unattended review window
(1–2 weeks) at `https://nova.robertobh.dev`, with self-hosted Postgres (ADR-002) and a
demonstrable CI/CD story (evaluated bonus).

## Decision (as amended)

**Hetzner CPX11** (2 shared AMD vCPU / 2GB, x86_64, Ubuntu 24.04 LTS) running Docker
Compose (Next.js standalone + Postgres 17) behind Nginx with Let's Encrypt TLS.

### Amendment 2026-07-08 — pivot: dedicated server → reused existing host

The original decision called for a **dedicated** CPX11. Market pricing changed the math:
the legacy CPX11 price (~$6.99/mo) is no longer offered — a new CPX11 in Ashburn now
costs ~$21/mo (~3×), with EU regions no cheaper on this account. Decision: **reuse the
existing CPX11 at 178.156.248.110** (which already serves robertobh.dev static portfolio,
sideeffects static site, and the moonhouse Python service) and deploy Nova alongside them
with container isolation.

Server-type rationale: CPX11/x86 is already-paid capacity; shared AMD vCPUs are ample for
an SSR demo app, and x86 avoids any ARM image-compatibility surface in the GHCR pipeline.

**Trade-off, stated honestly:** a shared host means shared blast radius — a runaway Nova
process could previously only kill Nova; now it could degrade the portfolio that must stay
up during hiring. Mitigations: hard container memory limits (web + db) so Nova can never
OOM the host, 2G swap as safety net, `restart: always` policies, and operating rules
(static sites are never stopped; the only pause candidate is moonhouse, and only with
explicit owner approval after reviewing measurements).

- **The VPS never builds.** GitHub Actions builds and tests on every push; on `main` it
  builds the Docker image, pushes to GHCR (`ghcr.io/xdroberto/nova-analytics`), and
  SSH-deploys: the VPS pulls and restarts, gated by `/api/health`.
- Isolation on the shared host: container memory limits cap Nova's worst case; 2G swap
  as a safety net; `restart: always` + UptimeRobot on the health endpoint.

## Alternatives considered

- **Vercel + Neon** — fastest path, but hides the ops story the trial evaluates (Docker,
  Nginx, TLS, CI/CD pipeline) and splits data across a managed vendor. Kept as **Plan B**:
  config documented in the repo, switchable in minutes if the VPS misbehaves mid-review.
- Shared existing VPS — rejected: other projects could destabilize the demo.
- Fly.io / Railway — managed container platforms; same "ops story hidden" objection,
  plus cost/limits uncertainty over an unattended window.

## Consequences

- 2GB ceiling is respected by building only in CI (a `next build` would OOM alongside
  Postgres) — encoded as an inviolable rule in CLAUDE.md.
- Secrets split: runtime secrets live in the Nova deploy directory's `.env` (chmod 600);
  deploy credentials live in GitHub Secrets (`VPS_HOST`, dedicated `VPS_SSH_KEY`).
- Single region (Ashburn) — acceptable for a trial; documented limitation.
- Shared-host blast radius (post-amendment) is accepted and mitigated as described above;
  the dedicated-server option remains available at market price if the review window
  demands stronger isolation.
