"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useGSAP } from "@/hooks/use-gsap";
import { gsap } from "@/lib/gsap";
import { MotionCard } from "@/components/ui/motion";

/* ── Animated number with GSAP ────────────────────────────── */
function AnimNum({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const numRef = useRef(null);

  useGSAP(() => {
    if (!numRef.current) return;
    const obj = { count: 0 };
    gsap.to(obj, {
      count: target,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: numRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      onUpdate: () => {
        setVal(Math.floor(obj.count));
      },
    });
  }, { scope: numRef });

  return <span ref={numRef} className="tabular-nums">{val}{suffix}</span>;
}

/* ── Circular ring (SVG) with GSAP ────────────────────────── */
function CircleRing({ percent, size = 90, stroke = 5, label, sublabel }) {
  const r = (size - stroke) / 2;
  const circleRef = useRef(null);

  useGSAP(() => {
    if (!circleRef.current) return;
    gsap.fromTo(
      circleRef.current,
      { strokeDashoffset: 100 },
      {
        strokeDashoffset: 100 - percent,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: circleRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: circleRef });

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
          <circle
            ref={circleRef}
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="url(#redGrad)" strokeWidth={stroke}
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset="100"
          />
          <defs>
            <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF3333" />
              <stop offset="100%" stopColor="#ff6060" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{percent}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-white/80">{label}</p>
        {sublabel && <p className="text-[10px] text-white/40 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}

/* ── Vertical bar with GSAP ───────────────────────────────── */
function SkillBar({ name, level, maxH = 130 }) {
  const barRef = useRef(null);
  const targetH = (level / 100) * maxH;

  useGSAP(() => {
    if (!barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { height: 0 },
      {
        height: targetH,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: barRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: barRef });

  return (
    <div className="flex flex-col items-center gap-2 group">
      <span className="text-xs font-bold text-[#FF3333] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{level}%</span>
      <div className="relative w-7 rounded-full overflow-hidden bg-white/[0.04]" style={{ height: maxH }}>
        <div
          ref={barRef}
          className="absolute bottom-0 w-full rounded-full"
          style={{
            background: "linear-gradient(to top, #FF3333, #ff6060)",
          }}
        />
      </div>
      <span className="text-[10px] font-medium text-white/50 text-center leading-tight whitespace-nowrap">{name}</span>
    </div>
  );
}

/* ── Horizontal mini bar with GSAP ────────────────────────── */
function MiniBar({ name, level }) {
  const barRef = useRef(null);

  useGSAP(() => {
    if (!barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { width: "0%" },
      {
        width: `${level}%`,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: barRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: barRef });

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-white/70">{name}</span>
        <span className="text-xs font-bold text-white/90 font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(to right, #FF3333, #ff6060)" }}
        />
      </div>
    </div>
  );
}

/* ── Main Skills Section ────────────────────────────────── */
export default function Skills() {
  const { lang, t } = useLanguage();
  const s = t.skills;
  const sectionRef = useRef(null);

  const softSkills = s.softSkills || [];
  const learningBadges = s.learning || [];

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll(".gsap-skills-card");
    const header = sectionRef.current?.querySelector(".gsap-skills-header");

    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section id="habilidades" ref={sectionRef} className="section">
      <div className="page-container">

        {/* Header */}
        <div className="text-center mb-14 gsap-skills-header opacity-0">
          <div className="section-label mb-4">
            <span className="label-dot" />
            <span className="text-[11px] font-bold text-white/30 tracking-[0.3em] uppercase">{s.tag}</span>
          </div>
          <h2 className="font-bold text-white tracking-tight mb-3" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1.1 }}>{s.title}</h2>
          <p className="text-white/40 text-base max-w-lg mx-auto leading-relaxed font-light">{s.subtitle}</p>
        </div>

        {/* ── Dashboard grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">

          {/* Card 1: Languages */}
          <div className="lg:col-span-5 gsap-skills-card opacity-0">
            <MotionCard className="glass card-hover p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-mono text-[#FF3333]/70 tracking-widest uppercase mb-1">{s.categories?.[0]?.title}</p>
                  <h3 className="text-lg font-bold text-white/90">{lang === 'es' ? 'Lenguajes Principales' : 'Core Languages'}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF3333]" />
                  <span className="text-[10px] text-white/40 font-mono">{lang === 'es' ? 'NIVEL' : 'PROFICIENCY'}</span>
                </div>
              </div>
              <div className="flex items-end justify-around gap-3 pt-4">
                <SkillBar name="C#" level={95} maxH={130} />
                <SkillBar name="Python" level={90} maxH={130} />
                <SkillBar name="JS" level={85} maxH={130} />
                <SkillBar name="SQL" level={90} maxH={130} />
                <SkillBar name="TS" level={75} maxH={130} />
              </div>
            </MotionCard>
          </div>

          {/* Card 2: Frameworks */}
          <div className="lg:col-span-4 gsap-skills-card opacity-0">
            <MotionCard className="glass card-hover p-6 h-full">
              <p className="text-[10px] font-mono text-[#FF3333]/70 tracking-widest uppercase mb-1">{s.categories?.[1]?.title}</p>
              <h3 className="text-lg font-bold text-white/90 mb-6">{lang === 'es' ? 'Tecnologías' : 'Stack'}</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <CircleRing percent={95} size={90} stroke={5} label=".NET" sublabel={lang === 'es' ? 'Principal' : 'Primary'} />
                <CircleRing percent={85} size={90} stroke={5} label="ASP.NET" sublabel={lang === 'es' ? 'APIs Web' : 'Web APIs'} />
                <CircleRing percent={90} size={90} stroke={5} label="Entity Framework" sublabel="ORM" />
                <CircleRing percent={90} size={90} stroke={5} label="Next.js" sublabel={lang === 'es' ? 'Framework React' : 'React Framework'} />
                <CircleRing percent={85} size={90} stroke={5} label="Vite" sublabel="Frontend" />
              </div>
            </MotionCard>
          </div>

          {/* Card 3: Big stat */}
          <div className="lg:col-span-3 gsap-skills-card opacity-0">
            <MotionCard className="glass card-hover p-6 flex flex-col justify-between h-full">
              <div>
                <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-1">{lang === 'es' ? 'RESUMEN' : 'OVERVIEW'}</p>
                <p className="text-5xl font-black text-white/90 leading-none mt-2">
                  <AnimNum target={16} suffix="" />
                </p>
                <p className="text-sm text-white/40 mt-1">{lang === 'es' ? 'Tecnologías' : 'Technologies'}</p>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Backend</span>
                  <span className="text-white font-bold">5</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">DevOps</span>
                  <span className="text-white font-bold">4</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Frontend</span>
                  <span className="text-white font-bold">4</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">{lang === 'es' ? 'Base de Datos' : 'Database'}</span>
                  <span className="text-white font-bold">3</span>
                </div>
              </div>
            </MotionCard>
          </div>

          {/* Card 4: Databases */}
          <div className="lg:col-span-4 gsap-skills-card opacity-0">
            <MotionCard className="glass card-hover p-6 h-full">
              <p className="text-[10px] font-mono text-[#FF3333]/70 tracking-widest uppercase mb-1">{s.categories?.[2]?.title}</p>
              <h3 className="text-lg font-bold text-white/90 mb-5">{lang === 'es' ? 'Sistemas de BD' : 'Database Systems'}</h3>
              <div className="space-y-4">
                <MiniBar name="MySQL" level={90} />
                <MiniBar name="SQL Server" level={90} />
                <MiniBar name="PostgreSQL" level={60} />
              </div>
            </MotionCard>
          </div>

          {/* Card 5: DevOps */}
          <div className="lg:col-span-4 gsap-skills-card opacity-0">
            <MotionCard className="glass card-hover p-6 h-full">
              <p className="text-[10px] font-mono text-[#FF3333]/70 tracking-widest uppercase mb-1">{s.categories?.[3]?.title}</p>
              <h3 className="text-lg font-bold text-white/90 mb-5">{lang === 'es' ? 'DevOps & Herramientas' : 'DevOps & Tools'}</h3>
              <div className="space-y-4">
                <MiniBar name="Git / GitHub" level={95} />
                <MiniBar name="Docker" level={85} />
                <MiniBar name="n8n Automation" level={80} />
                <MiniBar name="Telegram Bots" level={80} />
              </div>
            </MotionCard>
          </div>

          {/* Card 6: Soft Skills */}
          <div className="lg:col-span-4 gsap-skills-card opacity-0">
            <MotionCard className="glass card-hover p-6 h-full">
              <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-1">{lang === 'es' ? 'HABILIDADES BLANDAS' : 'SOFT SKILLS'}</p>
              <h3 className="text-lg font-bold text-white/90 mb-5">{s.categories?.[4]?.title}</h3>
              <div className="space-y-3">
                {softSkills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF3333]" />
                    <span className="text-sm text-white/60">{skill}</span>
                  </div>
                ))}
              </div>
            </MotionCard>
          </div>
        </div>

        {/* Currently Learning */}
        <div className="mt-8 gsap-skills-card opacity-0">
          <MotionCard className="glass card-hover p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] font-mono text-[#FF3333]/70 tracking-widest uppercase mb-1">{lang === 'es' ? 'EN PROGRESO' : 'IN PROGRESS'}</p>
                <h3 className="text-lg font-bold text-white/90">{s.learningTitle}</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF3333] animate-pulse" />
                <span className="text-[10px] font-mono text-white/40">{lang === 'es' ? 'ACTIVO' : 'ACTIVE'}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {learningBadges.map((badge, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white/70 bg-white/[0.04] hover:bg-[#FF3333] hover:text-white transition-all duration-300">
                  {badge}
                </span>
              ))}
            </div>
          </MotionCard>
        </div>
      </div>
    </section>
  );
}
