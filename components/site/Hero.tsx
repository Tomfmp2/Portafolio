"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";
import { gsap, initGSAP, MEDIA, SplitText } from "@/lib/gsap";
import { onIntro } from "@/lib/intro";
import { scene, settle } from "@/lib/scene";
import HighlighterCanvas from "./HighlighterCanvas";
import Marked from "./Marked";
import Note from "./Note";

const MARKER = "#d4ff3a";

export default function Hero() {
  const { t } = useLanguage();
  const h = t.hero;
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    initGSAP();
    const mm = gsap.matchMedia();
    let offIntro = () => {};

    mm.add({ motion: MEDIA.motion, desktop: MEDIA.desktop }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;

      const rows = el.querySelectorAll<HTMLElement>("[data-name-row]");
      const split = SplitText.create(rows, { type: "chars", mask: "chars", charsClass: "hero-char" });
      const mark = el.querySelector<HTMLElement>("[data-hl]");
      const swipe = el.querySelector<HTMLElement>("[data-swipe]");
      const rest = el.querySelectorAll("[data-hero-rest]");

      gsap.set(split.chars, { yPercent: 105 });
      // CSS keeps the name hidden until this point (see the hero start state in globals.css).
      gsap.set(rows, { visibility: "visible" });
      gsap.set(rest, { opacity: 0, y: 16 });
      if (mark) gsap.set(mark, { "--hl": "0%" });
      if (swipe) gsap.set(swipe, { scaleX: 0 });

      // The one orchestrated entrance of the page, right after the preloader lifts.
      offIntro = onIntro(() => {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.to(split.chars, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: { each: 0.045, from: "start" } });
        // A wide highlighter stroke under the surname, then the key phrase.
        if (swipe) tl.to(swipe, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, "-=0.4");
        tl.to(rest, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, "-=0.4");
        if (mark) tl.to(mark, { "--hl": "100%", duration: 1.1, ease: "power2.inOut" }, "-=0.3");
      });

      // The hero as a scene: it holds still while the scroll draws a hand-drawn ring around the
      // CV button, pauses, then leaves: the letters rise out through their masks, the stroke
      // retracts, the ring is wiped and the rest lifts away. Scrolling back rebuilds it.
      const ring = el.querySelector<SVGPathElement>("[data-ring] path");
      const outgoing = el.querySelectorAll("[data-hero-out]");
      const tl = scene(el, desktop ? 140 : 110, { start: "top top" });
      if (ring) tl.fromTo(ring, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1 });
      // While pinned, the two rows of the name drift apart, as if the page turns.
      if (desktop) tl.to(rows[0], { xPercent: -6, duration: 1 }, 0).to(rows[1], { xPercent: 8, duration: 1 }, 0);
      settle(tl, 0.35);
      const out = tl.duration();
      tl.fromTo(split.chars, { yPercent: 0 }, { yPercent: -110, duration: 0.7, stagger: 0.025, ease: "power2.in", immediateRender: false }, out);
      if (swipe) tl.fromTo(swipe, { scaleX: 1 }, { scaleX: 0, transformOrigin: "right center", duration: 0.5, ease: "power2.in", immediateRender: false }, out);
      if (ring) tl.to(ring, { drawSVG: "100% 100%", duration: 0.5, ease: "power2.in" }, out);
      tl.fromTo(outgoing, { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.5, stagger: 0.08, ease: "power2.in", immediateRender: false }, out + 0.1);
      return () => split.revert();
    });

    return () => {
      offIntro();
      mm.revert();
    };
  }, []);

  return (
    <section ref={root} id="inicio" data-motion-owned className="relative flex min-h-svh flex-col justify-end overflow-hidden pb-[clamp(2rem,6vh,4rem)] pt-28" aria-labelledby="hero-name">
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
              {/* Hand-drawn ring the pen draws around the CV as you start scrolling */}
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
