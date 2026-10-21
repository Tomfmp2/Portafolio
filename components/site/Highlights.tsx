"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";
import { gsap, initGSAP, SplitText } from "@/lib/gsap";
import { useDeckOn, useScene } from "./Deck";
import Marked from "./Marked";
import Note from "./Note";


/**
 * The 30-second version of the CV, as a scene with one step per statement.
 * Each step scatters the current statement and turns the next one up into
 * place word by word, then highlights its key phrase and writes its note.
 */
export default function Highlights() {
  const { t } = useLanguage();
  const hl = t.highlights;
  const root = useRef<HTMLElement>(null);
  const words = useRef<HTMLElement[][]>([]);
  const deck = useDeckOn();

  useEffect(() => {
    const el = root.current;
    if (!el || !deck) return;
    initGSAP();
    const items = el.querySelectorAll<HTMLElement>("[data-statement] p");
    const splits = Array.from(items).map((p) => SplitText.create(p, { type: "words" }));
    words.current = splits.map((s) => s.words as HTMLElement[]);
    return () => splits.forEach((s) => s.revert());
  }, [deck]);

  const statement = (i: number) => root.current?.querySelectorAll<HTMLElement>("[data-statement]")[i];

  /** Turns statement `i` up into place: words flip in, the phrase is highlighted, the note is written. */
  const showStatement = (tl: gsap.core.Timeline, i: number, at: number) => {
    const item = statement(i);
    if (!item) return;
    const mark = item.querySelector("[data-hl]");
    const note = item.querySelector("[data-note]");
    tl.set(item, { opacity: 1 }, at);
    tl.fromTo(words.current[i] ?? [], { opacity: 0, yPercent: 50 }, { opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.03, ease: "power3.out" }, at);
    if (mark) tl.fromTo(mark, { "--hl": "0%" }, { "--hl": "100%", duration: 0.7, ease: "power2.inOut" }, at + 0.7);
    if (note) tl.fromTo(note, { opacity: 0, x: 24, rotation: 5 }, { opacity: 1, x: 0, rotation: -3, duration: 0.5, ease: "back.out(2)" }, at + 1.1);
    tl.to(root.current?.querySelector("[data-progress]") ?? [], { scaleX: (i + 1) / hl.items.length, duration: 0.6, ease: "power2.out" }, at);
  };

  /** Clears statement `i`: words lift away in reading order, the highlight and note leave with them. */
  const hideStatement = (tl: gsap.core.Timeline, i: number, at: number, dir: number) => {
    const item = statement(i);
    if (!item) return;
    tl.to(words.current[i] ?? [], { yPercent: -50 * dir, opacity: 0, duration: 0.4, stagger: 0.012, ease: "power2.in" }, at);
    tl.to(item.querySelector("[data-hl]"), { "--hl": "0%", duration: 0.35 }, at);
    tl.to(item.querySelector("[data-note]"), { opacity: 0, x: 30, duration: 0.3 }, at);
    tl.set(item, { opacity: 0 }, at + 0.7);
  };

  const shown = useRef(0);

  useScene({
    steps: hl.items.length,
    enter(tl, at) {
      const el = root.current;
      if (!el) return;
      const items = el.querySelectorAll<HTMLElement>("[data-statement]");
      tl.set(items, { opacity: 0 }, 0);
      tl.fromTo(el.querySelector("[data-hl-head]"), { clipPath: "inset(100% 0% 0% 0%)", y: 30 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.6, ease: "power3.out" }, at);
      tl.fromTo(el.querySelector("[data-progress]"), { scaleX: 0 }, { scaleX: 0, duration: 0.01 }, at);
      shown.current = 0;
      showStatement(tl, 0, at + 0.2);
    },
    step(tl, to, dir) {
      hideStatement(tl, shown.current, 0, dir);
      showStatement(tl, to, 0.45);
      shown.current = to;
    },
    leave(tl, at, dir) {
      hideStatement(tl, shown.current, at, dir);
      tl.to(root.current?.querySelector("[data-hl-head]") ?? [], { clipPath: "inset(0% 0% 100% 0%)", y: -30, duration: 0.4, ease: "power2.in" }, at + 0.1);
    },
  });

  return (
    <section ref={root} data-motion-owned className="scene-fill relative" aria-labelledby="highlights-title">
      <div className="wrap flex min-h-full flex-col justify-center py-24">
        <div data-hl-head>
          <div className="flex items-baseline justify-between gap-6 border-b-[1.5px] border-ink pb-4">
            <h2 id="highlights-title" className="text-lg font-semibold">
              {hl.title}
            </h2>
            <a href={links.cv} download className="link text-sm font-medium">
              {hl.cv}
            </a>
          </div>
          <div className="relative mt-1 h-[3px] overflow-hidden" aria-hidden="true">
            <div data-progress className="h-full origin-left bg-ink" />
          </div>
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
