"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";
import { gsap, initGSAP, MEDIA, SplitText } from "@/lib/gsap";
import { scene, settle } from "@/lib/scene";
import CaseStudy from "./CaseStudy";
import MoreProjects from "./MoreProjects";

export default function Work() {
  const { t } = useLanguage();
  const stage = useRef<HTMLDivElement>(null);

  // Opening scene of the projects: the title assembles letter by letter with the scroll,
  // then a highlighter stroke runs under it, and only then does the page move on.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    initGSAP();
    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      const title = el.querySelector<HTMLElement>("h2 [data-title-text]");
      const swipe = el.querySelector<HTMLElement>("[data-title-swipe]");
      if (!title || !swipe) return;
      // No masks: letters fall in from different heights and angles, and burst apart on the way out.
      const split = SplitText.create(title, { type: "chars" });
      // The stroke starts undrawn; it is only drawn once the letters have landed.
      swipe.style.setProperty("--swipe", "0");
      const R = gsap.utils.random;
      const tl = scene(el, 130);
      tl.from(split.chars, { yPercent: () => R(-180, 180), rotation: () => R(-45, 45), scale: () => R(0.4, 1.6), opacity: 0, duration: 1, stagger: { each: 0.05, from: "center" }, ease: "back.out(1.4)" }).fromTo(swipe, { "--swipe": 0 }, { "--swipe": 1, duration: 1 });
      settle(tl, 0.3);
      // Exit: the stroke retracts toward its end and the letters rise out through their masks.
      const out = tl.duration();
      tl.set(swipe, { transformOrigin: "right center" }, out)
        .to(swipe, { "--swipe": 0, duration: 0.6, ease: "power2.in" }, out)
        .to(split.chars, { yPercent: () => R(-260, -120), xPercent: () => R(-120, 120), rotation: () => R(-90, 90), opacity: 0, duration: 0.8, stagger: { each: 0.03, from: "random" }, ease: "power3.in" }, out + 0.1);
      return () => {
        split.revert();
        swipe.style.removeProperty("--swipe");
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="proyectos" className="pb-[clamp(6rem,12vw,10rem)] pt-[clamp(2rem,5vw,4rem)]" aria-labelledby="work-title">
      <div ref={stage} className="title-stage wrap flex flex-col justify-center">
        <h2 id="work-title" data-skew className="display relative isolate w-fit">
          <span data-title-text>{t.work.title}</span>
          <span data-title-swipe className="title-swipe" aria-hidden="true" />
        </h2>
      </div>
      <CaseStudy id="feria" project={t.work.feria} link={{ href: links.feria, label: t.work.live }} />
      <CaseStudy id="ocap" project={t.work.ocap} link={{ href: links.ocap, label: t.work.code }} night />
      <MoreProjects />
    </section>
  );
}
