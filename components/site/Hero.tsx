"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";
import { gsap, initGSAP, MEDIA, SplitText } from "@/lib/gsap";
import { onIntro } from "@/lib/intro";
import HighlighterCanvas from "./HighlighterCanvas";
import Marked from "./Marked";
import Note from "./Note";

const MARKER = "#d4ff3a";

// WebGL is decorative here and heavy: load it on the client only, after the page.
const Marker = dynamic(() => import("./three/Marker"), { ssr: false });

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
      const split = SplitText.create(rows, { type: "chars", mask: "chars" });
      const mark = el.querySelector<HTMLElement>("[data-hl]");
      const rest = el.querySelectorAll("[data-hero-rest]");

      gsap.set(split.chars, { yPercent: 105 });
      gsap.set(rest, { opacity: 0, y: 16 });
      if (mark) gsap.set(mark, { "--hl": "0%" });

      // The one orchestrated entrance of the page, right after the preloader lifts.
      offIntro = onIntro(() => {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.to(split.chars, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: { each: 0.045, from: "start" } })
          .to(rest, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, "-=0.7");
        if (mark) tl.to(mark, { "--hl": "100%", duration: 0.9, ease: "power2.inOut" }, "-=0.3");
      });

      // Leaving the hero: the two rows of the name drift apart, as if the page turns.
      if (desktop) {
        gsap.to(rows[0], { xPercent: -6, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(rows[1], { xPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
      }
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
      <Marker className="pointer-events-none absolute right-0 top-[4%] z-0 h-[48svh] w-[75vw] md:top-[2%] md:h-[86svh] md:w-[56vw]" />
      <div className="hero-content wrap">
        <h1 id="hero-name" className="display select-none">
          <span data-name-row className="block">
            {h.name[0]}
          </span>{" "}
          <span data-name-row className="block pl-[0.9em] md:pl-[1.6em]">
            {h.name[1]}
          </span>
        </h1>

        <div className="mt-[clamp(2rem,5vh,3.5rem)] grid gap-8 border-t-[1.5px] border-ink pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="lead max-w-[30ch]">
              <Marked text={h.lead} />
            </p>
            <p data-hero-rest className="small mt-3">
              {h.where}
            </p>
          </div>
          <div data-hero-rest className="flex flex-wrap items-center gap-3">
            <a href={links.cv} download className="btn btn-ink">
              {h.cv}
            </a>
            <a href="#proyectos" className="btn btn-line">
              {h.work}
            </a>
          </div>
        </div>
        <div data-hero-rest className="pointer-hint mt-6 hidden justify-end md:flex">
          <Note arrow="up-left" decorative>
            {h.drawHint}
          </Note>
        </div>
      </div>
    </section>
  );
}
