"use client";

import { useLanguage } from "@/hooks/use-language";

const technologies = [
  { name: "C#", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" },
  { name: ".NET", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
  { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" },
  { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" }
];

export default function TechCarousel() {
  const { t } = useLanguage();
  
  // Dividir array en dos filas
  const half = Math.ceil(technologies.length / 2);
  const row1 = technologies.slice(0, half);
  const row2 = technologies.slice(half);

  // Duplicar elementos lo suficiente para un scroll suave
  const extendedRow1 = [...row1, ...row1, ...row1, ...row1, ...row1, ...row1];
  const extendedRow2 = [...row2, ...row2, ...row2, ...row2, ...row2, ...row2];

  return (
    <section className="py-12 border-y border-white/5 overflow-hidden relative" style={{ backgroundColor: "var(--background)" }}>
      {/* Sombras laterales para efecto fade */}
      <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center relative z-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#10B981]">
          {t.techCarousel?.title || "Tecnologías y Herramientas"}
        </p>
      </div>

      <div className="flex flex-col gap-6 relative z-0">
        {/* Fila 1 - Izquierda a Derecha */}
        <div 
          className="flex w-max"
          style={{ animation: "marquee 40s linear infinite" }}
          onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
          onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
        >
          {extendedRow1.map((tech, index) => (
            <div 
              key={`r1-${index}`} 
              className="flex items-center justify-center gap-3 px-6 py-4 mx-3 glass rounded-2xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-[#3B82F6]/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-1"
            >
              <img 
                src={tech.icon} 
                alt={tech.name} 
                className={`w-10 h-10 object-contain drop-shadow-md ${tech.name === "GitHub" ? "invert opacity-90" : "opacity-90"} group-hover:opacity-100`} 
              />
              <span className="font-semibold text-lg text-foreground whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </div>
        
        {/* Fila 2 - Derecha a Izquierda */}
        <div 
          className="flex w-max ml-[-200px]"
          style={{ animation: "marquee-reverse 35s linear infinite" }}
          onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
          onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
        >
          {extendedRow2.map((tech, index) => (
            <div 
              key={`r2-${index}`} 
              className="flex items-center justify-center gap-3 px-6 py-4 mx-3 glass rounded-2xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-[#10B981]/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-1"
            >
              <img 
                src={tech.icon} 
                alt={tech.name} 
                className={`w-10 h-10 object-contain drop-shadow-md opacity-90 group-hover:opacity-100`} 
              />
              <span className="font-semibold text-lg text-foreground whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
