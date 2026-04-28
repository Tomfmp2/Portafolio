"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/use-language";

/* ── Animated number ────────────────────────────────────── */
function AnimNum({ target, suffix = "", delay = 0 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          setTimeout(() => {
            const steps = 40;
            const inc = target / steps;
            let cur = 0;
            const t = setInterval(() => {
              cur = Math.min(cur + inc, target);
              setVal(Math.floor(cur));
              if (cur >= target) clearInterval(t);
            }, 30);
          }, delay);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, delay]);

  return <span ref={ref} className="tabular-nums">{val}{suffix}</span>;
}

/* ── Circular ring (SVG) ────────────────────────────────── */
function CircleRing({ percent, size = 100, stroke = 6, label, sublabel }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);

  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          setTimeout(() => setOffset(circ - (percent / 100) * circ), 200);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [percent, circ]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="url(#redGrad)" strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }}
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

/* ── Vertical bar ───────────────────────────────────────── */
function SkillBar({ name, level, maxH = 120 }) {
  const [h, setH] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          setTimeout(() => setH((level / 100) * maxH), 150);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [level, maxH]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 group">
      <span className="text-xs font-bold text-[#FF3333] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{level}%</span>
      <div className="relative w-7 rounded-full overflow-hidden bg-white/[0.04]" style={{ height: maxH }}>
        <div
          className="absolute bottom-0 w-full rounded-full"
          style={{
            height: h,
            transition: "height 1.2s cubic-bezier(0.22,1,0.36,1)",
            background: "linear-gradient(to top, #FF3333, #ff6060)",
          }}
        />
      </div>
      <span className="text-[10px] font-medium text-white/50 text-center leading-tight whitespace-nowrap">{name}</span>
    </div>
  );
}

/* ── Horizontal mini bar ────────────────────────────────── */
function MiniBar({ name, level }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          setTimeout(() => setW(level), 200);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [level]);

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-white/70">{name}</span>
        <span className="text-xs font-bold text-white/90 font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${w}%`, transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)", background: "linear-gradient(to right, #FF3333, #ff6060)" }} />
      </div>
    </div>
  );
}

/* ── Main Skills Section ────────────────────────────────── */
export default function Skills() {
  const { t } = useLanguage();
  const s = t.skills;

  const softSkills = s.softSkills || [];
  const learningBadges = s.learning || [];

  return (
    <section id="habilidades" className="section bg-[#0B0B0F]">
      <div className="page-container">
        
        {/* Header */}
        <div className="text-center mb-14">
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
          <div className="lg:col-span-5 glass card-hover p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-mono text-[#FF3333]/70 tracking-widest uppercase mb-1">{s.categories?.[0]?.title}</p>
                <h3 className="text-lg font-bold text-white/90">Core Languages</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#FF3333]" />
                <span className="text-[10px] text-white/40 font-mono">PROFICIENCY</span>
              </div>
            </div>
            <div className="flex items-end justify-around gap-3 pt-4">
              <SkillBar name="C#" level={95} maxH={130} />
              <SkillBar name="Python" level={90} maxH={130} />
              <SkillBar name="JS" level={85} maxH={130} />
              <SkillBar name="SQL" level={90} maxH={130} />
              <SkillBar name="TS" level={75} maxH={130} />
            </div>
          </div>

          {/* Card 2: Frameworks */}
          <div className="lg:col-span-4 glass card-hover p-6">
            <p className="text-[10px] font-mono text-[#FF3333]/70 tracking-widest uppercase mb-1">{s.categories?.[1]?.title}</p>
            <h3 className="text-lg font-bold text-white/90 mb-6">Stack</h3>
            <div className="flex justify-around gap-2">
              <CircleRing percent={90} size={90} stroke={5} label=".NET" sublabel="Primary" />
              <CircleRing percent={85} size={90} stroke={5} label="ASP.NET" sublabel="Web APIs" />
              <CircleRing percent={80} size={90} stroke={5} label="Vite" sublabel="Frontend" />
            </div>
          </div>

          {/* Card 3: Big stat */}
          <div className="lg:col-span-3 glass card-hover p-6 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-1">OVERVIEW</p>
              <p className="text-5xl font-black text-white/90 leading-none mt-2">
                <AnimNum target={14} suffix="" />
              </p>
              <p className="text-sm text-white/40 mt-1">Technologies</p>
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
                <span className="text-white font-bold">3</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Database</span>
                <span className="text-white font-bold">2</span>
              </div>
            </div>
          </div>

          {/* Card 4: Databases */}
          <div className="lg:col-span-4 glass card-hover p-6">
            <p className="text-[10px] font-mono text-[#FF3333]/70 tracking-widest uppercase mb-1">{s.categories?.[2]?.title}</p>
            <h3 className="text-lg font-bold text-white/90 mb-5">Database Systems</h3>
            <div className="space-y-4">
              <MiniBar name="MySQL" level={90} />
              <MiniBar name="SQL Server" level={90} />
              <MiniBar name="PostgreSQL" level={60} />
            </div>
          </div>

          {/* Card 5: DevOps */}
          <div className="lg:col-span-4 glass card-hover p-6">
            <p className="text-[10px] font-mono text-[#FF3333]/70 tracking-widest uppercase mb-1">{s.categories?.[3]?.title}</p>
            <h3 className="text-lg font-bold text-white/90 mb-5">DevOps & Tools</h3>
            <div className="space-y-4">
              <MiniBar name="Git / GitHub" level={95} />
              <MiniBar name="Docker" level={85} />
              <MiniBar name="n8n Automation" level={80} />
              <MiniBar name="Telegram Bots" level={80} />
            </div>
          </div>

          {/* Card 6: Soft Skills */}
          <div className="lg:col-span-4 glass card-hover p-6">
            <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase mb-1">SOFT SKILLS</p>
            <h3 className="text-lg font-bold text-white/90 mb-5">{s.categories?.[4]?.title}</h3>
            <div className="space-y-3">
              {softSkills.map((skill, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF3333]" />
                  <span className="text-sm text-white/60">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Currently Learning */}
        <div className="mt-8 glass card-hover p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <p className="text-[10px] font-mono text-[#FF3333]/70 tracking-widest uppercase mb-1">IN PROGRESS</p>
              <h3 className="text-lg font-bold text-white/90">{s.learningTitle}</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF3333] animate-pulse" />
              <span className="text-[10px] font-mono text-white/40">ACTIVE</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {learningBadges.map((badge, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl text-xs font-medium text-white/70 bg-white/[0.04] hover:bg-[#FF3333] hover:text-white transition-all duration-300">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
