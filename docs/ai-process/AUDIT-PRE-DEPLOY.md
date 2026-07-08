# Auditor gate — pre-deploy (Phase 4)

Date: 2026-07-08 · Scope: is the deployed system safe to expose? Independent of feature work.

| Check | Result | Notes |
|---|---|---|
| Secrets in git history | ✅ pass | `git log -p --all` scan for real secret assignments / PEM blocks: none. Only placeholders (`<generate…>`, `ci-only-secret-not-production`). |
| `.env` tracked | ✅ pass | Not tracked; `.gitignore` covers `.env*` except `.env.example`. |
| Prod cookie flags | ✅ pass | Verified on live HTTPS: `__Secure-better-auth.session_token; HttpOnly; Secure; SameSite=Lax`. |
| Security headers | ✅ fixed | Were MISSING in prod; added via `next.config.mjs` headers() — HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy. Verified locally; ships in this deploy. |
| Rate limiting | ✅ pass | Better Auth default rate limiting is enabled in production (NODE_ENV=production in the image). Auth routes covered. |
| `npm audit --omit=dev` | ⚠ accepted | 6 moderate, all one advisory: postcss pulled transitively by Next. **Build-time only** (CSS is first-party, no user-supplied CSS at runtime). Fix requires a breaking Next change; not warranted for a build-time moderate. Re-evaluate on the next Next minor. |
| CI deploy access | ⚠ noted | CI deploys over SSH as `root` via a **dedicated, revocable** ed25519 key (not Roberto's personal key). On this host `docker` group ≈ root, so a locked-down deploy user adds little real isolation; a future hardening, not a blocker. |
| Container isolation | ✅ pass | web mem_limit 512m, db 384m; DB port bound to 127.0.0.1; blast radius capped (ADR-003). |

**Verdict:** cleared for deploy. The one code fix (security headers) is included; the two ⚠
items are assessed and accepted with rationale, not open holes.
