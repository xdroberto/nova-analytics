import "./auth-motion.css";

import type { ReactNode } from "react";

import { NovaLogo } from "@/components/nova-logo";
import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="relative order-2 hidden h-full overflow-hidden rounded-3xl bg-primary lg:flex">
          {/* Animated mesh-aurora background — pure backdrop, no foreground objects. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div
              className="auth-aurora-1 -top-24 -left-16 absolute size-[26rem] rounded-full blur-[55px]"
              style={{ background: "radial-gradient(circle, rgba(224,231,255,0.85), transparent 60%)" }}
            />
            <div
              className="auth-aurora-2 -right-16 absolute top-[12%] size-[24rem] rounded-full blur-[58px]"
              style={{ background: "radial-gradient(circle, rgba(34,211,238,0.6), transparent 60%)" }}
            />
            <div
              className="auth-aurora-1 -bottom-16 absolute left-1/4 size-[30rem] rounded-full blur-[64px]"
              style={{ background: "radial-gradient(circle, rgba(167,139,250,0.75), transparent 60%)" }}
            />
            <div
              className="auth-aurora-2 -left-10 absolute bottom-[28%] size-[22rem] rounded-full blur-[50px]"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4), transparent 62%)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
                maskImage: "radial-gradient(ellipse 120% 100% at 50% 0%, black, transparent 88%)",
                WebkitMaskImage: "radial-gradient(ellipse 120% 100% at 50% 0%, black, transparent 88%)",
              }}
            />
          </div>

          <div className="absolute top-10 z-10 space-y-1 px-10 text-primary-foreground">
            <NovaLogo size={40} withWordmark={false} variant="onPrimary" decorative />
            <h1 className="font-medium text-2xl">{APP_CONFIG.name}</h1>
            <p className="text-sm">See your data become light.</p>
          </div>

          <div className="absolute bottom-10 z-10 flex w-full justify-between px-10">
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">Real-time clarity</h2>
              <p className="text-sm">Live dashboards that turn your team's raw numbers into decisions.</p>
            </div>
            <Separator orientation="vertical" className="mx-3 h-auto!" />
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">Private by design</h2>
              <p className="text-sm">Self-hosted on your own infrastructure — your data never leaves home.</p>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
