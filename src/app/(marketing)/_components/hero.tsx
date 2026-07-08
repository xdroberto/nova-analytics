import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Static, decorative chart composition — pure inline SVG on the chart tokens. */
function HeroChart() {
  // Precomputed [x, height, seriesA?] triples — x doubles as a stable key.
  const bars = [34, 52, 41, 66, 58, 82, 74, 96].map(
    (h, i) => [24 + i * 58, h, i % 2 === 0] as [number, number, boolean],
  );
  return (
    <div className="rounded-xl border border-border/80 bg-card/60 p-4 shadow-2xl backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-1.5" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-muted" />
        <span className="size-2.5 rounded-full bg-muted" />
        <span className="size-2.5 rounded-full bg-muted" />
        <span className="ml-3 h-5 w-40 rounded-md bg-muted" />
      </div>
      <svg viewBox="0 0 480 260" className="w-full" aria-hidden="true" role="presentation">
        {[40, 90, 140, 190, 240].map((y) => (
          <line key={y} x1="0" x2="480" y1={y} y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="4 6" />
        ))}
        {bars.map(([x, h, seriesA]) => (
          <rect
            key={x}
            x={x}
            y={240 - h * 2}
            width="34"
            height={h * 2}
            rx="6"
            fill={seriesA ? "var(--chart-1)" : "var(--chart-2)"}
            opacity={0.85}
          />
        ))}
        <polyline
          points="41,190 99,150 157,168 215,110 273,128 331,66 389,88 447,34"
          fill="none"
          stroke="var(--chart-3)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[
          [41, 190],
          [99, 150],
          [157, 168],
          [215, 110],
          [273, 128],
          [331, 66],
          [389, 88],
          [447, 34],
        ].map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="5"
            fill="var(--background)"
            stroke="var(--chart-3)"
            strokeWidth="3"
          />
        ))}
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Aurora glow — pure CSS, no JS, no images */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 size-[34rem] rounded-full bg-[oklch(0.575_0.235_277)] opacity-20 blur-[120px]" />
        <div className="absolute top-10 -right-32 size-[28rem] rounded-full bg-[oklch(0.789_0.154_211.53)] opacity-15 blur-[120px]" />
        <div className="absolute -bottom-48 left-1/3 size-[30rem] rounded-full bg-[oklch(0.606_0.25_292.717)] opacity-15 blur-[130px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <h1 className="text-balance font-semibold text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-tight">
            See your data become light
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
            Nova Analytics turns raw numbers into decisions your whole team can read.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 px-7 text-base">
              <Link prefetch={false} href="/signup">
                Get started
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
              <Link prefetch={false} href="/login">
                Live demo
              </Link>
            </Button>
          </div>
        </div>
        <HeroChart />
      </div>
    </section>
  );
}
