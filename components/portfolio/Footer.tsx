"use client";

import { useLanguage } from "@/hooks/use-language";
import { modelCredits } from "@/lib/translations";

export default function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer className="relative z-10 border-t border-line bg-void/85 backdrop-blur-sm">
      <div className="page-container flex flex-col gap-4 py-8 text-sm text-dim md:flex-row md:items-start md:justify-between">
        <p>© {new Date().getFullYear()} {f.rights}</p>
        <p className="max-w-xl">
          {f.credits}{" "}
          {modelCredits.map((m, i) => (
            <span key={m.href}>
              <a href={m.href} target="_blank" rel="noopener noreferrer" className="link-underline text-phosphor">{m.name}</a> {f.by} {m.author}
              {i < modelCredits.length - 1 && ", "}
            </span>
          ))}
          .
        </p>
        <a href="#inicio" className="link-underline shrink-0 text-paper">{f.backToTop}</a>
      </div>
    </footer>
  );
}
