"use client";

import { useLanguage } from "@/hooks/use-language";

const projectMeta = [
  { stack: [".NET 8", "C#"], github: "https://github.com/melokaso1/ligaBetplay_C-", demo: "https://github.com/melokaso1/ligaBetplay_C-", type: "Console App" },
  { stack: ["MySQL", "SQL"], github: "https://github.com/Tomfmp2/MySQL-2-final-project", demo: "https://github.com/Tomfmp2/MySQL-2-final-project", type: "Database Model" },
  { stack: ["SQL"], github: "https://github.com/Tomfmp2/LMS-educational-system", demo: "https://github.com/Tomfmp2/LMS-educational-system", type: "Architecture" },
  { stack: ["Python"], github: "https://github.com/Tomfmp2/banking-system-Python", demo: "https://github.com/Tomfmp2/banking-system-Python", type: "Terminal CLI" },
  { stack: ["Next.js", "React"], github: "https://github.com/Tomfmp2/Portafolio", demo: "https://portafolio-alpha-nine-96.vercel.app/#proyectos", type: "Web App" },
  { stack: [".NET", "Redis"], github: "#", demo: "#", type: "Microservice" },
];

export default function Projects() {
  const { t } = useLanguage();
  const p = t.projects;

  return (
    <section id="proyectos" className="section bg-[#0B0B0F]">
      <div className="page-container">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-label mb-4">
            <span className="label-dot" />
            <span className="text-[11px] font-bold text-white/30 tracking-[0.3em] uppercase">{p.tag}</span>
          </div>
          <h2 className="font-bold text-white tracking-tight mb-4" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", lineHeight: 1.1 }}>
            {p.title}
          </h2>
          <p className="text-white/40 text-base max-w-xl mx-auto font-light leading-relaxed">{p.subtitle}</p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {p.items.map((project, index) => {
            const meta = projectMeta[index] || {};
            return (
              <div key={index} className="group glass card-hover p-7 flex flex-col h-full">
                <div className="flex justify-between items-start mb-5">
                  <span className="text-[10px] font-mono text-[#FF4B4B] uppercase tracking-widest bg-[#FF4B4B]/10 px-2 py-1 rounded">{meta.type}</span>
                  <a href={meta.github} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-[#FF4B4B] transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-white/35 text-sm font-light mb-5 flex-grow leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {(meta.stack || []).map((tech, ti) => (
                    <span key={ti} className="text-[10px] font-mono text-white/30 tracking-wider uppercase px-2 py-1 border border-white/[0.06] rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/[0.06] mt-auto">
                  <a href={meta.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[11px] font-mono text-white/50 tracking-[0.15em] uppercase hover:text-[#FF4B4B] transition-colors duration-300">
                    {p.demo}
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-14">
          <a href="https://github.com/Tomfmp2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3 border border-white/[0.1] text-white/60 hover:text-white hover:border-[#FF4B4B] rounded-full text-sm font-medium transition-all duration-300 hover:bg-[#FF4B4B]/10">
            {p.viewAll}
          </a>
        </div>
      </div>
    </section>
  );
}
