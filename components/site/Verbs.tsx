"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP, MEDIA } from "@/lib/gsap";
import { scene, settle, sweep } from "@/lib/scene";

/**
 * The way of working, as four verbs set huge: one row in outline, one in ink.
 * A scene: the band holds still while the scroll runs both rows across in
 * opposite directions and inks the outlined verbs one by one.
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
      const tl = scene(el, 170);
      rows.forEach((row, i) => {
        tl.fromTo(row, { xPercent: i % 2 ? -40 : 0 }, { xPercent: i % 2 ? 0 : -40, duration: 1 }, 0);
      });
      // The outlined verbs fill with ink in turn as the band runs.
      const outlined = el.querySelectorAll<HTMLElement>(".verb-outline .verb");
      outlined.forEach((verb, i) => {
        tl.to(verb, { color: "#111111", duration: 0.12 }, (i / outlined.length) * 0.9);
      });
      settle(tl);
      // Exit: the rows part, one up and one down, and fade.
      const out = tl.duration();
      rows.forEach((row, i) => tl.to(row, { yPercent: i % 2 ? 80 : -80, opacity: 0, duration: 0.6, ease: "power2.in" }, out));
      // A highlighter sweep wipes the screen clean before the projects open.
      sweep(tl, out + 0.25, () => {});
    });
    return () => mm.revert();
  }, []);

  const row = (offset: number) => [...verbs.slice(offset), ...verbs.slice(0, offset), ...verbs];
  return (
    <div ref={root} className="verbs-stage flex flex-col justify-center overflow-hidden py-[clamp(3rem,8vw,6rem)]">
      <p className="sr-only">{verbs.join(", ")}</p>
      {[0, 2].map((offset) => (
        <div key={offset} data-row data-skew className={`flex w-max whitespace-nowrap ${offset ? "" : "verb-outline"}`} aria-hidden="true">
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
