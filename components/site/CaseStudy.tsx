"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP, MEDIA, SplitText } from "@/lib/gsap";
import { scene, settle } from "@/lib/scene";
import Note from "./Note";

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
 * One project told by what it taught: a plain summary, two numbers, and three
 * lessons lit up one by one along a rail as you scroll. The night variant is a
 * dark sheet that slides over the paper.
 */
export default function CaseStudy({ id, project, link, night = false }: CaseStudyProps) {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    initGSAP();
    const mm = gsap.matchMedia();
    mm.add({ motion: MEDIA.motion, desktop: MEDIA.desktop }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;

      if (night) {
        // The night sheet opens out over the paper. A clip, not a scale: a transform here would
        // break the pinned lessons inside (position: fixed is relative to transformed ancestors).
        gsap.fromTo(el, { clipPath: "inset(0% 4% 0% 4% round 3rem)" }, { clipPath: "inset(0% 0% 0% 0% round 1.25rem)", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: true } });
      }
      // Head scene: the case holds still while its name runs across in full, the numbers count
      // up with the scroll and the summary comes in. On phones the head is taller than the
      // screen, so it can't hold; the same things play as it scrolls past instead.
      const head = el.querySelector<HTMLElement>("[data-head]");
      let nameSplit: SplitText | null = null;
      const name = el.querySelector<HTMLElement>("[data-name]");
      const counts = gsap.utils.toArray<HTMLElement>("[data-case-count]", el);
      if (head && name) {
        gsap.set(name, { whiteSpace: "nowrap" });
        const overflow = () => Math.max(name.scrollWidth - name.clientWidth, 0);
        const headTl = desktop
          ? scene(head, 170, { invalidateOnRefresh: true })
          : gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: head, start: "top 80%", end: "bottom 40%", scrub: 1, invalidateOnRefresh: true } });
        headTl.fromTo(name, { x: () => (overflow() ? 0 : name.clientWidth * 0.06) }, { x: () => (overflow() ? -overflow() : -name.clientWidth * 0.04), duration: 1 }, 0);
        headTl.from(head.querySelectorAll("[data-head-rest]"), { opacity: 0, y: 24, duration: 0.3, stagger: 0.1 }, 0.15);
        counts.forEach((count) => {
          const value = Number(count.dataset.caseCount);
          const n = { v: 0 };
          count.textContent = "0";
          headTl.to(n, { v: value, duration: 0.6, onUpdate: () => (count.textContent = String(Math.round(n.v))) }, 0.3);
        });
        if (desktop) {
          settle(headTl, 0.25);
          // Exit: the name's letters burst apart and the rest is wiped away upward.
          const out = headTl.duration();
          nameSplit = SplitText.create(name, { type: "chars" });
          const R = gsap.utils.random;
          headTl.to(nameSplit.chars, { yPercent: () => R(-280, -120), xPercent: () => R(-80, 80), rotation: () => R(-60, 60), opacity: 0, duration: 0.7, stagger: { each: 0.015, from: "random" }, ease: "power3.in" }, out)
            .to([...head.children].filter((c) => c !== name), { clipPath: "inset(0% 0% 100% 0%)", y: -50, skewY: -3, duration: 0.5, stagger: 0.08, ease: "power2.in" }, out + 0.1);
        }
      }

      // Lessons scene: the block holds while the scroll draws the rail from one lesson to the
      // next, lighting each as it passes. It fits the screen at every size, so it always holds.
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
      const rail = el.querySelector<HTMLElement>("[data-rail]");
      const flow = el.querySelector<HTMLElement>("[data-flow]");
      if (!flow) return;
      const tl = scene(flow, desktop ? 200 : 170);
      if (rail) tl.fromTo(rail, { "--rail": 0 }, { "--rail": 1, duration: steps.length });
      steps.forEach((step, i) => {
        tl.fromTo(step.querySelector("[data-dot]"), { scale: 0.4, backgroundColor: night ? "#141414" : "#f2efe6" }, { scale: 1, backgroundColor: "#d4ff3a", duration: 0.3 }, i + 0.2)
          .fromTo(step.querySelector("[data-step-copy]"), { opacity: 0.25 }, { opacity: 1, duration: 0.4 }, i + 0.2);
      });
      settle(tl, 0.25);
      // Exit: the lessons leave one after another and the rail is drawn back.
      const out = tl.duration();
      tl.to(flow.querySelectorAll("h4, [data-step]"), { clipPath: "inset(0% 0% 100% 0%)", y: -48, rotation: () => gsap.utils.random(-6, 6), duration: 0.5, stagger: 0.08, ease: "power2.in" }, out);
      if (rail) tl.to(rail, { "--rail": 0, duration: 0.6, ease: "power2.in" }, out);

      return () => {
        nameSplit?.revert();
        counts.forEach((count) => (count.textContent = count.dataset.caseCount ?? ""));
      };
    });
    return () => mm.revert();
  }, [night]);

  const rule = night ? "border-paper/70" : "border-ink";
  return (
    <article
      ref={root}
      className={night ? "on-night mx-[clamp(0.5rem,1.5vw,1.25rem)] mt-[clamp(5rem,12vw,10rem)] overflow-hidden rounded-[1.25rem] py-[clamp(4rem,10vw,8rem)]" : "overflow-hidden pt-[clamp(4rem,10vw,8rem)]"}
      aria-labelledby={`${id}-title`}
    >
      <div className="wrap">
        <div data-head data-pin className="flex flex-col justify-center">
        <p className="small">
          {project.when}. {project.role}
        </p>
        <h3 id={`${id}-title`} data-name data-skew className="display mt-4 !text-[clamp(3.6rem,12vw,13rem)]">
          {project.name}
        </h3>

        <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
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

        <div data-flow data-pin className="mt-[clamp(4rem,8vw,6rem)]">
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
