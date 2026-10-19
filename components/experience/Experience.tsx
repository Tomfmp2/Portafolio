"use client";

import { useEffect, useState } from "react";
import { invalidate } from "@react-three/fiber";
import LazyCanvas from "@/components/3d/LazyCanvas";
import ExperienceScene from "./ExperienceScene";
import { usePerformanceTier } from "@/hooks/use-performance-tier";
import { useLanguage } from "@/hooks/use-language";
import { initGSAP, ScrollTrigger } from "@/lib/gsap";
import { CHAPTERS, HOLD, scrollState } from "@/lib/experience/chapters";
import type { ShapeFonts } from "@/lib/experience/shapes";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Resolves the families next/font generated, so the particle text matches the page. */
async function resolveFonts(): Promise<ShapeFonts> {
  await document.fonts.ready;
  const styles = getComputedStyle(document.documentElement);
  return {
    display: styles.getPropertyValue("--font-archivo").trim() || "sans-serif",
    mono: styles.getPropertyValue("--font-jetbrains").trim() || "monospace",
  };
}

/**
 * Maps the scroll position to `scrollState.chapter`. Each section holds its shape
 * for the first part of its scroll, then morphs toward the next one, so text and
 * shape always arrive together.
 */
function useChapterTracking() {
  useEffect(() => {
    initGSAP();
    const sections = CHAPTERS.map((_, i) => document.querySelector<HTMLElement>(`[data-chapter="${i}"]`));
    const triggers = sections.flatMap((section, i) => {
      if (!section) return [];
      return [
        ScrollTrigger.create({
          trigger: section,
          start: i === 0 ? "top top" : "top center",
          end: i === CHAPTERS.length - 1 ? "bottom bottom" : "bottom center",
          // Jumps (anchor links) update every trigger they cross; only the active one
          // may write, and the edges pin the value so nothing stale wins.
          onUpdate: (self) => {
            if (!self.isActive) return;
            const morph = Math.max(0, (self.progress - HOLD) / (1 - HOLD));
            scrollState.chapter = Math.min(i + morph, CHAPTERS.length - 1);
            invalidate();
          },
          onLeave: () => {
            scrollState.chapter = Math.min(i + 1, CHAPTERS.length - 1);
            invalidate();
          },
          onLeaveBack: () => {
            scrollState.chapter = Math.max(i, 0);
            invalidate();
          },
        }),
      ];
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);
}

export default function Experience() {
  const perf = usePerformanceTier();
  const { t } = useLanguage();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [fonts, setFonts] = useState<ShapeFonts | null>(null);

  useChapterTracking();

  useEffect(() => {
    setWebgl(supportsWebGL());
    let cancelled = false;
    resolveFonts().then((f) => !cancelled && setFonts(f));
    return () => {
      cancelled = true;
    };
  }, []);

  const count = perf.isMobile ? 14000 : perf.isLowPower ? 22000 : 36000;

  return (
    <div className="experience-layer" aria-hidden="true">
      {webgl === false && <div className="experience-fallback" />}
      {webgl && fonts && (
        <LazyCanvas
          className="h-full w-full"
          camera={{ position: [0, 0.5, 6], fov: 40, near: 0.1, far: 80 }}
          frameloop={perf.reducedMotion ? "demand" : "always"}
          gl={{ antialias: false }}
        >
          <ExperienceScene
            count={count}
            isMobile={perf.isMobile}
            reducedMotion={perf.reducedMotion}
            fonts={fonts}
            floppies={t.projects.more.items}
          />
        </LazyCanvas>
      )}
    </div>
  );
}
