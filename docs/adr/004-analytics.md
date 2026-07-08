# ADR-004: Analytics — defer heavy analytics; uptime monitoring only

**Status:** Accepted (2026-07-08) · **Deciders:** Lead + Roberto (devops)

## Context

The spec lists "basic self-hosted-friendly analytics (Plausible script or lightweight
page-view counter)" as an evaluated bonus, with the final call deferred to Phase 4. That
call now has to respect the ADR-003 amendment: Nova shares a ~1.9 GiB host with a portfolio
that must stay up during hiring.

## Decision

**No product-analytics service is deployed for the trial.** Operational visibility is
covered by uptime monitoring (UptimeRobot on `/api/health`, 5-min interval). Product
page-view analytics is deferred, with a documented self-hosted-friendly path for later.

## Monitoring status — LIVE (2026-07-08)

The UptimeRobot monitor is live and confirmed (Roberto's account; evidence screenshot captured on his
side): an HTTP(s) monitor on `https://nova.robertobh.dev/api/health`, 5-minute interval, email alerts,
with SSL-certificate-expiry watch included. This satisfies the operational-visibility decision above and
closes the last Phase-4 item. Nova's health route returns `{"status":"ok","db":"up"}` (200) when the pool
is healthy and 503 (degraded) when the DB is down — see `docs/deployment.md`.

## Rationale

- **Plausible self-hosted** needs ClickHouse — ~1 GB+ RAM on its own. Incompatible with the
  shared-host memory budget (ADR-003); it would threaten the portfolio it sits next to.
- **Plausible/GA cloud** — a managed vendor that ships visitor data off-box; conflicts with
  the "self-hosted & private" story the product itself advertises on its landing page.
- **A middleware page-view counter** (write a row per request to our Postgres) is cheap on
  RAM but adds a DB write to the hot path for marginal value on a sample-data demo, and
  needs a dashboard to be worth anything.

For a trial, spending the memory/complexity budget on analytics buys little; spending it on
staying up (monitoring) buys the thing that actually matters over an unattended window.

## Future path (not built now)

If analytics is wanted later, **Umami** is the fit: self-hosted, Postgres-backed (reuses the
existing `shared-postgres` instance — no ClickHouse), ~150 MB container. It slots into the
same isolation model (own compose project, mem_limit, `data` network) without violating the
budget. A minimal server-side counter remains the even-lighter fallback.
