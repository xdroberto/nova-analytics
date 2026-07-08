import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section aria-labelledby="cta-heading" className="mx-auto w-full max-w-6xl px-6 pb-20 md:pb-28">
      <div className="relative overflow-hidden rounded-2xl border border-border/80 px-6 py-16 text-center">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-32 left-1/2 size-[26rem] -translate-x-1/2 rounded-full bg-[oklch(0.575_0.235_277)] opacity-25 blur-[110px]" />
        </div>
        <div className="relative flex flex-col items-center gap-5">
          <h2 id="cta-heading" className="text-balance font-semibold text-3xl tracking-tight md:text-4xl">
            Start seeing clearly
          </h2>
          <p className="max-w-md text-muted-foreground">
            Create your workspace and turn tonight's numbers into tomorrow's plan.
          </p>
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link prefetch={false} href="/signup">
              Get started
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
