import { gsap, SplitText } from "./gsap";
import type { Direction, StageChange } from "./deck";

/*
 * The shared vocabulary of the deck's transitions. Inside a scene, elements
 * opt in with attributes and enter / leave with it:
 *   [data-lines]   a highlighter block passes over each line, revealing it on the way in
 *                  and taking it away on the way out
 *   [data-reveal]  wipes in with a clip and a slight skew ("x": sideways)
 *   [data-hl]      the highlight is drawn across the phrase
 *   [data-note]    the margin note's arrow is drawn, then its words appear
 *   [data-count]   the number counts up
 * Anything under [data-motion-owned] is animated by its scene instead.
 */

const OWNED = "[data-motion-owned] *";

function pick<T extends Element>(root: Element, selector: string) {
  return Array.from(root.querySelectorAll<T>(selector)).filter((el) => !el.matches(OWNED));
}

/* ---------- Heading lines with highlighter covers ---------- */

const lineCache = new WeakMap<Element, { lines: HTMLElement[]; covers: HTMLElement[]; split: SplitText }>();

/** Splits a [data-lines] heading into masked lines with a cover each (once; reused afterwards). */
function linesOf(heading: HTMLElement) {
  const cached = lineCache.get(heading);
  if (cached && cached.lines[0]?.isConnected) return cached;
  const split = SplitText.create(heading, { type: "lines", mask: "lines", linesClass: "line-mask-inner" });
  const lines = split.lines as HTMLElement[];
  const covers = lines.map((line) => {
    const cover = document.createElement("span");
    cover.className = "line-cover";
    cover.setAttribute("aria-hidden", "true");
    line.parentElement!.appendChild(cover);
    return cover;
  });
  const entry = { lines, covers, split };
  lineCache.set(heading, entry);
  return entry;
}

/** Undoes every heading split under `root` (used when the content remounts or the deck turns off). */
export function revertLines(root: Element) {
  root.querySelectorAll<HTMLElement>("[data-lines]").forEach((heading) => {
    lineCache.get(heading)?.split.revert();
    lineCache.delete(heading);
  });
}

/** The highlighter passing over one line: it grows over it, the line swaps state underneath, it pulls away. */
function markerPass(tl: gsap.core.Timeline, cover: Element, at: number, swap: (at: number) => void) {
  tl.fromTo(cover, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.32, ease: "power2.in" }, at);
  swap(at + 0.32);
  tl.fromTo(cover, { scaleX: 1, transformOrigin: "right center" }, { scaleX: 0, duration: 0.32, ease: "power2.out", immediateRender: false }, at + 0.32);
}

/* ---------- Generic entrance and exit ---------- */

/** Adds the entrance of everything generic in `root` to `tl`, starting at `at`. */
export function enterContent(tl: gsap.core.Timeline, root: Element, at: number) {
  pick<HTMLElement>(root, "[data-lines]").forEach((heading, h) => {
    const { lines, covers } = linesOf(heading);
    tl.set(lines, { opacity: 0 }, 0);
    lines.forEach((line, i) =>
      markerPass(tl, covers[i], at + h * 0.15 + i * 0.14, (t) =>
        tl.fromTo(line, { opacity: 0, x: "-0.2em" }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, t)
      )
    );
  });

  const reveals = pick<HTMLElement>(root, "[data-reveal]");
  reveals.forEach((el, i) => {
    const sideways = el.dataset.reveal === "x";
    tl.fromTo(
      el,
      sideways ? { clipPath: "inset(0% 0% 0% 100%)", x: 80, y: 0, skewY: 0 } : { clipPath: "inset(100% 0% 0% 0%)", y: 56, x: 0, skewY: 4 },
      { clipPath: "inset(0% 0% 0% 0%)", x: 0, y: 0, skewY: 0, duration: 0.7, ease: "power3.out" },
      at + 0.15 + i * 0.07
    );
  });

  pick<HTMLElement>(root, "[data-hl]").forEach((mark, i) => {
    tl.fromTo(mark, { "--hl": "0%" }, { "--hl": "100%", duration: 0.8, ease: "power2.inOut" }, at + 0.55 + i * 0.12);
  });

  pick<HTMLElement>(root, "[data-note]").forEach((note) => {
    const strokes = note.querySelectorAll("[data-draw]");
    const words = note.querySelector(":scope > span");
    if (strokes.length) tl.fromTo(strokes, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, stagger: 0.12, ease: "power1.inOut" }, at + 0.9);
    if (words) tl.fromTo(words, { opacity: 0, x: 14, rotation: 6 }, { opacity: 1, x: 0, rotation: 0, duration: 0.5, ease: "back.out(2)" }, at + 1.05);
  });

  pick<HTMLElement>(root, "[data-count]").forEach((el) => {
    const value = Number(el.dataset.count);
    const n = { v: 0 };
    tl.fromTo(n, { v: 0 }, { v: value, duration: 1.2, ease: "power2.out", onUpdate: () => (el.textContent = String(Math.round(n.v))) }, at + 0.4);
  });
}

/** Adds the exit of everything generic in `root` to `tl`, starting at `at`. */
export function leaveContent(tl: gsap.core.Timeline, root: Element, at: number, dir: Direction) {
  pick<HTMLElement>(root, "[data-lines]").forEach((heading, h) => {
    const { lines, covers } = linesOf(heading);
    lines.forEach((line, i) =>
      markerPass(tl, covers[i], at + h * 0.1 + i * 0.08, (t) => tl.to(line, { opacity: 0, duration: 0.01 }, t))
    );
  });
  const reveals = pick<HTMLElement>(root, "[data-reveal]");
  if (reveals.length)
    tl.to(
      reveals,
      { clipPath: dir > 0 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)", y: -40 * dir, skewY: -3 * dir, duration: 0.45, stagger: 0.04, ease: "power2.in" },
      at
    );
  pick<HTMLElement>(root, "[data-note] > span").forEach((words) => tl.to(words, { opacity: 0, y: -12, duration: 0.3 }, at));
}

/* ---------- Stage changes between scenes ---------- */

const SHUT = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
const COVER = "polygon(0% -12%, 100% 0%, 100% 100%, 0% 100%)";
const GONE = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

/**
 * Changes the stage from `from` to `to` in `tl` at `at`, then shows `to`.
 * Returns the time at which the incoming content should start entering.
 */
export function changeStage(tl: gsap.core.Timeline, kind: StageChange, from: HTMLElement, to: HTMLElement, at: number, dir: Direction) {
  // The incoming scene becomes the active one; the outgoing one stays visible underneath
  // ("is-leaving") until the deck finishes the transition and clears it.
  const show = () => {
    from.classList.remove("is-active");
    from.classList.add("is-leaving");
    to.classList.add("is-active");
  };

  if (kind === "sweep") {
    // A slanted highlighter band rises over the screen, the scene swaps under it, the band leaves.
    const band = document.getElementById("sweep");
    const dirCover = dir > 0 ? COVER : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 112%)";
    const dirShut = dir > 0 ? SHUT : GONE;
    const dirGone = dir > 0 ? GONE : SHUT;
    tl.fromTo(band, { clipPath: dirShut }, { clipPath: dirCover, duration: 0.55, ease: "power3.in" }, at);
    tl.call(show, [], at + 0.55);
    tl.fromTo(band, { clipPath: dirCover }, { clipPath: dirGone, duration: 0.6, ease: "power3.out", immediateRender: false }, at + 0.55);
    return at + 0.55;
  }

  if (kind === "iris") {
    // The incoming scene opens as a circle from the centre while the old one sinks back.
    tl.call(show, [], at);
    tl.fromTo(to, { clipPath: "circle(0% at 50% 55%)" }, { clipPath: "circle(150% at 50% 55%)", duration: 1.1, ease: "power3.inOut" }, at);
    tl.fromTo(from, { scale: 1, opacity: 1 }, { scale: 0.9, opacity: 0.4, duration: 1.1, ease: "power3.inOut", immediateRender: false }, at);
    tl.set(from, { clearProps: "transform,opacity,clipPath" }, at + 1.1);
    tl.set(to, { clearProps: "clipPath" }, at + 1.1);
    return at + 0.45;
  }

  // Push in depth: the old composition recedes and tilts away, the new one arrives over it.
  tl.call(show, [], at);
  tl.fromTo(
    from,
    { scale: 1, yPercent: 0, rotationX: 0, opacity: 1 },
    { scale: 0.86, yPercent: -10 * dir, rotationX: 8 * dir, opacity: 0, duration: 1, ease: "power3.inOut", immediateRender: false },
    at
  );
  tl.fromTo(
    to,
    { yPercent: 100 * dir, scale: 1.06, rotationX: -6 * dir, clipPath: "inset(0% 0% 0% 0% round 2.5rem)" },
    { yPercent: 0, scale: 1, rotationX: 0, clipPath: "inset(0% 0% 0% 0% round 0rem)", duration: 1, ease: "power3.inOut" },
    at
  );
  tl.set(from, { clearProps: "transform,opacity" }, at + 1);
  tl.set(to, { clearProps: "transform,clipPath" }, at + 1);
  return at + 0.55;
}
