"use client";

import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";
import CaseStudy from "./CaseStudy";
import MoreProjects from "./MoreProjects";

export default function Work() {
  const { t } = useLanguage();
  return (
    <section id="proyectos" className="pb-[clamp(6rem,12vw,10rem)] pt-[clamp(5rem,10vw,8rem)]" aria-labelledby="work-title">
      <div className="wrap">
        <h2 id="work-title" className="display" data-lines>
          {t.work.title}
        </h2>
      </div>
      <CaseStudy id="feria" project={t.work.feria} link={{ href: links.feria, label: t.work.live }} />
      <CaseStudy id="ocap" project={t.work.ocap} link={{ href: links.ocap, label: t.work.code }} night />
      <MoreProjects />
    </section>
  );
}
