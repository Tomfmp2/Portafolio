"use client";

import { useEffect } from "react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP, ScrollTrigger } from "@/lib/gsap";
import { CHAPTERS, HOLD } from "@/lib/experience/chapters";
import { interaction, subscribe } from "@/lib/experience/store";

/** C64 PETSCII-ish alphabet for the decode effect. */
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+/<>";

/*
 * Scroll positions inside a chapter's own ScrollTrigger (top of the section at
 * the bottom of the viewport → bottom of the section at the top). A chapter is
 * 170svh tall, so the whole span is 2.7 viewports. The exit starts where the
 * particle morph starts (HOLD), so text and scene leave together.
 */
const SPAN = 2.7;
const at = (topFromViewportTop: number) => (1 - topFromViewportTop) / SPAN;
const ENTER = [at(0.95), at(0.25)] as const;
const MORPH_START = 0.5 - HOLD * 1.7;
const EXIT = [at(MORPH_START), at(0.5 - 1.7)] as const;

function charsIn(chars: Element[]) {
  return gsap.fromTo(
    chars,
    { autoAlpha: 0, yPercent: 70, rotateX: -95, z: -160 },
    {
      autoAlpha: 1,
      yPercent: 0,
      rotateX: 0,
      z: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: { each: 0.028 },
      // Hand the transform back to CSS so hover effects work once the letters land.
      onComplete: () => gsap.set(chars, { clearProps: "transform" }),
    }
  );
}

function scramble(el: HTMLElement) {
  return gsap.to(el, {
    duration: 1.1,
    ease: "none",
    scrambleText: { text: el.dataset.scramble ?? el.textContent ?? "", chars: SCRAMBLE_CHARS, speed: 0.6, revealDelay: 0.25 },
  });
}

/**
 * Typography effects for the scroll journey: titles assemble letter by letter,
 * labels decode like a C64 screen, and on large screens each chapter's copy
 * comes in from the depth of the scene and flies past the camera on the way out.
 */
export default function TextFx() {
  const { lang } = useLanguage();

  useEffect(() => {
    initGSAP();
    gsap.registerPlugin(ScrambleTextPlugin);
    // A language switch re-renders the strings; reset any label a scramble rewrote to the new text.
    document.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => (el.textContent = el.dataset.scramble ?? ""));
    const mm = gsap.matchMedia();
    let offEnter = () => {};

    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", depth: "(min-width: 768px)" },
      (context) => {
        const { motion, depth } = context.conditions as { motion: boolean; depth: boolean };
        // Reduced motion: text stays exactly as rendered.
        if (!motion) return;

        CHAPTERS.forEach((_, i) => {
          const section = document.querySelector<HTMLElement>(`[data-chapter="${i}"]`);
          if (!section) return;
          const chars = [...section.querySelectorAll(".chapter-title .char, .display-name .char")];
          const labels = [...section.querySelectorAll<HTMLElement>("[data-scramble]")];

          if (i === 0) {
            // The hero plays once the visitor is through the boot screen.
            const play = () => {
              charsIn(chars).delay(0.35);
              labels.forEach((el) => scramble(el).delay(0.2));
            };
            gsap.set(chars, { autoAlpha: 0 });
            if (interaction.entered) play();
            else offEnter = subscribe("entered", play);
          } else {
            const tl = gsap.timeline({ paused: true });
            if (chars.length) tl.add(charsIn(chars), 0);
            labels.forEach((el) => tl.add(scramble(el), 0));
            ScrollTrigger.create({
              trigger: section,
              start: "top 65%",
              onEnter: () => tl.restart(),
              onLeaveBack: () => tl.pause(0),
            });
            // Hidden until their trigger fires, so they never flash in fully formed.
            tl.progress(0).pause();
          }

          const copy = section.querySelector<HTMLElement>(".chapter-text");
          if (!depth || !copy) return;
          const last = i === CHAPTERS.length - 1;
          const tl = gsap.timeline({
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6 },
            defaults: { ease: "none" },
          });
          if (i > 0) {
            tl.fromTo(copy, { autoAlpha: 0, z: -700, rotateY: 14 }, { autoAlpha: 1, z: 0, rotateY: 0, duration: ENTER[1] - ENTER[0], ease: "power2.out" }, ENTER[0]);
          }
          if (!last) {
            const exit = EXIT[1] - EXIT[0];
            tl.fromTo(copy, { z: 0, rotateY: 0 }, { z: 340, rotateY: -10, duration: exit, ease: "power2.in", immediateRender: false }, EXIT[0]);
            // Gone before it grows over the next chapter's title.
            tl.fromTo(copy, { autoAlpha: 1 }, { autoAlpha: 0, duration: exit * 0.55, immediateRender: false }, EXIT[0] + exit * 0.1);
          }
          // Pad the timeline to the full span so the positions above map to scroll progress.
          tl.set({}, {}, 1);
        });
      }
    );

    return () => {
      offEnter();
      mm.revert();
    };
  }, [lang]);

  return null;
}
