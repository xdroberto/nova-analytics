"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useRef } from "react";

/**
 * Cursor-reactive card. A radial glow tracks the pointer via --mx/--my, and
 * (optionally) the card tilts toward it via --rx/--ry. Inert on touch devices
 * and when the user prefers reduced motion — the guard short-circuits, leaving
 * the CSS fallbacks (centered glow, no tilt). The consumer supplies the glow
 * element and reads the custom properties in its own styles.
 */
export function SpotlightCard({
  className,
  style,
  tilt = false,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  tilt?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (tilt) {
      el.style.setProperty("--rx", `${(y / r.height - 0.5) * -5}deg`);
      el.style.setProperty("--ry", `${(x / r.width - 0.5) * 5}deg`);
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (el && tilt) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={className} style={style}>
      {children}
    </div>
  );
}

/**
 * One delegated pointer listener for a group of cards, each marked with
 * `data-spotlight`. Sets --mx/--my on whichever card is under the cursor —
 * cheaper to hydrate than a client component per card. Inert under reduced motion.
 */
export function SpotlightGroup({ className, children }: { className?: string; children: ReactNode }) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div onPointerMove={onMove} className={className}>
      {children}
    </div>
  );
}
