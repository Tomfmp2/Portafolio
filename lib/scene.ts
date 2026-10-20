import { gsap, ScrollTrigger } from "./gsap";

/**
 * A scroll scene: when the block reaches its place it holds still (pinned)
 * while the scroll plays the animation, and only once that is finished does
 * the page carry on scrolling. `length` is how much scroll the scene takes,
 * in percent of the viewport height.
 */
export function scene(trigger: Element, length: number, vars: ScrollTrigger.Vars = {}, ease = "none") {
  return gsap.timeline({
    defaults: { ease },
    scrollTrigger: {
      trigger,
      start: "center center",
      end: `+=${length}%`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      ...vars,
    },
  });
}

/** Leaves the finished state on screen for a moment before the pin lets go. */
export function settle(tl: gsap.core.Timeline, fraction = 0.18) {
  tl.to({}, { duration: Math.max(tl.duration() * fraction, 0.01) });
  return tl;
}

const SHUT = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
const COVER = "polygon(0% -12%, 100% 0%, 100% 100%, 0% 100%)";
const GONE = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

/**
 * A highlighter sweep across the whole screen, played inside a scene's
 * timeline at `at`: a slanted lime band rises from the bottom, covers the
 * screen (`onCovered` is where the scene clears what was behind it) and
 * leaves through the top. Scrubbed with the scene, so it also runs backwards.
 */
export function sweep(tl: gsap.core.Timeline, at: number, onCovered: (tl: gsap.core.Timeline, at: number) => void, duration = 1.2) {
  const band = document.getElementById("sweep");
  if (!band) return tl;
  const half = duration / 2;
  tl.fromTo(band, { clipPath: SHUT }, { clipPath: COVER, duration: half, ease: "power2.in", immediateRender: false }, at);
  onCovered(tl, at + half);
  tl.fromTo(band, { clipPath: COVER }, { clipPath: GONE, duration: half, ease: "power2.out", immediateRender: false }, at + half);
  return tl;
}
