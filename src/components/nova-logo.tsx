/**
 * Interim Nova Analytics brand mark: a 4-point spark (indigo outer + cyan inner).
 * The final asset swaps in here — every usage points at this single component.
 * Colors are fixed brand values (spec §4), not theme tokens, so the mark stays
 * identical across presets; use variant="onPrimary" on indigo/dark surfaces.
 */
export function NovaLogo({
  size = 28,
  withWordmark = true,
  variant = "brand",
}: {
  size?: number;
  withWordmark?: boolean;
  variant?: "brand" | "onPrimary";
}) {
  const outer = variant === "onPrimary" ? "#F8FAFC" : "#5B5FEF";
  const inner = "#22D3EE";
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Nova Analytics" role="img">
        <path d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z" fill={outer} />
        <path d="M12 6.5 L13.3 10.7 L17.5 12 L13.3 13.3 L12 17.5 L10.7 13.3 L6.5 12 L10.7 10.7 Z" fill={inner} />
      </svg>
      {withWordmark && <span className="font-semibold tracking-tight">Nova Analytics</span>}
    </span>
  );
}
