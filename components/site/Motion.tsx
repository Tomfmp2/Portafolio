"use client";

import { useEffect } from "react";
import { gsap, initGSAP, MEDIA, ScrollTrigger, SplitText } from "@/lib/gsap";

/** Elements a section animates itself opt out of the generic behaviours with this attribute. */
const OWNED = "[data-motion-owned] *";

/**
 * Entrance and exit for something that scrolls through the page: `from` plays
 * while it rises out of the bottom quarter of the screen, `to` while it passes
 * through the top quarter. Two separate scrubbed ranges, so it holds still in
 * between however tall it is, and scrolling back reverses both. Inside a
 * pinned scene only the entrance is generic: the scene plays the exit itself,
 * since while pinned the element can sit above the exit line from the start.
 */
function passThrough(trigger: Element, targets: gsap.TweenTarget, from: gsap.TweenVars, to: gsap.TweenVars, stagger = 0) {
  // Inside a pinned scene, positions must account for the time the scene stays fixed.
  const pinnedContainer = trigger.closest("[data-pin]") ?? undefined;
  const enter = gsap.from(targets, {
    ...from,
    stagger,
    ease: "power2.out",
    scrollTrigger: { trigger, start: "top 95%", end: "top 70%", scrub: 0.6, pinnedContainer },
  });
  const leave = pinnedContainer
    ? null
    : gsap.to(targets, {
        ...to,
        stagger,
        ease: "power2.in",
        immediateRender: false,
        scrollTrigger: { trigger, start: "bottom 30%", end: "bottom 5%", scrub: 0.6 },
      });
  const kill = () => [enter, leave].forEach((t) => {
    if (!t) return;
    t.scrollTrigger?.kill();
    t.kill();
  });
  return { enter, leave, kill };
}

/**
 * The behaviours every section shares, wired once per render of the page:
 * - [data-hl]      the highlighter sweeps across the phrase, in step with the scroll
 * - [data-note]    the margin note's arrow is drawn on the way in, the note fades on the way out
 * - [data-lines]   a heading rises line by line into view and out again at the top
 * - [data-reveal]  enters and leaves with the scroll ("x" slides in sideways)
 * - [data-count]   a number counts up to its value
 * - [data-parallax="0.1"] drifts against the scroll by that fraction of the viewport
 * - .btn           leans toward the pointer (magnetic), mouse only
 * With reduced motion everything is simply shown in its final state.
 */
export default function Motion() {
  useEffect(() => {
    initGSAP();
    const mm = gsap.matchMedia();

    mm.add(MEDIA.motion, () => {
      const pick = <T extends Element>(selector: string) =>
        gsap.utils.toArray<T>(selector).filter((el) => !el.matches(OWNED));

      pick<HTMLElement>("[data-hl]").forEach((el) => {
        // Tied to the scroll over a long range: scrolling slowly draws slowly.
        gsap.fromTo(el, { "--hl": "0%" }, { "--hl": "100%", ease: "none", scrollTrigger: { trigger: el, start: "top 88%", end: "top 42%", scrub: 0.9 } });
      });

      pick<HTMLElement>("[data-note]").forEach((note) => {
        const strokes = note.querySelectorAll("[data-draw]");
        const words = note.querySelector(":scope > span");
        passThrough(note, words ?? note, { opacity: 0, x: 10 }, { opacity: 0, y: -12 });
        if (strokes.length)
          gsap.from(strokes, { drawSVG: 0, stagger: 0.2, ease: "none", scrollTrigger: { trigger: note, start: "top 95%", end: "top 72%", scrub: 0.6, pinnedContainer: note.closest("[data-pin]") ?? undefined } });
      });

      pick<HTMLElement>("[data-lines]").forEach((heading) => {
        let current: ReturnType<typeof passThrough> | null = null;
        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          linesClass: "line-mask-inner",
          autoSplit: true,
          // Lines rise in from under their baseline, then rise out through the top of their mask.
          // Re-split on resize (new line breaks): replace the previous pair of tweens.
          onSplit: (self) => {
            current?.kill();
            current = passThrough(heading, self.lines, { yPercent: 110 }, { yPercent: -110 }, 0.12);
          },
        });
      });

      pick<HTMLElement>("[data-reveal]").forEach((el) => {
        const sideways = el.dataset.reveal === "x";
        passThrough(el, el, sideways ? { x: 80, opacity: 0 } : { y: 48, opacity: 0 }, sideways ? { x: -40, opacity: 0 } : { y: -48, opacity: 0 });
      });

      pick<HTMLElement>("[data-count]").forEach((el) => {
        const value = Number(el.dataset.count);
        const counter = { n: 0 };
        // The server renders the final number; start from zero only when the count-up will run.
        el.textContent = "0";
        gsap.to(counter, {
          n: value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => (el.textContent = String(Math.round(counter.n))),
        });
      });

      // Depth: elements drift against the scroll at their own speed (desktop only, where there's room).
      if (window.matchMedia(MEDIA.desktop).matches) {
        pick<HTMLElement>("[data-parallax]").forEach((el) => {
          const distance = Number(el.dataset.parallax) * window.innerHeight;
          gsap.fromTo(el, { y: distance }, { y: -distance, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });
      }

      // matchMedia reverts tweens, not what we wrote by hand: restore the numbers and highlights.
      return () => {
        pick<HTMLElement>("[data-count]").forEach((el) => (el.textContent = el.dataset.count ?? ""));
        pick<HTMLElement>("[data-hl]").forEach((el) => el.style.removeProperty("--hl"));
      };
    });

    // Magnetic buttons: they lean a little toward the pointer and spring back when it leaves.
    mm.add(`${MEDIA.motion} and ${MEDIA.finePointer}`, () => {
      const buttons = gsap.utils.toArray<HTMLElement>(".btn:not([data-own-magnet])");
      const offs = buttons.map((btn) => {
        const x = gsap.quickTo(btn, "x", { duration: 0.5, ease: "elastic.out(1, 0.45)" });
        const y = gsap.quickTo(btn, "y", { duration: 0.5, ease: "elastic.out(1, 0.45)" });
        const move = (e: PointerEvent) => {
          const r = btn.getBoundingClientRect();
          x((e.clientX - (r.left + r.width / 2)) * 0.25);
          y((e.clientY - (r.top + r.height / 2)) * 0.35);
        };
        const leave = () => {
          x(0);
          y(0);
        };
        btn.addEventListener("pointermove", move);
        btn.addEventListener("pointerleave", leave);
        return () => {
          btn.removeEventListener("pointermove", move);
          btn.removeEventListener("pointerleave", leave);
        };
      });
      return () => offs.forEach((off) => off());
    });

    // Sections create their pinned scenes in React's effect order (children before parents),
    // not in page order, so a scene could be measured before a pin above it adds its scroll.
    // This component mounts last: put every trigger in page order and measure once more.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    // Layout shifts once fonts arrive; measure again so triggers sit where the text really is.
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, []);

  return null;
}
