"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";

// The demo terminal (and framer-motion with it) is fetched the first time someone opens a demo.
const TerminalModal = dynamic(() => import("./TerminalModal"), { ssr: false });

export default function MoreProjects() {
  const { t } = useLanguage();
  const m = t.work.more;
  const [demo, setDemo] = useState<string | null>(null);
  // Stays mounted after the first open so its closing animation can still play.
  const [opened, setOpened] = useState(false);
  const open = (id: string) => {
    setOpened(true);
    setDemo(id);
  };

  return (
    <article className="wrap pt-[clamp(5rem,12vw,10rem)]" aria-labelledby="more-title">
      <div className="grid gap-6 md:grid-cols-2 md:items-end">
        <h3 id="more-title" className="headline" data-lines data-skew>
          {m.title}
        </h3>
        <p data-reveal className="body-copy">{m.lede}</p>
      </div>

      <ul className="mt-12">
        {m.items.map((item) => (
          <li key={item.name} data-reveal="x" className="project-row grid gap-x-8 gap-y-3 py-7 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] md:items-center">
            <div>
              <h4 className="title">
                <mark className="hl">{item.name}</mark>
              </h4>
              <p className="small mt-2">{item.stack}</p>
            </div>
            <p className="body-copy">{item.text}</p>
            <div className="flex flex-wrap gap-2 md:justify-end">
              {item.demoId && (
                <button type="button" onClick={() => open(item.demoId!)} className="btn btn-ink min-h-11 px-5 text-sm">
                  {m.demo}
                </button>
              )}
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="btn btn-line min-h-11 px-5 text-sm">
                {t.work.code}
              </a>
            </div>
          </li>
        ))}
      </ul>

      <a href={links.github} target="_blank" rel="noopener noreferrer" data-reveal className="link mt-8 inline-block font-medium">
        {m.all}
      </a>

      {opened && <TerminalModal demoId={demo} onClose={() => setDemo(null)} />}
    </article>
  );
}
