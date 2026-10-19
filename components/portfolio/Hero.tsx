"use client";

import { useLanguage } from "@/hooks/use-language";
import SplitChars from "@/components/experience/SplitChars";

export default function Hero() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section id="inicio" data-chapter={0} className="chapter" aria-labelledby="hero-name">
      <div className="chapter-copy page-container">
        <div className="chapter-text !max-w-none w-fit">
          <p className="hero-rise text-lg font-semibold text-phosphor [--rise-delay:0ms]" data-scramble={h.role}>{h.role}</p>
          <h1 id="hero-name" tabIndex={-1} className="display-name mt-4 focus:outline-none">
            <span className="block"><SplitChars text={h.firstName} /></span>
            <span className="block"><SplitChars text={h.lastName} /></span>
          </h1>
          <p className="hero-rise lede mt-8 max-w-md [--rise-delay:380ms]">{h.lede}</p>
          <div className="hero-rise mt-9 flex flex-wrap items-center gap-3 [--rise-delay:480ms]">
            <a href="/CV/Tomas_Medina_CV.pdf" download className="btn-signal">
              {h.cv}
            </a>
            <a href="#proyectos" className="btn-quiet">
              {h.projects}
            </a>
          </div>
          <p className="prompt mt-14 text-sm" aria-hidden="true">
            {h.prompt}
            <br />
            <span className="cursor" />
          </p>
        </div>
      </div>
    </section>
  );
}
