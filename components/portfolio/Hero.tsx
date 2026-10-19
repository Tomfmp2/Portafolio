"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";
import { useGSAP } from "@/hooks/use-gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { usePerformanceTier } from "@/hooks/use-performance-tier";
import LazyCanvas from "@/components/3d/LazyCanvas";
import CommodoreScene from "@/components/3d/CommodoreScene";

export default function Hero() {
  const { t } = useLanguage();
  const h = t.hero;
  const perfConfig = usePerformanceTier();

  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);

  // GSAP + ScrollTrigger integration matching reference composition parallax
  useGSAP(
    () => {
      if (!heroRef.current) return;

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;

          // Parallax for giant background watermark text
          if (watermarkRef.current) {
            const xShift = self.progress * -150;
            watermarkRef.current.style.transform = `translate3d(${xShift}px, 0, 0)`;
          }

          // Parallax shift & fade out of foreground DOM content
          if (contentRef.current) {
            const opacity = Math.max(0, 1 - self.progress * 1.6);
            const yShift = self.progress * -100;
            contentRef.current.style.opacity = opacity.toString();
            contentRef.current.style.transform = `translate3d(0, ${yShift}px, 0)`;
          }
        },
      });
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="relative min-h-screen lg:min-h-[120vh] w-full bg-transparent flex flex-col items-center justify-between overflow-hidden"
    >
      {/* ── Background Giant Watermark Typography Layer ── */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <div
          ref={watermarkRef}
          className="whitespace-nowrap font-black tracking-tighter text-[13vw] uppercase text-white/[0.04] leading-none transition-transform duration-75"
          style={{ willChange: "transform" }}
        >
          BACKEND ARCHITECTURE
        </div>
      </div>

      {/* ── 3D R3F Interactive Commodore 64 Scene Layer ── */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <LazyCanvas
          className="w-full h-full"
          camera={{ position: [0, 0.6, 6.2], fov: 40 }}
        >
          <CommodoreScene
            scrollProgressRef={scrollProgressRef}
            isMobile={perfConfig.isMobile}
            enablePostprocessing={perfConfig.enablePostprocessing}
          />
        </LazyCanvas>
      </div>

      {/* ── Radial Dark Vignette ── */}
      <div
        className="absolute inset-0 z-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(9,9,11,0.25) 0%, rgba(9,9,11,0.85) 75%)",
        }}
      />
      {/* Bottom section gradient blend */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09090B] to-transparent z-15 pointer-events-none" />

      {/* ── Hero Foreground DOM Content Layer (Centered reference layout) ── */}
      <div
        ref={contentRef}
        className="relative z-20 w-full page-container pt-24 pb-12 text-center pointer-events-none flex flex-col items-center"
        style={{ willChange: "transform, opacity" }}
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-4 pointer-events-auto"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3333] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3333]" />
            </span>
            <span className="text-[11px] font-semibold text-white/70 tracking-[0.25em] uppercase">
              {h.role}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2 }}
            className="font-black tracking-tight leading-none mb-4 text-center"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 5.0rem)" }}
          >
            <span className="text-white">Tomas </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #ffffff 0%, #c5c5c5 45%, #ffffff 70%, #909090 100%)",
              }}
            >
              Medina
            </span>
            <span
              className="text-[#FF3333]"
              style={{ textShadow: "0 0 25px rgba(255,51,51,0.85)" }}
            >
              .
            </span>
          </motion.h1>

          {/* Subtitle / Description */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35 }}
            className="text-xs sm:text-sm text-white/60 font-light leading-relaxed max-w-md mx-auto mb-6"
          >
            {h.description}
          </motion.p>

          {/* Tech Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-6 pointer-events-auto"
          >
            {[".NET 8", "C#", "SQL Server", "Docker", "n8n"].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-[11px] font-mono rounded-md bg-white/[0.04] border border-white/10 text-white/75 backdrop-blur-sm hover:border-[#FF3333]/50 hover:text-white transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto"
          >
            <motion.a
              href="#proyectos"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#FF3333] text-white font-bold text-sm tracking-wide transition-all duration-300 red-glow"
              style={{
                boxShadow:
                  "0 0 25px rgba(255,51,51,0.4), 0 0 50px rgba(255,51,51,0.15)",
              }}
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              VER PROYECTOS
            </motion.a>

            <motion.a
              href="/CV/Tomas_Medina_CV.pdf"
              download="Tomas_Medina_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/20 bg-white/[0.03] text-white/80 font-medium text-sm hover:border-white/50 hover:text-white hover:bg-white/[0.08] backdrop-blur-md transition-all duration-300"
            >
              {h.downloadCV}
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* ── Social Links (Bottom Left) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="hidden lg:flex absolute bottom-8 left-10 z-25 items-center gap-6 pointer-events-auto"
      >
        <a
          href="https://github.com/Tomfmp2"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-mono text-white/40 tracking-[0.2em] uppercase hover:text-white transition-colors"
        >
          Github
        </a>
        <div className="w-8 h-px bg-white/20" />
        <a
          href="https://www.linkedin.com/in/tomasmedinadev/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-mono text-white/40 tracking-[0.2em] uppercase hover:text-[#FF3333] transition-colors"
        >
          LinkedIn
        </a>
      </motion.div>

      {/* ── Scroll Down Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="hidden sm:flex absolute bottom-8 right-10 z-25 items-center gap-3 text-white/30 text-[10px] font-mono tracking-widest uppercase pointer-events-none"
      >
        <span>SCROLL DOWN</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-4 h-7 rounded-full border border-white/20 flex items-start justify-center p-1"
        >
          <div className="w-1 h-1.5 rounded-full bg-[#FF3333]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
