"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP } from "@/lib/gsap";
import { INTRO_KEY, introFinished } from "@/lib/intro";
import Wordmark from "./Wordmark";

/** Ink curtain with a counter and the wordmark, then it lifts off the page. */
export default function Preloader() {
  const { t } = useLanguage();
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || document.documentElement.classList.contains("intro-seen")) {
      introFinished();
      return;
    }
    initGSAP();
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // Private mode: the intro will simply play again next time.
    }

    const counter = { n: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        el.style.display = "none";
        document.documentElement.classList.add("intro-seen");
      },
    });
    tl.from(el.querySelector(".wordmark"), { yPercent: 110, duration: 0.9 })
      .from(el.querySelector(".wordmark .accent"), { "--accent-scale": 0, duration: 0.4 }, "-=0.2")
      .to(counter, {
        n: 100,
        duration: 1.3,
        ease: "power2.inOut",
        onUpdate: () => {
          if (count.current) count.current.textContent = String(Math.round(counter.n));
        },
      }, 0)
      .add(introFinished, "+=0.05")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "<");
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={root} className="preloader" style={{ clipPath: "inset(0 0 0% 0)" }} aria-hidden="true">
      <div className="flex w-full items-end justify-between gap-6">
        <div className="overflow-hidden pb-[0.1em]">
          <Wordmark className="text-[clamp(3rem,11vw,9rem)]" />
        </div>
        <p className="text-right">
          <span className="block text-sm text-paper/60">{t.meta.loading}</span>
          <span ref={count} className="stat-value tabular-nums">0</span>
        </p>
      </div>
    </div>
  );
}
