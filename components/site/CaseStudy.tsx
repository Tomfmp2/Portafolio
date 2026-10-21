"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP, SplitText } from "@/lib/gsap";
import { MARKER, NIGHT, PAPER } from "@/lib/palette";
import { useDeckOn, useScene } from "./Deck";
import Note from "./Note";

const R = gsap.utils.random;

interface CaseStudyProps {
  id: string;
  project: {
    name: string;
    when: string;
    role: string;
    summary: string;
    stats: { value: number; label: string }[];
    learned: { name: string; text: string }[];
    note: string;
    privateNote?: string;
  };
  link: { href: string; label: string };
  night?: boolean;
}

/**
 * One project as a scene in two compositions. First the project itself: its
 * name lands letter by letter, the summary and numbers come in. Then the
 * lessons take the stage: the name shrinks into the corner, the summary
 * clears, and a rail is drawn from one lesson to the next, lighting each.
 */
export default function CaseStudy({ id, project, link, night = false }: CaseStudyProps) {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const split = useRef<SplitText | null>(null);
  const deck = useDeckOn();

  useEffect(() => {
    const name = root.current?.querySelector<HTMLElement>("[data-name]");
    if (!name || !deck) return;
    initGSAP();
    // Words too, so a long name only ever wraps between words.
    split.current = SplitText.create(name, { type: "words,chars" });
    return () => {
      split.current?.revert();
      split.current = null;
    };
  }, [deck]);

  const q = <T extends Element = HTMLElement>(selector: string) => root.current?.querySelector<T>(selector) ?? null;
  const qa = (selector: string) => Array.from(root.current?.querySelectorAll<HTMLElement>(selector) ?? []);

  /** The lessons arrive: title, then the rail drawn across while each dot lights and its copy inks in. */
  const lessonsIn = (tl: gsap.core.Timeline, at: number) => {
    const rail = q("[data-rail]");
    tl.set(q("[data-flow]"), { opacity: 1, pointerEvents: "auto" }, at);
    tl.fromTo(q("[data-flow] h4"), { clipPath: "inset(100% 0% 0% 0%)", y: 40 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.6, ease: "power3.out" }, at);
    if (rail) tl.fromTo(rail, { "--rail": 0 }, { "--rail": 1, duration: 1.4, ease: "power2.inOut" }, at + 0.3);
    qa("[data-step]").forEach((step, i) => {
      const t0 = at + 0.35 + i * 0.42;
      tl.fromTo(step.querySelector("[data-dot]"), { scale: 0.3, backgroundColor: night ? NIGHT : PAPER }, { scale: 1, backgroundColor: MARKER, duration: 0.4, ease: "back.out(3)" }, t0);
      tl.fromTo(step.querySelector("[data-step-copy]"), { opacity: 0, y: 24, rotation: 2 }, { opacity: 1, y: 0, rotation: 0, duration: 0.5, ease: "power3.out" }, t0 + 0.05);
    });
  };

  const lessonsOut = (tl: gsap.core.Timeline, at: number, dir: number) => {
    tl.to(qa("[data-flow] h4, [data-step]"), { clipPath: dir > 0 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)", y: -40 * dir, rotation: () => R(-5, 5), duration: 0.45, stagger: 0.06, ease: "power2.in" }, at);
    if (q("[data-rail]")) tl.to(q("[data-rail]"), { "--rail": 0, duration: 0.5, ease: "power2.in" }, at);
    tl.set(q("[data-flow]"), { opacity: 0, pointerEvents: "none" }, at + 0.7);
    tl.set(qa("[data-flow] h4, [data-step]"), { clearProps: "clipPath,transform" }, at + 0.7);
  };

  const shown = useRef(0);

  useScene({
    steps: 2,
    enter(tl, at) {
      const chars = split.current?.chars ?? [];
      shown.current = 0;
      tl.set(q("[data-flow]"), { opacity: 0, pointerEvents: "none" }, 0);
      tl.set(q("[data-name]"), { scale: 1, x: 0, y: 0 }, 0);
      tl.fromTo(q("[data-meta]"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.out" }, at);
      // Letters rise into place in reading order, so the name stays legible the whole way in.
      tl.fromTo(chars, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.018, ease: "power3.out" }, at + 0.05);
      qa("[data-head-rest]").forEach((block, i) =>
        tl.fromTo(block, { clipPath: "inset(100% 0% 0% 0%)", y: 50, skewY: 3 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, skewY: 0, duration: 0.7, ease: "power3.out" }, at + 0.55 + i * 0.12)
      );
      qa("[data-case-count]").forEach((count) => {
        const value = Number(count.dataset.caseCount);
        const n = { v: 0 };
        tl.fromTo(n, { v: 0 }, { v: value, duration: 1.2, ease: "power2.out", onUpdate: () => (count.textContent = String(Math.round(n.v))) }, at + 0.7);
      });
    },
    step(tl, to, dir) {
      const name = q("[data-name]");
      if (to === 1) {
        // Recompose: the name shrinks into the corner and the lessons take the stage.
        tl.to(qa("[data-head-rest]"), { clipPath: "inset(0% 0% 100% 0%)", y: -40, duration: 0.45, stagger: 0.06, ease: "power2.in" }, 0);
        tl.to(name, { scale: 0.42, transformOrigin: "0% 0%", duration: 0.9, ease: "power3.inOut" }, 0.1);
        lessonsIn(tl, 0.65);
      } else {
        lessonsOut(tl, 0, dir);
        tl.to(name, { scale: 1, duration: 0.8, ease: "power3.inOut" }, 0.3);
        tl.to(qa("[data-head-rest]"), { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, 0.6);
      }
      shown.current = to;
    },
    leave(tl, at, dir) {
      const chars = split.current?.chars ?? [];
      tl.to(chars, { yPercent: -60 * dir, opacity: 0, duration: 0.4, stagger: 0.008, ease: "power2.in" }, at);
      tl.to(q("[data-meta]"), { clipPath: "inset(0% 0% 0% 100%)", duration: 0.4, ease: "power2.in" }, at);
      if (shown.current === 1) lessonsOut(tl, at, dir);
      else tl.to(qa("[data-head-rest]"), { clipPath: "inset(0% 0% 100% 0%)", y: -50, duration: 0.45, stagger: 0.06, ease: "power2.in" }, at);
    },
  });

  const rule = night ? "border-paper/70" : "border-ink";
  return (
    <article ref={root} data-motion-owned className={`scene-fill ${night ? "on-night" : ""}`} aria-labelledby={`${id}-title`}>
      <div className="case-stage wrap py-[clamp(5rem,10vh,7rem)]">
        <div data-head className="case-head">
          <p data-meta className="small">
            {project.when}. {project.role}
          </p>
          <h3 id={`${id}-title`} data-name className="display mt-4 !text-[clamp(2.4rem,6vw,6.5rem)]">
            {project.name}
          </h3>

          <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div data-head-rest>
              <p className="lead max-w-[34ch]">{project.summary}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={`btn ${night ? "btn-line" : "btn-ink"}`}>
                  {link.label}
                </a>
                <Note arrow="left" decorative>
                  {project.note}
                </Note>
              </div>
              {project.privateNote && <p className="small mt-4">{project.privateNote}</p>}
            </div>
            <dl className="grid content-start gap-8 sm:grid-cols-2" data-head-rest>
              {project.stats.map((s) => (
                <div key={s.label} className={`border-t-[1.5px] pt-4 ${rule}`}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="stat-value block" data-case-count={s.value}>
                      {s.value}
                    </span>
                    <span className="small mt-2 block" aria-hidden="true">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div data-flow className="case-flow">
          <h4 className="title">{t.work.learnedTitle}</h4>
          <div className="relative mt-10">
            <span data-rail className={`flow-rail ${night ? "!bg-paper/70" : ""}`} aria-hidden="true" />
            <ol className="flow-steps [--flow-cols:3]">
              {project.learned.map((step) => (
                <li key={step.name} data-step className="flow-step">
                  <span data-dot className={`flow-dot ${night ? "!border-paper/70" : ""}`} aria-hidden="true" />
                  <div data-step-copy>
                    <p className="text-lg font-bold">{step.name}</p>
                    <p className="small mt-1 max-w-[30ch]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </article>
  );
}
