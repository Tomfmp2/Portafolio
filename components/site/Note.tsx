type Arrow = "left" | "down-left" | "up-left" | "down" | "none";

/* Hand-drawn arrows (single strokes, so DrawSVG can "write" them). */
const PATHS: Record<Exclude<Arrow, "none">, { d: string; head: string; box: string }> = {
  left: { d: "M58 14 C40 4 22 8 6 16", head: "M14 8 L5 16 L15 22", box: "0 0 64 28" },
  "down-left": { d: "M54 4 C52 26 36 40 10 44", head: "M20 36 L9 44 L21 50", box: "0 0 60 54" },
  "up-left": { d: "M54 50 C50 28 34 12 10 8", head: "M22 2 L9 8 L19 18", box: "0 0 60 54" },
  down: { d: "M20 4 C30 18 30 34 22 50", head: "M14 42 L22 51 L30 42", box: "0 0 40 56" },
};

/**
 * A margin note in handwriting, the way someone annotates a printed CV. It is
 * supporting commentary, so it is hidden from assistive tech when the same
 * fact is already stated in the main text (decorative = true).
 */
export default function Note({
  children,
  arrow = "left",
  className = "",
  decorative = false,
}: {
  children: React.ReactNode;
  arrow?: Arrow;
  className?: string;
  decorative?: boolean;
}) {
  const path = arrow === "none" ? null : PATHS[arrow];
  return (
    <span className={`note ${className}`} data-note aria-hidden={decorative || undefined}>
      {path && (
        <svg viewBox={path.box} width="48" height="40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={path.d} data-draw />
          <path d={path.head} data-draw />
        </svg>
      )}
      <span>{children}</span>
    </span>
  );
}
