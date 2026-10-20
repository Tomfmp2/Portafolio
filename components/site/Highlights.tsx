"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";
import { gsap, initGSAP, MEDIA, SplitText } from "@/lib/gsap";
import { penHold, penSweepProgress } from "@/lib/pen";
import Marked from "./Marked";
import Note from "./Note";

/**
 * The 30-second version of the CV. On large screens the section pins and the
 * three statements are read one after another as you scroll: words ink in,
 * the key phrase gets highlighted, the margin note is written, then the next.
 */
export default function Highlights() {
  const { t } = useLanguage();
  const hl = t.highlights;
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    initGSAP();
    const mm = gsap.matchMedia();

    mm.add({ motion: MEDIA.motion, desktop: MEDIA.desktop }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-statement]", el);

      // Each phrase is drawn by the 3D pen, in step with the scroll, over a long range.
      const clearMarks = () => el.querySelectorAll<HTMLElement>("[data-hl]").forEach((m) => m.style.removeProperty("--hl"));
      const sweep = (mark: Element) => (p: number) => penSweepProgress(mark, p, (d) => (mark as HTMLElement).style.setProperty("--hl", `${d * 100}%`));

      if (!desktop) {
        items.forEach((item) => {
          const mark = item.querySelector("[data-hl]");
          const note = item.querySelector("[data-note]");
          const owner = {};
          const proxy = { p: 0 };
          if (mark) (mark as HTMLElement).style.setProperty("--hl", "0%");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: item, start: "top 85%", end: "top 30%", scrub: 0.9, onToggle: (self) => penHold(owner, self.isActive) },
          });
          tl.to(proxy, { p: 1, duration: 1, ease: "none", onUpdate: () => mark && sweep(mark)(proxy.p) });
          if (note) tl.from(note, { opacity: 0, x: 10, duration: 0.3 }, 0.75);
        });
        return clearMarks;
      }

      const splits = items.map((item) => SplitText.create(item.querySelector("p")!, { type: "words" }));
      // Windows of the timeline where the pen is drawing; it's held on the phrase inside them.
      const windows: [number, number][] = [];
      const owner = {};
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${items.length * 180}%`,
          pin: true,
          scrub: 1,
          onUpdate: () => penHold(owner, windows.some(([a, b]) => tl.time() > a && tl.time() < b)),
          onToggle: (self) => !self.isActive && penHold(owner, false),
        },
      });
      const progress = el.querySelector("[data-progress]");

      items.forEach((item, i) => {
        const words = splits[i].words;
        const mark = item.querySelector("[data-hl]");
        const note = item.querySelector("[data-note]");
        const strokes = item.querySelectorAll("[data-draw]");
        const at = i * 4;

        // Opacity, not visibility: hidden statements must stay in the accessibility tree.
        gsap.set(item, { opacity: i === 0 ? 1 : 0 });
        gsap.set(words, { opacity: 0.12 });
        if (mark) (mark as HTMLElement).style.setProperty("--hl", "0%");
        if (note) gsap.set(note, { opacity: 0 });

        if (i > 0) tl.fromTo(item, { opacity: 0, yPercent: 18 }, { opacity: 1, yPercent: 0, duration: 0.6 }, at - 0.4);
        tl.to(words, { opacity: 1, duration: 1.4, stagger: 1.4 / words.length }, at);
        if (mark) {
          // The pen reaches the phrase while the words are still inking in, then draws it.
          const proxy = { p: 0 };
          windows.push([at + 0.9, at + 2.6]);
          tl.to(proxy, { p: 1, duration: 1.7, onUpdate: () => sweep(mark)(proxy.p) }, at + 0.9);
        }
        if (note) tl.to(note, { opacity: 1, duration: 0.3 }, at + 2.5);
        if (strokes.length) tl.from(strokes, { drawSVG: 0, duration: 0.5, stagger: 0.1 }, at + 2.5);
        if (i < items.length - 1) tl.to(item, { opacity: 0, yPercent: -14, duration: 0.6 }, at + 3.5);
      });
      if (progress) tl.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: tl.duration() }, 0);

      return () => {
        splits.forEach((s) => s.revert());
        clearMarks();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="lo-importante" data-motion-owned className="relative bg-paper" aria-labelledby="highlights-title">
      <div className="wrap flex min-h-svh flex-col justify-center py-24">
        <div className="flex items-baseline justify-between gap-6 border-b-[1.5px] border-ink pb-4">
          <h2 id="highlights-title" className="text-lg font-semibold">
            {hl.title}
          </h2>
          <a href={links.cv} download className="link text-sm font-medium">
            {hl.cv}
          </a>
        </div>
        <div className="relative mt-1 h-[3px] overflow-hidden" aria-hidden="true">
          <div data-progress className="h-full origin-left bg-ink" style={{ transform: "scaleX(0)" }} />
        </div>

        <ol className="hl-stage mt-[clamp(2.5rem,8vh,5rem)]">
          {hl.items.map((item) => (
            <li key={item.text} data-statement className="grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem] md:items-end">
              <p className="statement max-w-[24ch]">
                <Marked text={item.text} />
              </p>
              <Note arrow="left" className="md:pb-3">
                {item.note}
              </Note>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
