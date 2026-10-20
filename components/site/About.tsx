"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP, MEDIA } from "@/lib/gsap";
import Marked from "./Marked";

export default function About() {
  const { t } = useLanguage();
  const a = t.about;
  const timeline = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = timeline.current;
    if (!el) return;
    initGSAP();
    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      // The rail is drawn as you read down the timeline; each entry arrives when the line reaches it.
      gsap.fromTo(el.querySelector("[data-rail]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 60%", scrub: true } });
      el.querySelectorAll("[data-entry]").forEach((entry) => {
        gsap.from(entry, { opacity: 0, x: 24, duration: 0.7, scrollTrigger: { trigger: entry, start: "top 72%" } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="sobre-mi" className="section" aria-labelledby="about-title">
      <div className="wrap grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h2 id="about-title" className="headline" data-lines>
            {a.title}
          </h2>
          <div className="mt-8 space-y-5">
            {a.paragraphs.map((p) => (
              <p key={p} className="lead max-w-[34ch]">
                <Marked text={p} />
              </p>
            ))}
          </div>
          <dl className="mt-10 grid grid-cols-[auto_minmax(0,1fr)] gap-x-8 gap-y-3 border-t-[1.5px] border-ink pt-6">
            {a.facts.map((f) => (
              <div key={f.term} className="contents">
                <dt className="text-ink-soft">{f.term}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-parallax="0.08">
          <h3 className="text-lg font-semibold">{a.timelineTitle}</h3>
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
