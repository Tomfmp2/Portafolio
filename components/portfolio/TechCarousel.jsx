"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";

const technologies = [
  { name: "C#",         icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" },
  { name: ".NET",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg" },
  { name: "Python",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "Git",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  { name: "GitHub",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
  { name: "VS Code",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" },
  { name: "Linux",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "Tailwind",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "React",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
  { name: "MySQL",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  { name: "SQL Server", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg" },
  { name: "Docker",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
];

/* ── Individual skill card ───────────────────────────────── */
function TechCard({ tech }) {
  const [hovered, setHovered] = useState(false);
  const isGitHub = tech.name === "GitHub";

  return (
    <div
      className="relative flex items-center gap-3 px-5 py-3 mx-2 rounded-xl border flex-shrink-0 cursor-default select-none"
      style={{
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
        background: hovered ? "rgba(255,75,75,0.06)" : "rgba(255,255,255,0.025)",
        borderColor: hovered ? "rgba(255,75,75,0.3)" : "rgba(255,255,255,0.06)",
        boxShadow: hovered
          ? "0 0 20px rgba(255,75,75,0.18), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "none",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={tech.icon}
        alt={tech.name}
        width={24}
        height={24}
        className="object-contain"
        style={{
          transition: "filter 0.3s ease",
          filter: hovered
            ? isGitHub ? "invert(1) brightness(1.1)" : "grayscale(0) opacity(1)"
            : isGitHub ? "invert(1) opacity(0.35)"  : "grayscale(1) opacity(0.3)",
        }}
      />
      <span
        className="text-sm font-medium whitespace-nowrap"
        style={{
          transition: "color 0.3s ease",
          color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
        }}
      >
        {tech.name}
      </span>
    </div>
  );
}

/* ── Carousel row (auto-scroll) ──────────────────────────── */
function CarouselRow({ items, direction = "left", speed = "55s" }) {
  return (
    <div className="overflow-x-clip overflow-y-visible py-3 group/row">
      <div
        className="flex w-max will-change-transform group-hover/row:[animation-play-state:paused]"
        style={{
          animation: `${direction === "left" ? "marquee" : "marquee-reverse"} ${speed} linear infinite`,
        }}
      >
        {items.map((tech, i) => (
          <TechCard key={i} tech={tech} />
        ))}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function TechCarousel() {
  const { t } = useLanguage();

  // Quadruple the list so the marquee never shows a gap
  const forward  = [...technologies, ...technologies, ...technologies, ...technologies];
  const backward = [...technologies].reverse().concat(
    [...technologies].reverse(),
    [...technologies].reverse(),
    [...technologies].reverse()
  );

  return (
    <section
      className="py-20 overflow-hidden bg-[#0B0B0F] relative"
      aria-label="Tecnologías"
    >
      {/* Header */}
      <div className="page-container text-center mb-12">
        <div className="section-label mb-2">
          <span className="label-dot" />
          <span className="text-[11px] font-bold text-white/30 tracking-[0.3em] uppercase">
            {t.techCarousel?.title || "Tecnologías & Herramientas"}
          </span>
        </div>
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-10"
           style={{ background: "linear-gradient(to right, #0B0B0F, transparent)" }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-10"
           style={{ background: "linear-gradient(to left, #0B0B0F, transparent)" }} />

      {/* Row 1 — auto-scrolls left */}
      <div className="mb-4">
        <CarouselRow items={forward} direction="left" speed="55s" />
      </div>

      {/* Row 2 — auto-scrolls right */}
      <CarouselRow items={backward} direction="right" speed="45s" />

      {/* Subtle ambient red glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[160px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(ellipse, #FF3333, transparent 70%)" }}
      />
    </section>
  );
}
