import { Activity, ShieldCheck, Users, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Activity,
    title: "Real-time dashboards",
    body: "Live charts that update as your data moves — no refresh, no waiting.",
  },
  {
    icon: ShieldCheck,
    title: "Self-hosted & private",
    body: "Your data never leaves your infrastructure.",
  },
  {
    icon: Users,
    title: "Team-ready access",
    body: "Bring the whole team: accounts, revocable sessions, and access control built in.",
  },
  {
    icon: Zap,
    title: "Fast setup",
    body: "From clone to first insight in minutes, not sprints.",
  },
] as const;

export function Features() {
  return (
    <section aria-labelledby="features-heading" className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
      <h2 id="features-heading" className="mb-10 max-w-md font-semibold text-3xl tracking-tight md:text-4xl">
        Everything you need to read the room
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="group rounded-xl border border-border/80 bg-card/50 p-6 transition-colors hover:border-primary/50"
          >
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/15 text-[oklch(0.789_0.154_211.53)]">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <h3 className="mb-1.5 font-medium text-lg">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
