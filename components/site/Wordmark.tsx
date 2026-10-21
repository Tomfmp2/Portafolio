/** The logotype: the first name in brush script, signed rather than typeset. */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`} aria-label="Tomás Medina" role="img">
      <span aria-hidden="true">Tomás</span>
    </span>
  );
}
