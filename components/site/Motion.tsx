"use client";

import { useEffect } from "react";
import { gsap, initGSAP, MEDIA, ScrollTrigger, SplitText } from "@/lib/gsap";

/** Elements a section animates itself opt out of the generic behaviours with this attribute. */
const OWNED = "[data-motion-owned] *";

type Build = (tl: gsap.core.Timeline) => void;

/**
 * Entrance and exit for something that scrolls through the page: `enter`
 * plays while it rises out of the bottom of the screen, `leave` while it
 * passes through the top. Two separate scrubbed ranges, so it holds still in
 * between however tall it is, and scrolling back reverses both. Inside a
 * pinned scene only the entrance is generic: the scene plays the exit itself,
 * since while pinned the element can sit above the exit line from the start.
 */
function passThrough(trigger: Element, enter: Build, leave: Build) {
  // Inside a pinned scene, positions must account for the time the scene stays fixed.
  const pinnedContainer = trigger.closest("[data-pin]") ?? undefined;
  const a = gsap.timeline({ scrollTrigger: { trigger, start: "top 96%", end: "top 62%", scrub: 0.7, pinnedContainer } });
  enter(a);
  const b = pinnedContainer ? null : gsap.timeline({ scrollTrigger: { trigger, start: "bottom 38%", end: "bottom 4%", scrub: 0.7 } });
  if (b) leave(b);
  const kill = () =>
    [a, b].forEach((t) => {
      if (!t) return;
      t.scrollTrigger?.kill();
      t.kill();
    });
  return { kill };
}

/**
 * The highlighter passing over one line: the block grows over it, the line
 * swaps state underneath (`swap`), then the block pulls away the other way.
 */
function markerPass(tl: gsap.core.Timeline, cover: Element, at: number, swap: (at: number) => void) {
  tl.fromTo(cover, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.45, ease: "power2.in", immediateRender: false }, at);
  swap(at + 0.45);
  tl.fromTo(cover, { scaleX: 1, transformOrigin: "right center" }, { scaleX: 0, duration: 0.45, ease: "power2.out", immediateRender: false }, at + 0.45);
}

/**
 * The behaviours every section shares, wired once per render of the page:
 * - [data-hl]      the highlighter sweeps across the phrase, in step with the scroll
 * - [data-note]    the margin note's arrow is drawn on the way in, the note fades on the way out
 * - [data-lines]   a highlighter block passes over each line, revealing it on the way in
 *                  and taking it away on the way out
 * - [data-reveal]  wipes in with a clip and a slight skew, wipes out the top ("x": sideways)
 * - [data-skew]    leans with the speed of the scroll and settles when it stops
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
        passThrough(
          note,
          (tl) => tl.from(words ?? note, { opacity: 0, x: 14, rotation: 6, ease: "back.out(2)" }),
          (tl) => tl.to(words ?? note, { opacity: 0, y: -16, rotation: -4, ease: "power2.in" })
        );
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
            const lines = self.lines as HTMLElement[];
            const covers = lines.map((line) => {
              const mask = line.parentElement!;
              let cover = mask.querySelector<HTMLElement>(":scope > .line-cover");
              if (!cover) {
                cover = document.createElement("span");
                cover.className = "line-cover";
                cover.setAttribute("aria-hidden", "true");
                mask.appendChild(cover);
              }
              return cover;
            });
            current = passThrough(
              heading,
              (tl) => {
                gsap.set(lines, { opacity: 0 });
                lines.forEach((line, i) =>
                  markerPass(tl, covers[i], i * 0.22, (at) =>
                    tl.fromTo(line, { opacity: 0, x: "-0.25em" }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", immediateRender: false }, at)
                  )
                );
              },
              (tl) =>
                lines.forEach((line, i) =>
                  markerPass(tl, covers[i], i * 0.18, (at) =>
                    tl.to(line, { opacity: 0, yPercent: -40, duration: 0.01 }, at)
                  )
                )
            );
          },
        });
      });

      pick<HTMLElement>("[data-reveal]").forEach((el) => {
        const sideways = el.dataset.reveal === "x";
        passThrough(
          el,
          (tl) =>
            tl.fromTo(
              el,
              sideways ? { clipPath: "inset(0% 0% 0% 100%)", x: 90 } : { clipPath: "inset(100% 0% 0% 0%)", y: 60, skewY: 4 },
              { clipPath: "inset(0% 0% 0% 0%)", x: 0, y: 0, skewY: 0, ease: "power3.out" }
            ),
          (tl) =>
            tl.to(el, sideways ? { clipPath: "inset(0% 100% 0% 0%)", x: -60 } : { clipPath: "inset(0% 0% 100% 0%)", y: -50, skewY: -3, ease: "power2.in" })
        );
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

    // Momentum: big titles lean with the speed of the scroll and settle when it stops.
    mm.add(MEDIA.motion, () => {
      const lean = gsap.utils.toArray<HTMLElement>("[data-skew]").map((el) => gsap.quickTo(el, "skewY", { duration: 0.6, ease: "power3" }));
      let rest: gsap.core.Tween | null = null;
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const angle = gsap.utils.clamp(-7, 7, self.getVelocity() / -350);
          lean.forEach((set) => set(angle));
          rest?.kill();
          rest = gsap.delayedCall(0.12, () => lean.forEach((set) => set(0)));
        },
      });
      return () => {
        st.kill();
        rest?.kill();
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
