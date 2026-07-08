"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

/**
 * Marketing header — fixed so it's always visible, transparent at the very top
 * of the page and transitioning to a glass bar once the user scrolls (mirrors
 * the operator design's nav). Scroll listener is passive; the visual change is
 * a pure CSS transition on a data attribute.
 */
export function SiteHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="fixed inset-x-0 top-0 z-40 border-transparent border-b backdrop-blur-0 transition-[background-color,border-color,backdrop-filter] duration-300 data-[scrolled=true]:border-border/60 data-[scrolled=true]:bg-background/70 data-[scrolled=true]:backdrop-blur-xl"
    >
      {children}
    </header>
  );
}
