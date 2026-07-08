# Nova Analytics — Architecture

Six diagrams of the running system. GitHub renders ` ```mermaid ` fences natively.
Each is generated from the real repo (`src/db/auth-schema.ts`, `src/proxy.ts`,
`.github/workflows/`, `deploy/`, `docs/deployment.md`) — not idealized.

## 1. System architecture

Request path (browser → TLS → app → DB) plus the CI-built image supply.

```mermaid
flowchart LR
    B["Browser"] -->|HTTPS| DNS["Cloudflare DNS<br/>nova.robertobh.dev (A, DNS-only)"]
    DNS --> NGINX

    subgraph vps["Hetzner CPX11 · 178.156.248.110"]
        NGINX["nginx<br/>TLS termination (certbot)"]
        subgraph net["docker network: data"]
            WEB["nova-web-1<br/>Next.js 16 standalone · Node 22<br/>mem_limit 512M"]
            PG[("shared-postgres<br/>Postgres 17 · mem_limit 384M<br/>DB: nova")]
        end
    end

    GHCR["GHCR<br/>ghcr.io/xdroberto/nova-analytics"]

    NGINX -->|"proxy 127.0.0.1:3000"| WEB
    WEB -->|"Better Auth + Drizzle<br/>127.0.0.1:5432"| PG
    GHCR -.->|"docker pull :latest"| WEB
```

> Security headers (HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy)
> are set app-side in `next.config.mjs`, so they hold even without nginx.

## 2. Database ERD

Better Auth schema (`src/db/auth-schema.ts`). `verification` is standalone; `session`
and `account` cascade-delete with their `user`.

```mermaid
erDiagram
    user ||--o{ session : "has"
    user ||--o{ account : "has"

    user {
        text id PK
        text email UK
        text name
        boolean email_verified
        text image
        timestamp created_at
        timestamp updated_at
    }
    session {
        text id PK
        text user_id FK
        text token UK
        timestamp expires_at
        text ip_address
        text user_agent
        timestamp created_at
    }
    account {
        text id PK
        text user_id FK
        text account_id
        text provider_id
        text password
        text access_token
        timestamp created_at
    }
    verification {
        text id PK
        text identifier
        text value
        timestamp expires_at
        timestamp created_at
    }
```

## 3. Auth flow (two-layer session check)

The edge proxy is optimistic (cookie presence only); the dashboard layout does the
authoritative `getSession()` against the DB.

```mermaid
sequenceDiagram
    actor U as User
    participant E as Edge proxy
    participant A as Better Auth
    participant L as Dashboard layout
    participant DB as Postgres

    U->>A: POST /sign-in (email + password)
    A->>DB: verify creds, create session row
    A-->>U: Set-Cookie better-auth.session_token (HttpOnly)

    U->>E: GET /dashboard/default (cookie)
    alt no cookie
        E-->>U: 307 redirect to /login
    else cookie present (optimistic pass)
        E->>L: forward
        L->>DB: auth.api.getSession()
        alt valid and unexpired
            L-->>U: render dashboard
        else forged or expired
            L-->>U: redirect via /api/session/clear to /login
        end
    end
```

## 4. CI/CD pipeline

`.github/workflows/ci.yml` gates every change; `deploy.yml` ships on `main`.

```mermaid
flowchart TD
    PUSH["git push / PR"] --> EV{"event"}
    EV -->|pull_request| PRJOBS["CI: commits (commitlint base..head)<br/>+ quality + e2e"]
    EV -->|"push (main/develop)"| CIJOBS["CI: quality + e2e<br/>(commits job skipped)"]

    CIJOBS -->|"branch = main"| DEP
    PRJOBS -.->|"after merge to main"| DEP

    subgraph DEP["deploy.yml — main only"]
        BUILD["build-push → GHCR :latest + :sha"] --> SCP["scp deploy/remote-deploy.sh"]
        SCP --> SSH["SSH: pull → compose up → health-retry"]
        SSH -->|healthy| PRUNE["prune old image ✓"]
        SSH -->|unhealthy| RB["rollback to previous image · exit 1 ✗"]
    end
```

> `quality` = lint + `tsc` + `test:unit` + branding gate + `next build`.
> `e2e` = Postgres service + `drizzle-kit push` + Playwright (incl. the security bypass suite).

## 5. VPS topology (shared host, isolated Nova)

One CPX11 hosts Nova alongside co-tenants; isolation is by container memory limits + swap
(ADR-003 amendment). `ufw` allows only 22/80/443.

```mermaid
flowchart TB
    subgraph vps["Hetzner CPX11 · Ubuntu 24.04 · ~2GB RAM + 3G swap · ufw 22/80/443"]
        NGINX["nginx — TLS for all vhosts"]
        subgraph nova["Nova (mem-limited)"]
            W["nova-web-1 · 512M"]
            P[("shared-postgres · 384M")]
        end
        subgraph co["Co-tenants"]
            PORT["portfolio (static)"]
            SE["sideeffects (static)"]
            MOON["moonhouse (Python)"]
            IM["imcore (docker)"]
        end
    end
    NGINX --> W
    NGINX --> PORT
    NGINX --> SE
    NGINX --> MOON
    W --> P
```

## 6. Branching & promotion model

`main` is deployable; `develop` integrates; `feature/*` (and `chore/*`) branch off develop.
A promotion PR to `main` runs the full CI incl. the commitlint gate, then merging deploys.

```mermaid
flowchart LR
    F["feature/*  ·  chore/*"] -->|PR| D["develop<br/>(integration)"]
    D -->|"promotion PR<br/>commitlint gate + full CI"| M["main<br/>(deployable)"]
    M -->|"push → deploy.yml"| PROD["production<br/>nova.robertobh.dev"]
```
