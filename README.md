# Nova Analytics

**See your data become light.** Nova Analytics turns raw numbers into decisions your whole team can read — real-time dashboards, self-hosted and private.

> Live: `https://nova.robertobh.dev` (Phase 4) · Built with Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, Better Auth, Drizzle ORM, and Postgres 17.

## Quickstart

```bash
git clone https://github.com/xdroberto/nova-analytics.git
cd nova-analytics
npm ci
npm run prepare        # one-time: installs git hooks (skipped by ignore-scripts)
cp .env.example .env   # fill BETTER_AUTH_SECRET (openssl rand -base64 32)
docker compose -f docker-compose.dev.yml up -d
npx drizzle-kit push --force
npm run seed
npm run dev            # http://localhost:3000
```

> Supply-chain note: installs run with `ignore-scripts=true` (`.npmrc`) — dependency
> lifecycle scripts never execute, in dev, CI, or the production image build.

## Auth

Self-hosted email/password auth (Better Auth + Drizzle + Postgres — no managed auth vendors).
Users and revocable sessions live in our own database. `/dashboard/*` is protected by an
optimistic cookie check in `src/proxy.ts` plus an authoritative server-side session check.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `BETTER_AUTH_SECRET` | Session signing secret |
| `BETTER_AUTH_URL` | Public base URL of the app |
| `SEED_PASSWORD` | Optional override for the seeded reviewer user |

## AI development process

This product is built with a disciplined agentic workflow — canonical state in
[`docs/ai-process/`](docs/ai-process/) (roadmap, live BRAIN, session log, prompts, agent team).

## License & attribution

MIT. Based on the open-source [next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard)
template by Arham Khan — original copyright retained in [LICENSE](LICENSE) as required.
