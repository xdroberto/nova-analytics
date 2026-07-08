import Link from "next/link";

/** Precomputed bar chart geometry (from the operator design). */
const BARS: { x: number; y: number; h: number; cyan: boolean; delay: number }[] = [
  { x: 24, y: 152, h: 80, cyan: true, delay: 0.1 },
  { x: 86, y: 120, h: 112, cyan: false, delay: 0.2 },
  { x: 148, y: 136, h: 96, cyan: true, delay: 0.3 },
  { x: 210, y: 88, h: 144, cyan: false, delay: 0.4 },
  { x: 272, y: 104, h: 128, cyan: true, delay: 0.5 },
  { x: 334, y: 56, h: 176, cyan: false, delay: 0.6 },
  { x: 396, y: 76, h: 156, cyan: true, delay: 0.7 },
  { x: 458, y: 32, h: 200, cyan: false, delay: 0.8 },
];
const DOTS: { cx: number; cy: number; delay: number }[] = [
  { cx: 41, cy: 132, delay: 1.1 },
  { cx: 227, cy: 68, delay: 1.6 },
  { cx: 351, cy: 38, delay: 2.0 },
  { cx: 475, cy: 14, delay: 2.4 },
];

/** Live-dashboard preview card — glass panel, floats, chart draws in on load. */
function HeroPreview() {
  return (
    <div className="nv-reveal [perspective:1200px]" style={{ animationDelay: "0.25s" }}>
      <div
        className="nv-float relative rounded-[20px] border border-[color-mix(in_oklab,var(--chart-5)_16%,transparent)] p-6 shadow-[0_40px_90px_rgba(0,0,0,0.55),0_0_80px_color-mix(in_oklab,var(--primary)_12%,transparent)] backdrop-blur-md"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--card) 92%, white 3%), color-mix(in oklab, var(--card) 96%, black 4%))",
        }}
      >
        {/* window chrome + LIVE */}
        <div className="mb-[18px] flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[color-mix(in_oklab,var(--chart-5)_28%,transparent)]" />
          <span className="size-2.5 rounded-full bg-[color-mix(in_oklab,var(--chart-5)_28%,transparent)]" />
          <span className="size-2.5 rounded-full bg-[color-mix(in_oklab,var(--chart-5)_28%,transparent)]" />
          <span className="ml-3 h-3 max-w-[180px] flex-1 rounded-md bg-[color-mix(in_oklab,var(--chart-5)_10%,transparent)]" />
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--chart-1)]">
            <span className="nv-pulse size-1.5 rounded-full bg-[var(--chart-1)]" />
            LIVE
          </span>
        </div>

        {/* mini stats */}
        <div className="mb-4 flex gap-5">
          {[
            { label: "Revenue", value: "$2.4M", delta: "↑ 18%" },
            { label: "Active now", value: "14,208", delta: "↑ 6%" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-xl border border-[color-mix(in_oklab,var(--chart-5)_8%,transparent)] bg-[color-mix(in_oklab,var(--chart-5)_5%,transparent)] px-3.5 py-3"
            >
              <div className="mb-1 text-[11px] uppercase tracking-[0.06em] text-foreground-tertiary">{s.label}</div>
              <div className="font-heading font-semibold text-[20px] text-white">
                {s.value} <span className="font-medium text-[12px] text-[var(--chart-4)]">{s.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* chart */}
        <svg
          viewBox="0 0 520 240"
          className="block w-full"
          role="img"
          aria-label="Illustrative real-time analytics chart"
        >
          <g stroke="color-mix(in oklab, var(--chart-5) 10%, transparent)" strokeDasharray="4 6">
            <line x1="0" y1="60" x2="520" y2="60" />
            <line x1="0" y1="120" x2="520" y2="120" />
            <line x1="0" y1="180" x2="520" y2="180" />
          </g>
          <g>
            {BARS.map((b) => (
              <rect
                key={b.x}
                x={b.x}
                y={b.y}
                width="34"
                height={b.h}
                rx="6"
                fill={b.cyan ? "var(--chart-1)" : "var(--chart-2)"}
                className="nv-bar"
                style={{ animationDelay: `${b.delay}s` }}
              />
            ))}
          </g>
          <polyline
            points="41,132 103,102 165,116 227,68 289,86 351,38 413,58 475,14"
            fill="none"
            stroke="var(--chart-5)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="nv-draw"
          />
          <g fill="var(--chart-5)" stroke="var(--background)" strokeWidth="2">
            {DOTS.map((d) => (
              <circle
                key={`${d.cx}-${d.cy}`}
                cx={d.cx}
                cy={d.cy}
                r="4.5"
                className="nv-dot"
                style={{ animationDelay: `${d.delay}s` }}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative z-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pt-24 pb-20 md:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          {/* eyebrow badge */}
          <div className="nv-reveal mb-7 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--chart-5)_18%,transparent)] bg-[color-mix(in_oklab,var(--chart-5)_6%,transparent)] py-1.5 pr-3.5 pl-2 backdrop-blur-sm">
            <span className="nv-pulse size-[7px] rounded-full bg-[var(--chart-1)] shadow-[0_0_10px_var(--chart-1)]" />
            <span className="font-medium text-[12.5px] tracking-[0.04em] text-muted-foreground">
              Nova 3.0 — real-time engine, rebuilt
            </span>
          </div>

          <h1
            className="nv-reveal font-heading font-bold text-[clamp(2.75rem,5.2vw,4.25rem)] leading-[1.04] tracking-[-0.035em] text-white"
            style={{ animationDelay: "0.05s" }}
          >
            See your data
            <br className="hidden sm:block" /> become <span className="nv-shine">light</span>.
          </h1>

          <p
            className="nv-reveal mt-6 max-w-[440px] text-[18px] leading-[1.65] text-muted-foreground"
            style={{ animationDelay: "0.1s" }}
          >
            Nova Analytics turns raw numbers into decisions your whole team can read — governed, private, and live to
            the second.
          </p>

          <div className="nv-reveal mt-9 flex flex-wrap items-center gap-3.5" style={{ animationDelay: "0.15s" }}>
            <Link
              prefetch={false}
              href="/signup"
              className="inline-flex items-center rounded-xl px-7 py-[15px] font-heading font-semibold text-[15px] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.14)_inset,0_12px_36px_color-mix(in_oklab,var(--primary)_40%,transparent)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 72%, black))",
              }}
            >
              Get started
            </Link>
            <Link
              prefetch={false}
              href="/login"
              className="inline-flex items-center rounded-xl border border-[color-mix(in_oklab,var(--chart-5)_18%,transparent)] bg-[color-mix(in_oklab,var(--chart-5)_6%,transparent)] px-7 py-[14px] font-heading font-semibold text-[15px] text-foreground backdrop-blur-sm transition-[transform,border-color,background] duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--chart-5)_40%,transparent)] hover:bg-[color-mix(in_oklab,var(--chart-5)_10%,transparent)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Watch live demo
            </Link>
          </div>

          <div
            className="nv-reveal mt-9 flex items-center gap-2.5 text-[13px] text-foreground-tertiary"
            style={{ animationDelay: "0.2s" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--chart-1)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            SOC 2 Type II · Self-hosted · No data leaves your infrastructure
          </div>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}
