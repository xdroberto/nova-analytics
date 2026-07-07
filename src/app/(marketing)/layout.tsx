import type { ReactNode } from "react";

import Link from "next/link";

import { NovaLogo } from "@/components/nova-logo";
import { Button } from "@/components/ui/button";

/**
 * Marketing layout — dark-first by design: the landing always renders the
 * "aurora tech" dark tokens (brand statement), independent of the app's
 * user-facing theme toggle. The `dark` class scopes the .dark token block
 * to everything inside.
 */
export default function MarketingLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="dark">
      <div className="flex min-h-dvh flex-col bg-background text-foreground">
        <header className="sticky top-0 z-40 border-border/60 border-b bg-background/80 backdrop-blur-md">
          <nav aria-label="Main" className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
            <Link prefetch={false} href="/" className="rounded-md focus-visible:outline-2 focus-visible:outline-ring">
              <NovaLogo size={24} />
            </Link>
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
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-border/60 border-t">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
            <NovaLogo size={18} />
            <div className="flex items-center gap-6 text-muted-foreground text-sm">
              <Link prefetch={false} href="/login" className="transition-colors hover:text-foreground">
                Log in
              </Link>
              <Link prefetch={false} href="/signup" className="transition-colors hover:text-foreground">
                Sign up
              </Link>
            </div>
            <p className="text-muted-foreground text-sm">© 2026 Nova Analytics</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
