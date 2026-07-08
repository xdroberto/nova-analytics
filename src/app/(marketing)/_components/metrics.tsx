import { CountUp } from "./interactive";

/** KPI band — numbers count up as they enter view (CountUp). Suffix colors and
 * copy are verbatim from the operator design. */
const METRICS = [
  { value: 99.99, decimals: 2, suffix: "%", accent: "var(--chart-2)", label: "Uptime, last 12 months", format: false },
  { value: 340, decimals: 0, suffix: "ms", accent: "var(--chart-1)", label: "Median query, P50", format: false },
  { value: 1200, decimals: 0, suffix: "+", accent: "var(--chart-2)", label: "Teams reading clearly", format: true },
] as const;

export function Metrics() {
  return (
    <section
      id="metrics"
      aria-label="Key metrics"
      className="relative z-10 border-y"
      style={{
        borderColor: "color-mix(in oklab, var(--chart-5) 8%, transparent)",
        background: "color-mix(in oklab, var(--card) 40%, transparent)",
      }}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-[72px] text-center sm:grid-cols-3">
        {METRICS.map((m) => (
          <div key={m.label} className="nv-reveal-scroll">
            <div className="font-heading font-bold text-[clamp(2.5rem,5vw,3.25rem)] text-white leading-none tracking-[-0.03em]">
              <CountUp value={m.value} decimals={m.decimals} format={m.format} />
              <span style={{ color: m.accent }}>{m.suffix}</span>
            </div>
            <div className="mt-3 text-[13.5px] text-foreground-tertiary uppercase tracking-[0.08em]">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
