"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP, MEDIA } from "@/lib/gsap";

/**
 * The way of working, as four verbs set huge: one row in outline, one in ink,
 * sliding in opposite directions with the scroll.
 */
export default function Verbs() {
  const { t } = useLanguage();
  const root = useRef<HTMLDivElement>(null);
  const verbs = t.verbs;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    initGSAP();
    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      const rows = el.querySelectorAll<HTMLElement>("[data-row]");
      rows.forEach((row, i) => {
        gsap.fromTo(row, { xPercent: i % 2 ? -30 : 0 }, { xPercent: i % 2 ? 0 : -30, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.4 } });
      });
    });
    return () => mm.revert();
  }, []);

  const row = (offset: number) => [...verbs.slice(offset), ...verbs.slice(0, offset), ...verbs];
  return (
    <div ref={root} className="overflow-hidden py-[clamp(3rem,8vw,6rem)]">
      <p className="sr-only">{verbs.join(", ")}</p>
      {[0, 2].map((offset) => (
        <div key={offset} data-row className={`flex w-max whitespace-nowrap ${offset ? "" : "verb-outline"}`} aria-hidden="true">
          {row(offset).map((verb, i) => (
            <span key={i} className="verb">
              {verb}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
