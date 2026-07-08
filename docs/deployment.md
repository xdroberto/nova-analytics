# Deployment — shared Hetzner host with container isolation

Live at `https://nova.robertobh.dev`. Host: Hetzner CPX11 (2 vCPU / 2 GB nominal,
~1.9 GiB usable / Ubuntu 24.04.4), **shared** with two static sites and one Python service
(see ADR-003 amendment for the pivot rationale and the operating rules).

## Topology

```
nova.robertobh.dev ──> Nginx (TLS via Let's Encrypt, vhost per site)
                         └─> 127.0.0.1:3000 ──> docker: nova web (mem_limit 512m)
                                                  └─ network "data" ──> docker: shared-postgres
                                                                        (mem_limit 384m, DB "nova")
```

- **/opt/nova/** — `docker-compose.prod.yml` (web only) + `.env` (chmod 600:
  `DATABASE_URL` → `shared-postgres:5432/nova`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`).
- **/opt/shared-postgres/** — independent compose project: Postgres 17-alpine,
  `shared_buffers=128MB`, port bound to `127.0.0.1:5432` only, docker network `data`
  (external). Hosts the `nova` DB today; sized to host a future `imcore_demo` DB.
- Images are **built only in GitHub Actions** and pushed to GHCR; the VPS pulls
  (`ghcr.io/xdroberto/nova-analytics:latest`, plus a `:<sha>` tag per build for rollback
  references). `next build` never runs on the VPS.

## GHCR image access

The image lives in GHCR under `ghcr.io/xdroberto/nova-analytics`. GHCR packages are
**private by default on first push**, independent of the repo's visibility, so the VPS
needs read access before its first `docker pull`. One of:

- **Public package (chosen):** GitHub → the package → Package settings → change visibility
  to Public. Simplest for an open-source portfolio piece; no credential to store or rotate
  on the VPS. Requires the package to exist first (created by the first CI build).
- **Private + PAT:** `docker login ghcr.io -u xdroberto -p <PAT with read:packages>` on the
  VPS (persists to `~/.docker/config.json`). Keeps the image private at the cost of a token
  to manage.

## Startup ordering (accepted risk)

Nova's web and Postgres are separate Compose projects, so `depends_on` can't order them
across a host reboot. Accepted because the impact is small and self-healing: the landing is
DB-independent and stays up; only DB-backed dashboard routes may 500 for the few seconds
until the `pg` pool reconnects (its `error` handler was added in Phase 1). A blocking
wait-for-DB was rejected — it would delay the landing too, a net loss for availability.

## Memory budget (~1.9 GiB usable RAM + 3G swap)

| Component | Steady state | Hard cap |
|---|---|---|
| OS baseline + nginx + sshd | ~350–400M | — |
| dockerd (post-restart) | ~90–150M | — |
| moonhouse (Python) | ~100M | — |
| shared-postgres | ~40–120M | 384M |
| nova web | ~150–250M | 512M |
| **Reserved for future IMCORE app** | — | **≥500M (RAM+swap)** |

Steady state fits in RAM with minimal swap. Worst case (every cap hit simultaneously)
leans on swap but stays contained: the OOM killer acts inside the offending container's
cgroup — never against the host or the static sites.

## Disk hygiene

The host runs at ~82% disk with two apps incoming. `docker image prune -f` runs after
**every** successful deploy (inside `deploy/remote-deploy.sh`, which CI's SSH step invokes,
and in any manual redeploy) so superseded image layers never accumulate. Only dangling
(untagged) images are removed — never another project's tagged images.

## Redeploy & rollback

`deploy/remote-deploy.sh` (scp'd to `/opt/nova/` by CI, then run over SSH) captures the
currently-running image, pulls the new one, restarts, and health-checks with retries. If
the new image never becomes healthy it **rolls back** to the captured previous image and
still reports the deploy as failed — so a bad push during the unattended window self-heals
instead of leaving prod broken. The `:<sha>` tags in GHCR are additional immutable recovery
points.

## Migrations & seed

The standalone runtime image carries no dev tooling, so schema changes run **from a dev
machine** through an SSH tunnel to the VPS-local Postgres port:

```bash
ssh -L 15432:127.0.0.1:5432 root@VPS -N &
DATABASE_URL=postgresql://nova:<pw>@localhost:15432/nova npx drizzle-kit push --force
```

The reviewer user is seeded through the live API (same code path as the seed script):
`POST https://nova.robertobh.dev/api/auth/sign-up/email`.

## First-deploy checklist (performed 2026-07-08)

1. Evidence capture: `df -h`, `free -h` before/after `systemctl restart docker`
   (reclaimed ~570MB from an idle dockerd) — see `evidence/`.
2. Swap 2G → 3G: second 1G swapfile, persisted in fstab.
3. `docker network create data`; shared-postgres up (healthy), `nova` DB + role created.
4. `/opt/nova/.env` (chmod 600) with freshly generated secrets.
5. Nginx vhost from `deploy/nginx-nova.conf` + `certbot --nginx -d nova.robertobh.dev`
   (verified: valid ECDSA cert, HTTPS 502 until the app is up — TLS layer confirmed).
6. GHCR package visibility resolved (see "GHCR image access"); image pulled;
   `docker compose up -d`; `/api/health` returns `{"status":"ok"}`.
7. Schema pushed via tunnel; reviewer user seeded via the live signup API.
