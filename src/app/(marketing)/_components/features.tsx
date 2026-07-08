import { Activity, ShieldCheck, Users, Zap } from "lucide-react";

import { SpotlightGroup } from "./interactive";

/** Four pillars — icons reuse the project's lucide set; accent alternates
 * cyan/violet per the operator design. Copy is verbatim from the design. */
const FEATURES = [
  {
    icon: Activity,
    accent: "cyan",
    title: "Real-time dashboards",
    body: "Live charts that update as your data moves — no refresh, no waiting. Sub-second latency from event to pixel.",
  },
  {
    icon: ShieldCheck,
    accent: "violet",
    title: "Self-hosted & private",
    body: "Your data never leaves your infrastructure. Deploy on your cloud, your keys, your audit trail.",
  },
  {
    icon: Users,
    accent: "violet",
    title: "Team-ready access",
    body: "Bring the whole team: accounts, revocable sessions, and role-based access control built in.",
  },
  {
    icon: Zap,
    accent: "cyan",
    title: "Fast setup",
    body: "From clone to first insight in minutes, not sprints. One binary, one config, zero ceremony.",
  },
] as const;

const ACCENT = {
  cyan: {
    chip: "color-mix(in oklab, var(--chart-1) 9%, transparent)",
    ring: "color-mix(in oklab, var(--chart-1) 22%, transparent)",
    ink: "var(--chart-1)",
  },
  violet: {
    chip: "color-mix(in oklab, var(--chart-2) 10%, transparent)",
    ring: "color-mix(in oklab, var(--chart-2) 26%, transparent)",
    ink: "var(--chart-2)",
  },
} as const;

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24"
    >
      <div className="nv-reveal-scroll mb-14 max-w-xl">
        <div className="mb-3.5 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--chart-1)]">
          01 — Platform
        </div>
        <h2
          id="features-heading"
          className="mb-4 font-heading font-bold text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.12] tracking-[-0.03em] text-white"
        >
          Everything you need to read the room
        </h2>
        <p className="text-[16.5px] text-muted-foreground leading-[1.65]">
          Four pillars, one calm surface. Built for teams that make decisions on the numbers, not around them.
        </p>
      </div>

      <SpotlightGroup className="grid gap-5 sm:grid-cols-2">
        {FEATURES.map(({ icon: Icon, accent, title, body }) => {
          const a = ACCENT[accent];
          return (
            <article
              key={title}
              data-spotlight
              className="nv-reveal-scroll group relative overflow-hidden rounded-[18px] border border-[color-mix(in_oklab,var(--chart-5)_12%,transparent)] p-8 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--chart-5)_30%,transparent)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--card) 90%, white 2%), color-mix(in oklab, var(--card) 95%, black 4%))",
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(280px circle at var(--mx, 50%) var(--my, 0%), color-mix(in oklab, var(--primary) 16%, transparent), transparent 65%)",
                }}
              />
              <div
                className="relative mb-[22px] inline-flex size-[46px] items-center justify-center rounded-xl border"
                style={{ background: a.chip, borderColor: a.ring }}
              >
                <Icon className="size-[21px]" style={{ color: a.ink }} aria-hidden="true" />
              </div>
              <h3 className="relative mb-2.5 font-heading font-semibold text-[19px] text-white tracking-[-0.015em]">
                {title}
              </h3>
              <p className="relative text-[14.5px] text-muted-foreground leading-[1.65]">{body}</p>
            </article>
          );
        })}
      </SpotlightGroup>
    </section>
  );
}
