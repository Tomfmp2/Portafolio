/**
 * AmbientGlow — Cinematic static side-glow background effect
 *
 * KEY: position ABSOLUTE — stays attached to the document flow (scrolls with page).
 * Placed only below the carousel (from ~25% down the page).
 * z-index: 1 → above backgrounds, below content (z-10)
 */
import "./AmbientGlow.css";

export default function AmbientGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      <div className="glow-orb glow-1" />
      <div className="glow-orb glow-2" />
      <div className="glow-orb glow-3" />
      <div className="glow-orb glow-4" />
    </div>
  );
}
