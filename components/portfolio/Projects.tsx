"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { subscribe } from "@/lib/experience/store";
import TerminalModal from "./terminal/TerminalModal";

interface Featured {
  name: string;
  kind: string;
  text: string;
  facts: string[];
  stack: string;
  href: string;
  privateNote?: string;
}

function FeaturedProject({ id, chapter, project, linkLabel }: { id: string; chapter: number; project: Featured; linkLabel: string }) {
  const { t } = useLanguage();
  const titleId = `${id}-title`;
  return (
    <section id={id} data-chapter={chapter} className="chapter" aria-labelledby={titleId}>
      <div className="chapter-copy page-container">
        <article className="chapter-text">
          <p className="font-semibold text-phosphor">{project.kind}</p>
          <h2 id={titleId} className="chapter-title mt-3">{project.name}</h2>
          <p className="lede mt-5">{project.text}</p>
          <ul className="mt-8 space-y-3" aria-label={t.projects.factsLabel}>
            {project.facts.map((fact) => (
              <li key={fact} className="flex gap-3 text-paper">
                <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-dim">{project.stack}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href={project.href} target="_blank" rel="noopener noreferrer" className="btn-quiet">
              {linkLabel}
            </a>
            {project.privateNote && <span className="text-sm text-dim">{project.privateNote}</span>}
          </div>
        </article>
      </div>
    </section>
  );
}

function MoreProjects() {
  const { t } = useLanguage();
  const m = t.projects.more;
  const [demo, setDemo] = useState<string | null>(null);

  // The 3D floppies and the console open demos through the shared event bus.
  useEffect(() => subscribe("demo", (id) => setDemo(id)), []);

  return (
    <section id="mas-proyectos" data-chapter={4} className="chapter" aria-labelledby="more-title">
      <div className="chapter-copy page-container">
        <div className="chapter-text">
          <h2 id="more-title" className="chapter-title">{m.title}</h2>
          <p className="lede mt-5">{m.lede}</p>
          <ul className="mt-9 divide-y divide-line border-y border-line">
            {m.items.map((item) => (
              <li key={item.name} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-bold text-paper">{item.name}</h3>
                  <span className="text-sm text-dim">{item.stack}</span>
                </div>
                <p className="mt-1 text-dim">{item.text}</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="link-underline text-phosphor">
                    {t.projects.code}
                  </a>
                  {item.demoId && (
                    <button type="button" onClick={() => setDemo(item.demoId!)} className="link-underline prompt">
                      {t.projects.demo}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <a href={m.githubHref} target="_blank" rel="noopener noreferrer" className="link-underline mt-6 inline-block text-paper">
            {m.viewAll}
          </a>
        </div>
      </div>
      <div className="pointer-events-auto">
        <TerminalModal demoId={demo} onClose={() => setDemo(null)} />
      </div>
    </section>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const p = t.projects;
  return (
    <>
      <FeaturedProject id="proyectos" chapter={2} project={p.ocap} linkLabel={p.code} />
      <FeaturedProject id="feria-magica" chapter={3} project={p.feria} linkLabel={p.live} />
      <MoreProjects />
    </>
  );
}
