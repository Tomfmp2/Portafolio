"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";
import { gsap, initGSAP, SplitText } from "@/lib/gsap";
import { useDeckOn, useScene } from "./Deck";
import HighlighterCanvas from "./HighlighterCanvas";
import Marked from "./Marked";
import Note from "./Note";

const MARKER = "#d4ff3a";
const R = gsap.utils.random;

export default function Hero() {
  const { t } = useLanguage();
  const h = t.hero;
  const root = useRef<HTMLElement>(null);
  const split = useRef<SplitText | null>(null);
  const deck = useDeckOn();

  // Letters are split once the deck runs; without masks so they are free to scatter.
  useEffect(() => {
    const el = root.current;
    if (!el || !deck) return;
    initGSAP();
    split.current = SplitText.create(el.querySelectorAll("[data-name-row]"), { type: "chars", charsClass: "hero-char" });
    return () => {
      split.current?.revert();
      split.current = null;
    };
  }, [deck]);

  useScene({
    // The opening of the whole site: letters land from different angles, the highlighter strikes
    // a stroke under the surname and the key phrase, and a ring is drawn around the CV.
    enter(tl, at) {
      const el = root.current;
      const chars = split.current?.chars;
      if (!el || !chars) return;
      const swipe = el.querySelector("[data-swipe]");
      const mark = el.querySelector("[data-hl]");
      const ring = el.querySelector("[data-ring] path");
      const rest = el.querySelectorAll("[data-hero-rest]");
      tl.set(el.querySelectorAll("[data-name-row]"), { visibility: "visible" }, 0);
      // Coming back after the exit: bring the copy blocks back before their parts animate in.
      tl.set(el.querySelectorAll("[data-hero-out]"), { opacity: 1, y: 0, skewY: 0 }, 0);
      tl.fromTo(chars, { yPercent: () => R(90, 160), rotation: () => R(-30, 30), opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.045 }, at);
      if (swipe) tl.fromTo(swipe, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, at + 0.7);
      tl.fromTo(rest, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, at + 0.9);
      if (mark) tl.fromTo(mark, { "--hl": "0%" }, { "--hl": "100%", duration: 0.9, ease: "power2.inOut" }, at + 1.2);
      if (ring) tl.fromTo(ring, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, ease: "power1.inOut" }, at + 1.8);
    },
    // The letters burst apart, each its own way, and the strokes and copy clear.
    leave(tl, at) {
      const el = root.current;
      const chars = split.current?.chars;
      if (!el || !chars) return;
      tl.to(chars, { yPercent: () => R(-320, -140), xPercent: () => R(-90, 90), rotation: () => R(-70, 70), opacity: 0, duration: 0.7, stagger: { each: 0.015, from: "random" }, ease: "power3.in" }, at);
      tl.to(el.querySelector("[data-swipe]"), { scaleX: 0, transformOrigin: "right center", duration: 0.4, ease: "power2.in" }, at);
      tl.to(el.querySelector("[data-ring] path"), { drawSVG: "100% 100%", duration: 0.4 }, at);
      tl.to(el.querySelectorAll("[data-hero-out]"), { opacity: 0, y: -50, skewY: -4, duration: 0.45, stagger: 0.06, ease: "power2.in" }, at + 0.05);
    },
  });

  return (
    <section ref={root} data-motion-owned className="hero scene-fill relative flex flex-col justify-end overflow-hidden pb-[clamp(5rem,10vh,7rem)] pt-28" aria-labelledby="hero-name">
      <HighlighterCanvas color={MARKER} />
      <div className="hero-content wrap relative">
        <h1 id="hero-name" className="display select-none">
          <span data-name-row className="block">
            {h.name[0]}
          </span>{" "}
          <span className="relative block w-fit pl-[0.9em] md:pl-[1.6em]">
            <span data-name-row className="relative z-[1] block">
              {h.name[1]}
            </span>
            {/* The highlighter stroke drawn under the surname on arrival */}
            <span data-swipe className="hero-swipe" aria-hidden="true" />
          </span>
        </h1>

        <div data-hero-out className="mt-[clamp(2rem,5vh,3.5rem)] grid gap-8 border-t-[1.5px] border-ink pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="lead max-w-[30ch]">
              <Marked text={h.lead} />
            </p>
            <p data-hero-rest className="small mt-3">
              {h.where}
            </p>
          </div>
          <div data-hero-rest className="flex flex-wrap items-center gap-3">
            <span className="relative inline-block">
              <a href={links.cv} download className="btn btn-ink relative z-[1]">
                {h.cv}
              </a>
              {/* Hand-drawn ring around the CV */}
              <svg data-ring className="hero-ring" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">
                <path d="M34 10 C86 -4 172 2 193 30 C207 54 168 77 98 76 C38 75 4 61 7 39 C10 19 58 5 128 9" />
              </svg>
            </span>
            <a href="#proyectos" className="btn btn-line">
              {h.work}
            </a>
          </div>
        </div>
        <div data-hero-rest data-hero-out className="pointer-hint mt-6 hidden justify-end md:flex">
          <Note arrow="up-left" decorative>
            {h.drawHint}
          </Note>
        </div>
      </div>
    </section>
  );
}
