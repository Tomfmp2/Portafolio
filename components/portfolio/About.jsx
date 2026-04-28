"use client";

import { useLanguage } from "@/hooks/use-language";

export default function About() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <section id="sobre-mi" className="section bg-[#0B0B0F]">
      <div className="page-container">

        {/* Section label */}
        <div className="text-center mb-14">
          <div className="section-label mb-4">
            <span className="label-dot" />
            <span className="text-[11px] font-bold text-white/30 tracking-[0.3em] uppercase">
              {a.tag}
            </span>
          </div>
          <h2
            className="font-bold text-white tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
          >
            {a.title}
          </h2>
        </div>

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">

          {/* Left — bio */}
          <div className="glass p-8 sm:p-10 card-hover">
            <div className="flex items-center gap-5 mb-8 pb-7 border-b border-white/[0.07]">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{a.name}</h3>
                <p className="text-sm text-[#FF4B4B] font-medium mt-0.5 uppercase tracking-wide">{a.role}</p>
              </div>
            </div>

            <div className="space-y-5 text-[15px] text-white/45 font-light leading-relaxed">
              <p>
                {a.p1a === undefined ? "" : (
                  <>
                    <span className="text-white/80 font-normal">{a.p1a}</span>{", "}{a.p1b}{" "}
                    <code className="text-white/80 text-xs bg-white/[0.07] px-1.5 py-0.5 rounded">.NET</code>,{" "}
                    <code className="text-white/80 text-xs bg-white/[0.07] px-1.5 py-0.5 rounded">C#</code>{" "}
                    {a.p1c}{" "}
                    <code className="text-white/80 text-xs bg-white/[0.07] px-1.5 py-0.5 rounded">MySQL</code>{" "}
                    {a.p1d}
                  </>
                )}
              </p>
              <p>{a.p2a && (<><span className="text-white/80">{a.p2a}</span>{". "}{a.p2b}</>)}</p>
              <p>{a.p3a && (<>{a.p3a}{" "}<span className="text-white/80">{a.p3b}</span>.</>)}</p>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-white/30">
              <span className="w-2 h-2 rounded-full bg-[#FF4B4B] animate-pulse flex-shrink-0" />
              {a.location}
            </div>
          </div>

          {/* Right — contributions */}
          <div className="glass p-8 sm:p-10 card-hover">
            <h3 className="text-[10px] font-bold text-white/30 tracking-[0.25em] uppercase mb-6 pb-4 border-b border-white/[0.07]">
              {a.whatIOffer}
            </h3>
            <div className="space-y-6">
              {a.contributions.map((item, i) => (
                <div key={i} className="group flex gap-5">
                  <span className="text-[10px] font-mono text-white/20 group-hover:text-[#FF4B4B] transition-colors duration-300 pt-0.5 flex-shrink-0">
                    0{i + 1}
                  </span>
                  <div>
                    <h4 className="text-white/80 font-semibold mb-1.5 group-hover:text-white transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-sm text-white/35 font-light leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
