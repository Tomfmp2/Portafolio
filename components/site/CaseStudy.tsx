"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP, MEDIA } from "@/lib/gsap";
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
        gsap.fromTo(el, { scale: 0.94, borderRadius: "3rem" }, { scale: 1, borderRadius: "1.25rem", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: true } });
      }
      // The name runs on one line and slides sideways while the case is on screen, far
      // enough that a long name is read in full. Without motion it simply wraps.
      const name = el.querySelector<HTMLElement>("[data-name]");
      if (name) {
        gsap.set(name, { whiteSpace: "nowrap" });
        const overflow = () => Math.max(name.scrollWidth - name.clientWidth, 0);
        gsap.fromTo(
          name,
          { x: () => (overflow() ? 0 : name.clientWidth * (desktop ? 0.08 : 0.03)) },
          { x: () => (overflow() ? -overflow() : -name.clientWidth * (desktop ? 0.06 : 0.03)), ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 30%", scrub: true, invalidateOnRefresh: true } }
        );
      }

      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el.querySelector("[data-flow]"), start: "top 80%", end: "bottom 55%", scrub: 0.6 } });
      tl.fromTo(el.querySelector("[data-rail]"), { "--rail": 0 }, { "--rail": 1, duration: steps.length });
      steps.forEach((step, i) => {
        tl.fromTo(step.querySelector("[data-dot]"), { scale: 0.4, backgroundColor: night ? "#141414" : "#f2efe6" }, { scale: 1, backgroundColor: "#d4ff3a", duration: 0.3 }, i + 0.2)
          .fromTo(step.querySelector("[data-step-copy]"), { opacity: 0.25 }, { opacity: 1, duration: 0.4 }, i + 0.2);
      });
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
        <p className="small">
          {project.when}. {project.role}
        </p>
        <h3 id={`${id}-title`} data-name className="display mt-4 !text-[clamp(3.6rem,12vw,13rem)]">
          {project.name}
        </h3>

        <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
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
          <dl className="grid content-start gap-8 sm:grid-cols-2" data-parallax="0.12">
            {project.stats.map((s) => (
              <div key={s.label} className={`border-t-[1.5px] pt-4 ${rule}`}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="stat-value block" data-count={s.value}>
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

        <div data-flow className="mt-[clamp(4rem,8vw,6rem)]">
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
