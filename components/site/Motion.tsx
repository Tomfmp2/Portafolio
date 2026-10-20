"use client";

import { useEffect } from "react";
import { gsap, initGSAP, MEDIA, ScrollTrigger, SplitText } from "@/lib/gsap";

/** Elements a section animates itself opt out of the generic behaviours with this attribute. */
const OWNED = "[data-motion-owned] *";

/**
 * The behaviours every section shares, wired once per render of the page:
 * - [data-hl]    the highlighter sweeps across the phrase, in step with the scroll
 * - [data-note]  the margin note's arrow is drawn, then its words appear
 * - [data-lines] a heading rises line by line from under its baseline
 * - [data-count] a number counts up to its value
 * - [data-parallax="0.1"] drifts against the scroll by that fraction of the viewport
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
        const tl = gsap.timeline({ scrollTrigger: { trigger: note, start: "top 82%" } });
        if (strokes.length) tl.from(strokes, { drawSVG: 0, duration: 0.5, stagger: 0.15, ease: "power1.inOut" });
        if (words) tl.from(words, { opacity: 0, x: 8, duration: 0.5 }, "-=0.2");
      });

      pick<HTMLElement>("[data-lines]").forEach((heading) => {
        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          linesClass: "line-mask-inner",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              stagger: 0.09,
              scrollTrigger: { trigger: heading, start: "top 85%" },
            }),
        });
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
