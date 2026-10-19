"use client";

import { useLanguage } from "@/hooks/use-language";
import SplitChars from "@/components/experience/SplitChars";

export default function About() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <section id="sobre-mi" data-chapter={5} className="chapter" aria-labelledby="about-title">
      <div className="chapter-copy page-container">
        <div className="chapter-text">
          <h2 id="about-title" className="chapter-title"><SplitChars text={a.title} /></h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-paper/90">
            {a.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 border-t border-line pt-6">
            {a.facts.map((f) => (
              <div key={f.term} className="contents">
                <dt className="text-dim">{f.term}</dt>
                <dd className="text-paper">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
