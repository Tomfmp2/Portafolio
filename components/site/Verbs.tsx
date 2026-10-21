"use client";

import { useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { INK } from "@/lib/palette";
import { useScene } from "./Deck";

/**
 * The way of working, as four verbs set huge: one row in outline, one in ink.
 * On arrival the two rows race across in opposite directions while the
 * outlined verbs fill with ink; on the way out they part, one up, one down.
 */
export default function Verbs() {
  const { t } = useLanguage();
  const root = useRef<HTMLDivElement>(null);
  const verbs = t.verbs;

  useScene({
    enter(tl, at) {
      const el = root.current;
      if (!el) return;
      const rows = el.querySelectorAll<HTMLElement>("[data-row]");
      rows.forEach((row, i) =>
        tl.fromTo(row, { xPercent: i % 2 ? -45 : 5, yPercent: 0, opacity: 1 }, { xPercent: i % 2 ? -5 : -40, duration: 2.4, ease: "power2.out" }, at)
      );
      const outlined = el.querySelectorAll<HTMLElement>(".verb-outline .verb");
      outlined.forEach((verb, i) => tl.fromTo(verb, { color: "rgba(26,26,26,0)" }, { color: INK, duration: 0.25 }, at + 0.4 + i * 0.22));
    },
    leave(tl, at, dir) {
      const rows = root.current?.querySelectorAll<HTMLElement>("[data-row]") ?? [];
      rows.forEach((row, i) => tl.to(row, { yPercent: (i % 2 ? 90 : -90) * dir, opacity: 0, duration: 0.55, ease: "power2.in" }, at));
    },
  });

  const row = (offset: number) => [...verbs.slice(offset), ...verbs.slice(0, offset), ...verbs];
  return (
    <div ref={root} className="scene-fill flex flex-col justify-center overflow-hidden py-[clamp(3rem,8vw,6rem)]">
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
