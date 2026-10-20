/**
 * The name as a logotype: squeezed Bricolage, with the acute on the "á" drawn
 * as a stroke of the highlighter instead of the printed accent.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`} aria-label="Tomás Medina" role="img">
      <span aria-hidden="true">
        Tom<span className="accent">a</span>s Medina
      </span>
    </span>
  );
}
