"use client";

import { useLanguage } from "@/hooks/use-language";

/** Four concentric rings with the current layer filled — a legend for the particle diagram. */
function LayerGlyph({ index }: { index: number }) {
  const radii = [3.5, 6.5, 9.5, 12.5];
  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden="true">
      {radii.map((r, i) => (
        <circle
          key={r}
          cx="14"
          cy="14"
          r={r}
          fill="none"
          stroke={i === index ? "var(--signal)" : "var(--line)"}
          strokeWidth={i === index ? 2.4 : 1.2}
        />
      ))}
    </svg>
  );
}

export default function Build() {
  const { t } = useLanguage();
  const b = t.build;

  return (
    <section id="habilidades" data-chapter={1} className="chapter" aria-labelledby="build-title">
      <div className="chapter-copy page-container">
        <div className="chapter-text">
          <h2 id="build-title" className="chapter-title">{b.title}</h2>
          <p className="lede mt-5">{b.lede}</p>

          <ol className="mt-10 space-y-6">
            {b.layers.map((layer, i) => (
              <li key={layer.name} className="flex gap-4">
                <LayerGlyph index={i} />
                <div>
                  <h3 className="font-bold text-paper">{layer.name}</h3>
                  <p className="text-dim">{layer.text}</p>
                  <p className="mt-1 text-sm text-phosphor">{layer.tech}</p>
                </div>
              </li>
            ))}
          </ol>

          <h3 className="mt-12 font-bold text-paper">{b.aroundTitle}</h3>
          <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
            {b.around.map((item) => (
              <div key={item.name} className="contents">
                <dt className="text-dim">{item.name}</dt>
                <dd className="text-paper">{item.tech}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
