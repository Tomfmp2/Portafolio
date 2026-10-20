"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP, MEDIA } from "@/lib/gsap";
import Wordmark from "./Wordmark";

/** Closing band: one long stroke of the highlighter across the page, saying the one thing that matters. */
export default function Footer() {
  const { t } = useLanguage();
  const band = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const el = band.current;
    if (!el) return;
    initGSAP();
    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      gsap.fromTo(el.querySelector("[data-track]"), { xPercent: 0 }, { xPercent: -50, duration: 24, ease: "none", repeat: -1 });
    });
    return () => mm.revert();
  }, []);

  const phrase = t.footer.band;
  return (
    <footer>
      <p className="sr-only">{phrase}</p>
      <div ref={band} className="band marquee py-5" aria-hidden="true">
        <div data-track className="flex flex-none">
          {[0, 1].map((copy) => (
            <div key={copy} className="marquee-track">
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i} className="headline flex items-center gap-12 !text-[clamp(2rem,5vw,4rem)]">
                  {phrase}
                  <span className="text-[0.6em]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="wrap flex flex-wrap items-center justify-between gap-6 py-10">
        <Wordmark className="text-3xl" />
        <p className="small">
          © {year}. {t.footer.made}
        </p>
        <a href="#inicio" className="link font-medium">
          {t.footer.top}
        </a>
      </div>
    </footer>
  );
}
