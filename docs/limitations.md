# Limitations & honest notes

The trial is a real, working product built on sample data — not a live business. This is the
honest list of what is intentionally out of scope or imperfect, kept current as things surface.

## Product scope (by design — YAGNI for a trial)

- **Sample data, not live ingestion.** Dashboards render realistic mock data; there is no
  real analytics pipeline behind them.
- **No email verification / password reset flows.** Signup logs you straight in; enough to
  demonstrate self-hosted credential auth, not a full account-lifecycle system.
- **No OAuth/social login.** Email + password only (the template's social button was removed).
- **Single region.** One VPS in Ashburn; no multi-region or CDN for the app itself.
- **No product analytics deployed.** Deferred on purpose (ADR-004) — self-hosting Plausible
  would bust the shared-host memory budget; uptime monitoring covers operational visibility.

## Infrastructure trade-offs

- **Shared host, not dedicated.** Nova runs alongside a portfolio + other sites on one CPX11
  (ADR-003 amendment, driven by a 3× price change). Blast radius is capped by container
  memory limits + swap + restart policies, but it is a shared host — honestly a weaker
  isolation story than the originally-planned dedicated box.
- **Reboot startup ordering.** Nova's web and Postgres are separate Compose projects, so a
  host reboot can briefly 500 the DB-backed dashboard routes until the pool reconnects
  (~seconds). The landing stays up throughout; accepted rather than blocking startup on the DB.
- **CI deploys as `root`** over SSH via a dedicated, revocable key. On this host `docker`
  group ≈ root, so a locked-down deploy user adds little real isolation; noted as future work.

## Known accepted findings

- **`npm audit`:** a moderate advisory (postcss, pulled transitively by Next) — build-time
  only, no user-supplied CSS at runtime. Fix needs a breaking Next change; re-evaluated per
  Next minor rather than force-fixed.

## Process slips caught & fixed (repo hygiene)

Two repository-hygiene slips got through in early phases; both are fixed, and the safeguard
below now prevents recurrence:

1. **36 inherited upstream branches** were never pruned after the fork (distributed ownership,
   no single guardian of branch hygiene). Cleanup is queued as the `repo-steward`'s first task,
   to run in its own dedicated session.
2. **A deploy script was silently swallowed by `.gitignore`.** The Phase-4 `*.sh` ignore rule
   only excepted `scripts/*.sh`, so `deploy/remote-deploy.sh` was untracked; the first
   push-to-deploy failed at the `scp` step (`tar: empty archive`) with no deployment and no
   downtime. Fixed in `171fc1e` (`!deploy/*.sh` exception + the script committed).

**Safeguard (Phase 4):** a `repo-steward` role was added with **mechanical** enforcement — a
commitlint CI gate (conventional commits, scoped strictly to each PR's own commit range, never
inherited history) — so repo cleanliness is checked by CI, not left to good intentions.
