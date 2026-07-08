/** "Trusted by" logo strip — wordmarks scroll infinitely (nvMarquee). The
 * names are brand wordmarks (WCAG 1.4.3 exempt), rendered in the faint slate.
 * Duplicated once for a seamless loop; the copy is aria-hidden. */
const BRANDS = ["HELIOS", "QUANTA", "MERIDIAN", "ARCFIELD", "NORTHBEAM", "VELLUM"] as const;

export function Marquee() {
  return (
    <section aria-label="Trusted by data teams" className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-12">
      <p className="mb-6 text-center text-[12px] text-foreground-tertiary uppercase tracking-[0.14em]">
        Trusted by data teams at
      </p>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="nv-marquee">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: duplicated static list needs the index to stay unique
              key={`${brand}-${i}`}
              aria-hidden={i >= BRANDS.length}
              className="whitespace-nowrap pr-[72px] font-heading font-semibold text-[17px] text-foreground-faint tracking-[0.12em]"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
