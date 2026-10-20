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
