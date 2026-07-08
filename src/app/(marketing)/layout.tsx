import "./motion.css";

import type { CSSProperties, ReactNode } from "react";

import Link from "next/link";

import { NovaLogo } from "@/components/nova-logo";
import { Button } from "@/components/ui/button";

import { SiteHeader } from "./_components/site-header";
import { instrumentSans, jetBrainsMono, sora } from "./fonts";

/**
 * Marketing layout — dark-first by design (aurora-tech v2). Forces the `.dark`
 * token block for the whole landing regardless of the app theme toggle, and
 * scopes the brand fonts (Sora headings / Instrument Sans body / JetBrains Mono
 * labels) to this route group only — the dashboard keeps Geist. A fixed CSS
 * aurora background sits behind every section (motion.css; reduced-motion safe).
 * nav/footer are the Phase 5.5 Batch 5 polish target; kept minimal for now.
 */
const marketingFontVars = {
  "--font-sans": "var(--font-instrument)",
  "--font-heading": "var(--font-sora)",
  "--font-mono": "var(--font-jbm)",
} as CSSProperties;

export default function MarketingLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div
      className={`${sora.variable} ${instrumentSans.variable} ${jetBrainsMono.variable} dark [color-scheme:dark] font-sans`}
      style={marketingFontVars}
    >
      <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground">
        {/* Dynamic aurora background — fixed behind all sections, pure CSS token-driven. */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div
            className="nv-aurora-1 absolute -top-56 -left-40 size-[45rem] rounded-full blur-[60px]"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary) 24%, transparent), transparent 65%)",
            }}
          />
          <div
            className="nv-aurora-2 absolute -top-36 -right-48 size-[40rem] rounded-full blur-[70px]"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--chart-1) 16%, transparent), transparent 65%)",
            }}
          />
          <div
            className="nv-aurora-1 absolute -bottom-72 left-1/4 size-[50rem] rounded-full blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary) 12%, transparent), transparent 65%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(color-mix(in oklab, var(--chart-5) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--chart-5) 6%, transparent) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage: "radial-gradient(ellipse 90% 60% at 50% 0%, black 30%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 90% 60% at 50% 0%, black 30%, transparent 100%)",
            }}
          />
        </div>

        <SiteHeader>
          <nav aria-label="Main" className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
            <Link
              prefetch={false}
              href="/"
              className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-ring"
            >
              <NovaLogo size={24} withWordmark={false} decorative />
              <span className="font-heading font-semibold text-[16px] text-white tracking-[-0.01em]">
                Nova Analytics
              </span>
            </Link>
            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#features"
                className="font-medium text-[14px] text-muted-foreground transition-colors hover:text-white"
              >
                Product
              </a>
              <a
                href="#metrics"
                className="font-medium text-[14px] text-muted-foreground transition-colors hover:text-white"
              >
                Customers
              </a>
              <a
                href="#cta"
                className="font-medium text-[14px] text-muted-foreground transition-colors hover:text-white"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link prefetch={false} href="/login">
                  Log in
                </Link>
              </Button>
              <Button asChild>
                <Link prefetch={false} href="/signup">
                  Get started
                </Link>
              </Button>
            </div>
          </nav>
        </SiteHeader>

        <main className="relative z-10 flex-1">{children}</main>

        <footer
          className="relative z-10 border-t"
          style={{ borderColor: "color-mix(in oklab, var(--chart-5) 8%, transparent)" }}
        >
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-5 px-6 py-10">
            <Link prefetch={false} href="/" className="flex items-center gap-2.5">
              <NovaLogo size={18} withWordmark={false} decorative />
              <span className="font-heading font-semibold text-[14px] text-foreground">Nova Analytics</span>
            </Link>
            <div className="flex flex-wrap items-center gap-7 text-[13.5px]">
              <Link
                prefetch={false}
                href="/login"
                className="text-foreground-tertiary transition-colors hover:text-white"
              >
                Log in
              </Link>
              <Link
                prefetch={false}
                href="/signup"
                className="text-foreground-tertiary transition-colors hover:text-white"
              >
                Sign up
              </Link>
            </div>
            <p className="text-[13px] text-foreground-tertiary">© 2026 Nova Analytics</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
