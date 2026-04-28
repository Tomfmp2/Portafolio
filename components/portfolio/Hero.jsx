"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";

export default function Hero() {
  const { t } = useLanguage();
  const h = t.hero;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const anim = (delay = 0) =>
    [
      "transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      delay ? `delay-[${delay}ms]` : "",
    ].join(" ");

  return (
    <section
      id="inicio"
      className="relative min-h-screen bg-[#0B0B0F] flex items-center justify-center overflow-hidden"
    >
      {/* ── Background image ────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg-blackhole.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center select-none opacity-60"
          quality={100}
        />
        {/* Radial dark vignette to keep center readable */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(11,11,15,0.4) 0%, rgba(11,11,15,0.85) 70%)" }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0B0B0F] to-transparent" />
      </div>

      {/* ── Content (centered) ──────────────────── */}
      <div className="relative z-10 w-full page-container text-center pt-28 pb-24">
        <div className="max-w-3xl mx-auto">

          {/* Eyebrow */}
          <div className={`flex items-center justify-center gap-3 mb-6 ${anim(0)}`}>
            <div className="w-2 h-2 rounded-full bg-[#FF4B4B]" />
            <span className="text-[11px] font-medium text-white/50 tracking-[0.28em] uppercase">
              {h.role}
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`font-bold text-white tracking-tight leading-[1.02] mb-6 ${anim(180)}`}
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            Tomas Medina<span className="text-[#FF4B4B]">.</span>
          </h1>

          {/* Description */}
          <p className={`text-base sm:text-lg text-white/40 font-light leading-relaxed max-w-lg mx-auto mb-12 ${anim(360)}`}>
            {h.description}
          </p>

          {/* CTAs */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-5 ${anim(520)}`}>
            <a
              href="#proyectos"
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#FF4B4B] text-white font-bold text-sm transition-all duration-300 hover:scale-105"
              style={{ boxShadow: "0 0 30px rgba(255,75,75,0.3)" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              VER PROYECTOS
            </a>
            <a
              href="https://1drv.ms/b/c/a7e9bce9bc70cf88/IQAxwv0ZZ8y_RKQ2ASrz1DHxAV-GfVnS-_qo-Iwd_Z37hLQ?e=7QjXyh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full border border-white/15 text-white/60 font-medium text-sm hover:border-white/40 hover:text-white transition-all duration-300"
            >
              {h.downloadCV}
            </a>
          </div>
        </div>
      </div>

      {/* ── Social links (bottom left) ────────── */}
      <div className="hidden lg:flex absolute bottom-10 left-10 z-20 items-center gap-6">
        <a href="https://github.com/Tomfmp2" target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/25 tracking-[0.2em] uppercase hover:text-white transition-colors">Github</a>
        <div className="w-8 h-px bg-white/15" />
        <a href="https://www.linkedin.com/in/tomasmedinadev/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/25 tracking-[0.2em] uppercase hover:text-[#FF4B4B] transition-colors">LinkedIn</a>
      </div>

    </section>
  );
}
