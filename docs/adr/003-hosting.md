# ADR-003: Hosting — dedicated Hetzner VPS, CI-built images

**Status:** Accepted (2026-07-07) · **Deciders:** Lead + Roberto

## Context

The product must stay publicly available and stable through an unattended review window
(1–2 weeks) at `https://nova.robertobh.dev`, with self-hosted Postgres (ADR-002) and a
demonstrable CI/CD story (evaluated bonus).

## Decision

**Dedicated Hetzner CPX11** (2 vCPU / 2GB, Ubuntu 24.04) running Docker Compose
(Next.js standalone + Postgres 17) behind Nginx with Let's Encrypt TLS.

- **The VPS never builds.** GitHub Actions builds and tests on every push; on `main` it
  builds the Docker image, pushes to GHCR (`ghcr.io/xdroberto/nova-analytics`), and
  SSH-deploys: the VPS pulls and restarts, gated by `/api/health`.
- Dedicated instance: nothing else competes for the 2GB during the review window; swap
  configured as a safety net; `restart: always` + UptimeRobot on the health endpoint.

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
- Secrets split: runtime secrets live in `/home/deploy/nova/.env` (chmod 600); deploy
  credentials live in GitHub Secrets (`VPS_HOST`, dedicated `VPS_SSH_KEY`).
- Single region (Ashburn) — acceptable for a trial; documented limitation.
