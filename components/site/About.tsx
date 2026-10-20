"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP, MEDIA } from "@/lib/gsap";
import { scene, settle } from "@/lib/scene";
import Marked from "./Marked";

export default function About() {
  const { t } = useLanguage();
  const a = t.about;
  const grid = useRef<HTMLDivElement>(null);
  const timeline = useRef<HTMLDivElement>(null);

  // A scene: the section holds while how I learn is highlighted, the timeline's rail is
  // drawn and each stage arrives as the line reaches it. On phones only the timeline fits the
  // screen, so only it holds; the highlight is drawn as it scrolls past.
  useEffect(() => {
    const el = timeline.current;
    const wrap = grid.current;
    if (!el || !wrap) return;
    initGSAP();
    const mm = gsap.matchMedia();
    mm.add({ motion: MEDIA.motion, desktop: MEDIA.desktop }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;
      const mark = wrap.querySelector<HTMLElement>("[data-motion-owned] [data-hl]");
      const entries = el.querySelectorAll("[data-entry]");
      const tl = scene(desktop ? wrap : el, desktop ? 220 : 160);
      if (desktop && mark) tl.fromTo(mark, { "--hl": "0%" }, { "--hl": "100%", duration: 1 });
      tl.fromTo(el.querySelector("[data-rail]"), { scaleY: 0 }, { scaleY: 1, duration: 2 }, desktop ? 0.8 : 0);
      entries.forEach((entry, i) => tl.from(entry, { clipPath: "inset(0% 100% 0% 0%)", x: 40, duration: 0.35, ease: "power3.out" }, (desktop ? 0.8 : 0) + (i / entries.length) * 2));
      settle(tl, 0.25);
      // Exit: the stages leave one after another, the rail is drawn back down and, on desktop,
      // the story and the facts lift away with them.
      const out = tl.duration();
      tl.to(entries, { clipPath: "inset(0% 0% 100% 0%)", y: -40, rotation: () => gsap.utils.random(-5, 5), duration: 0.45, stagger: 0.07, ease: "power2.in" }, out)
        .to(el.querySelector("[data-rail]"), { scaleY: 0, transformOrigin: "bottom center", duration: 0.6, ease: "power2.in" }, out + 0.1);
      if (desktop) tl.to(wrap.querySelectorAll("[data-about-out]"), { clipPath: "inset(0% 0% 100% 0%)", y: -50, skewY: -3, duration: 0.5, stagger: 0.08, ease: "power2.in" }, out + 0.15);

      if (!desktop && mark) {
        gsap.fromTo(mark, { "--hl": "0%" }, { "--hl": "100%", ease: "none", scrollTrigger: { trigger: mark, start: "top 85%", end: "top 45%", scrub: 0.9 } });
      }
      return () => mark?.style.removeProperty("--hl");
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="sobre-mi" className="section" aria-labelledby="about-title">
      <div ref={grid} data-pin className="wrap grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h2 id="about-title" className="headline" data-lines data-about-out>
            {a.title}
          </h2>
          <div className="mt-8 space-y-5" data-motion-owned data-about-out>
            {a.paragraphs.map((p) => (
              <p key={p} className="lead max-w-[34ch]">
                <Marked text={p} />
              </p>
            ))}
          </div>
          <dl data-about-out className="mt-10 grid grid-cols-[auto_minmax(0,1fr)] gap-x-8 gap-y-3 border-t-[1.5px] border-ink pt-6">
            {a.facts.map((f) => (
              <div key={f.term} className="contents">
                <dt className="text-ink-soft">{f.term}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 data-about-out className="text-lg font-semibold">{a.timelineTitle}</h3>
          <div ref={timeline} className="relative mt-8 pl-8">
            <span data-rail className="absolute bottom-2 left-[5px] top-2 w-[1.5px] origin-top bg-ink" aria-hidden="true" />
            <ol className="space-y-10">
            {a.timeline.map((item) => (
              <li key={item.what} data-entry className="relative">
                <span className="absolute -left-8 top-1.5 h-3 w-3 rounded-full border-[1.5px] border-ink bg-paper" aria-hidden="true" />
                <p className="small">{item.when}</p>
                <p className="title mt-1 !text-[clamp(1.4rem,2.4vw,2rem)]">{item.what}</p>
                <p className="text-ink-soft">{item.where}</p>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
