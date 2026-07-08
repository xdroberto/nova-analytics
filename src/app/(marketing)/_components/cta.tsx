import Link from "next/link";

export function Cta() {
  return (
    <section id="cta" aria-labelledby="cta-heading" className="relative z-10 mx-auto w-full max-w-6xl px-6 py-28">
      <div
        className="nv-reveal-scroll relative overflow-hidden rounded-[24px] border px-6 py-20 text-center sm:px-12 sm:py-[88px]"
        style={{
          borderColor: "color-mix(in oklab, var(--chart-5) 16%, transparent)",
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--card) 85%, white 2%), color-mix(in oklab, var(--card) 92%, black 4%))",
        }}
      >
        <div
          aria-hidden="true"
          className="nv-pulse pointer-events-none absolute -top-40 left-1/2 h-[360px] w-[640px] -translate-x-1/2 rounded-[50%] blur-[50px]"
          style={{
            background:
              "radial-gradient(ellipse, color-mix(in oklab, var(--primary) 32%, transparent), transparent 65%)",
          }}
        />
        <div className="relative">
          <h2
            id="cta-heading"
            className="font-heading font-bold text-[clamp(2.125rem,3.8vw,3.125rem)] text-white tracking-[-0.03em]"
          >
            Start seeing clearly
          </h2>
          <p className="mx-auto mt-4 max-w-[420px] text-[17px] text-muted-foreground leading-[1.65]">
            Create your workspace and turn tonight's numbers into tomorrow's plan.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              prefetch={false}
              href="/signup"
              className="inline-flex items-center rounded-xl px-8 py-4 font-heading font-semibold text-[15px] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)_inset,0_16px_44px_color-mix(in_oklab,var(--primary)_50%,transparent)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 72%, black))",
              }}
            >
              Get started — it's free
            </Link>
            <Link
              prefetch={false}
              href="/login"
              className="inline-flex items-center rounded-xl border px-7 py-[15px] font-heading font-semibold text-[15px] text-foreground transition-[border-color,background-color,color] duration-200 hover:border-[color-mix(in_oklab,var(--chart-5)_45%,transparent)] hover:bg-[color-mix(in_oklab,var(--chart-5)_7%,transparent)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{ borderColor: "color-mix(in oklab, var(--chart-5) 20%, transparent)" }}
            >
              Talk to sales
            </Link>
          </div>
          <p className="mt-[26px] text-[13px] text-foreground-tertiary">
            No credit card required · Deploy in your own cloud
          </p>
        </div>
      </div>
    </section>
  );
}
