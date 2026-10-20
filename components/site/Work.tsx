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
      const split = SplitText.create(title, { type: "chars", mask: "chars" });
      const tl = scene(el, 90);
      tl.from(split.chars, { yPercent: 110, duration: 1, stagger: 0.06 }).fromTo(swipe, { "--swipe": 0 }, { "--swipe": 1, duration: 1 });
      settle(tl);
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
        <h2 id="work-title" className="display relative isolate w-fit">
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
