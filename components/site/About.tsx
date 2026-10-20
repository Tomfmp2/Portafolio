"use client";

import { useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useScene } from "./Deck";
import Marked from "./Marked";

/**
 * About as a scene: the story and facts come in with the shared reveals (and
 * "how I learn" is highlighted), while the timeline's rail is drawn down and
 * each stage swings in as the line reaches it.
 */
export default function About() {
  const { t } = useLanguage();
  const a = t.about;
  const timeline = useRef<HTMLDivElement>(null);

  useScene({
    enter(tl, at) {
      const el = timeline.current;
      if (!el) return;
      const entries = el.querySelectorAll("[data-entry]");
      tl.fromTo(el.querySelector("[data-rail]"), { scaleY: 0, transformOrigin: "top center" }, { scaleY: 1, duration: 1.6, ease: "power2.inOut" }, at + 0.3);
      entries.forEach((entry, i) =>
        tl.fromTo(entry, { clipPath: "inset(0% 100% 0% 0%)", x: 50, rotation: 2 }, { clipPath: "inset(0% 0% 0% 0%)", x: 0, rotation: 0, duration: 0.55, ease: "power3.out" }, at + 0.4 + i * 0.35)
      );
    },
    leave(tl, at, dir) {
      const el = timeline.current;
      if (!el) return;
      tl.to(el.querySelectorAll("[data-entry]"), { clipPath: "inset(0% 0% 100% 0%)", y: -40 * dir, rotation: () => (Math.random() - 0.5) * 8, duration: 0.4, stagger: 0.06, ease: "power2.in" }, at);
      tl.to(el.querySelector("[data-rail]"), { scaleY: 0, transformOrigin: "bottom center", duration: 0.5, ease: "power2.in" }, at + 0.1);
    },
  });

  return (
    <section className="scene-fill flex flex-col justify-center py-[clamp(5rem,10vh,7rem)]" aria-labelledby="about-title">
      <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h2 id="about-title" className="headline" data-lines>
            {a.title}
          </h2>
          <div className="mt-7 space-y-4">
            {a.paragraphs.map((p) => (
              <p key={p} data-reveal className="lead max-w-[34ch]">
                <Marked text={p} />
              </p>
            ))}
          </div>
          <dl data-reveal className="mt-8 grid grid-cols-[auto_minmax(0,1fr)] gap-x-8 gap-y-3 border-t-[1.5px] border-ink pt-5">
            {a.facts.map((f) => (
              <div key={f.term} className="contents">
                <dt className="text-ink-soft">{f.term}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 data-reveal className="text-lg font-semibold">
            {a.timelineTitle}
          </h3>
          <div ref={timeline} data-motion-owned className="relative mt-8 pl-8">
            <span data-rail className="absolute bottom-2 left-[5px] top-2 w-[1.5px] origin-top bg-ink" aria-hidden="true" />
            <ol className="space-y-9">
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
