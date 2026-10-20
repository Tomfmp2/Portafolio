/**
 * Where the 3D highlighter should be writing. Anything that draws a highlight
 * (a sweep on scroll, the hero intro, the visitor dragging on the hero) reports
 * the current tip position in viewport pixels; the pen flies there while
 * reports keep coming and goes back to rest when they stop.
 */
export const pen = { x: 0, y: 0, at: -Infinity };

/** How long after the last report the pen still counts as writing: it lingers before going back (ms). */
export const WRITING_GRACE = 650;

export function penWrite(x: number, y: number) {
  pen.x = x;
  pen.y = y;
  pen.at = performance.now();
}

export const isWriting = () => performance.now() - pen.at < WRITING_GRACE;

/**
 * Reports the tip at `progress` (0–1) along a highlighted phrase, following its
 * line boxes in reading order so a wrapped phrase is traced line by line.
 * Ignored while the phrase is off screen.
 */
export function penAlong(el: Element, progress: number) {
  const lines = Array.from(el.getClientRects()).filter((r) => r.width > 2);
  if (!lines.length) return;
  const first = lines[0];
  if (first.bottom < 0 || first.top > window.innerHeight) return;
  const total = lines.reduce((sum, r) => sum + r.width, 0);
  let remaining = Math.min(Math.max(progress, 0), 1) * total;
  for (const line of lines) {
    if (remaining <= line.width) {
      penWrite(line.left + remaining, line.top + line.height * 0.72);
      return;
    }
    remaining -= line.width;
  }
  const last = lines[lines.length - 1];
  penWrite(last.right, last.top + last.height * 0.72);
}

/** Seconds a sweep waits while the pen travels to the start of its phrase. */
export const PEN_APPROACH = 0.55;
