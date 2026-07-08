import { Instrument_Sans, JetBrains_Mono, Sora } from "next/font/google";

/**
 * Marketing-only brand type (Phase 5.5 operator redesign). The dashboard keeps
 * its functional voice (Geist, via src/lib/fonts/registry.ts) — these fonts are
 * scoped to the (marketing) route group only. Weights are kept minimal to
 * protect the Lighthouse mobile >= 90 gate; if fonts threaten it we degrade to
 * Sora-only (see BRAIN Phase 5.5 decision). Self-hosted + latin subset via
 * next/font (no Google CDN), display: swap so type never blocks first paint.
 */
export const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-sora",
  preload: true, // headings = LCP element in the hero
});

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-instrument",
  // Not preloaded on purpose: the LCP element is the Sora <h1>; preloading the
  // body face competed for the critical request and pushed LCP out. size-adjust
  // (next/font) keeps CLS at 0 while it swaps in.
  preload: false,
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-jbm",
  preload: false, // tiny eyebrow/LIVE labels only — not render-critical
});
