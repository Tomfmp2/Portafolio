"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP, SplitText } from "@/lib/gsap";
import { useDeckOn, useScene } from "./Deck";

const R = gsap.utils.random;

/**
 * The doorway to the work: the title's letters fall in from different
 * heights, sizes and angles, then a highlighter stroke runs under it. On the
 * way out the stroke retracts and the letters burst apart.
 */
export default function ProjectsTitle() {
  const { t } = useLanguage();
  const root = useRef<HTMLDivElement>(null);
  const split = useRef<SplitText | null>(null);
  const deck = useDeckOn();

  useEffect(() => {
    const title = root.current?.querySelector<HTMLElement>("[data-title-text]");
    if (!title || !deck) return;
    initGSAP();
    split.current = SplitText.create(title, { type: "chars" });
    return () => {
      split.current?.revert();
      split.current = null;
    };
  }, [deck]);

  useScene({
    enter(tl, at) {
      const chars = split.current?.chars;
      const swipe = root.current?.querySelector("[data-title-swipe]");
      if (!chars || !swipe) return;
      tl.fromTo(chars, { yPercent: () => R(-180, 180), rotation: () => R(-45, 45), scale: () => R(0.4, 1.6), opacity: 0 }, { yPercent: 0, rotation: 0, scale: 1, opacity: 1, duration: 1, stagger: { each: 0.05, from: "center" }, ease: "back.out(1.4)" }, at);
      tl.fromTo(swipe, { "--swipe": 0, transformOrigin: "left center" }, { "--swipe": 1, duration: 0.7, ease: "power2.inOut" }, at + 0.9);
    },
    leave(tl, at) {
      const chars = split.current?.chars;
      const swipe = root.current?.querySelector("[data-title-swipe]");
      if (!chars || !swipe) return;
      tl.to(swipe, { "--swipe": 0, transformOrigin: "right center", duration: 0.4, ease: "power2.in" }, at);
      tl.to(chars, { yPercent: () => R(-260, -120), xPercent: () => R(-120, 120), rotation: () => R(-90, 90), opacity: 0, duration: 0.7, stagger: { each: 0.03, from: "random" }, ease: "power3.in" }, at + 0.1);
    },
  });

  return (
    <div ref={root} className="scene-fill wrap flex flex-col justify-center">
      <h2 data-motion-owned className="display relative isolate w-fit">
        <span data-title-text>{t.work.title}</span>
        <span data-title-swipe className="title-swipe" aria-hidden="true" />
      </h2>
    </div>
  );
}
