# ADR-003: Hosting — Hetzner CPX11, CI-built images

**Status:** Accepted (2026-07-07) · **Amended 2026-07-08** (infra pivot, see below) ·
**Deciders:** Lead + Roberto

## Context

The product must stay publicly available and stable through an unattended review window
(1–2 weeks) at `https://nova.robertobh.dev`, with self-hosted Postgres (ADR-002) and a
demonstrable CI/CD story (evaluated bonus).

## Decision (as amended)

**Hetzner CPX11** (2 shared AMD vCPU / 2 GB nominal, ~1.9 GiB usable, x86_64,
Ubuntu 24.04 LTS) behind Nginx with Let's Encrypt TLS. Nova runs as a **web-only** Docker
Compose project; **Postgres 17 runs as a separate, independent Compose project**
(`/opt/shared-postgres`) so Nova's lifecycle can never take the shared database down (see
the amendment for why, and `docs/deployment.md` for the topology). Images are built only in
CI and pulled by the VPS.

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
OOM the host, swap enlarged 2G → 3G as safety net, `restart: always` policies, and
operating rules (static sites are never stopped; the only pause candidate is moonhouse,
and only with explicit owner approval after reviewing measurements).

**Aggregate memory budget (~1.9 GiB usable RAM + 3G swap), sized to co-host a future IMCORE OS demo:**

| Component | Steady state | Hard cap |
|---|---|---|
| OS baseline (kernel, systemd, nginx, sshd) | ~350–400M | — |
| dockerd (post-restart; an idle daemon had bloated to 592M — restart reclaimed ~570M) | ~90–150M | — |
| moonhouse (Python/systemd) | ~100M | — |
| shared-postgres (nova DB now, `imcore_demo` later) | ~40–120M | 384M |
| nova web | ~150–250M | 512M |
| **Reserved for future IMCORE app** | — | **≥500M (RAM+swap)** |

Steady state (~0.9–1.1G) fits in RAM with minimal swap. Worst case — every cap hit
simultaneously plus the IMCORE reserve — leans on swap but stays contained: cgroup limits
mean the OOM killer acts inside the offending container, never against the host or the
static sites. Disk runs at ~82% (6.5G free) with two apps incoming → `docker image prune -f`
runs after every deploy, in CI's SSH step and in any manual redeploy.

- **The VPS never builds.** GitHub Actions builds and tests on every push; on `main` it
  builds the Docker image, pushes to GHCR (`ghcr.io/xdroberto/nova-analytics`), and
  SSH-deploys: the VPS pulls and restarts, gated by `/api/health`.
- Isolation on the shared host: container memory limits cap Nova's worst case; 3G swap
  (2G + 1G) as a safety net; `restart: always` + UptimeRobot on the health endpoint.

## Alternatives considered

- **Vercel + Neon** — fastest path, but hides the ops story the trial evaluates (Docker,
  Nginx, TLS, CI/CD pipeline) and splits data across a managed vendor. Kept as **Plan B**:
  config documented in the repo, switchable in minutes if the VPS misbehaves mid-review.
- Shared existing VPS — originally rejected (other projects could destabilize the demo),
  then **adopted** per the 2026-07-08 amendment once market pricing tripled the dedicated
  option; the destabilization risk is now managed by mem limits + swap + operating rules.
- Fly.io / Railway — managed container platforms; same "ops story hidden" objection,
  plus cost/limits uncertainty over an unattended window.

## Consequences

- The ~1.9 GiB usable RAM ceiling is respected by building only in CI (a `next build` would
  OOM alongside Postgres) — encoded as an inviolable rule in CLAUDE.md.
- Secrets split: runtime secrets live in `/opt/nova/.env` (chmod 600); deploy credentials
  live in GitHub Secrets (`VPS_HOST`, `VPS_USER`, dedicated `VPS_SSH_KEY`).
- GHCR image visibility must be resolved before the first pull: either make the package
  public or `docker login ghcr.io` on the VPS with a read-only PAT (see docs/deployment.md).
- Startup ordering after a host reboot is a known, accepted risk: the two Compose projects
  can't share `depends_on`, so the DB-backed dashboard routes may 500 for a few seconds
  until the pg pool reconnects. The landing is DB-independent and stays up; the pool
  self-heals (its `error` handler was added in Phase 1). A blocking wait-for-DB was
  rejected because it would also delay the landing — net worse for availability.
- Single region (Ashburn) — acceptable for a trial; documented limitation.
- Shared-host blast radius (post-amendment) is accepted and mitigated as described above;
  the dedicated-server option remains available at market price if the review window
  demands stronger isolation.
