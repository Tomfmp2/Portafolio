"use client";

import { useEffect, useRef } from "react";
import { gsap, initGSAP, MEDIA } from "@/lib/gsap";

const INTERACTIVE = "a, button, [role='button'], input, textarea, label, [data-cursor]";

/**
 * A highlighter tip that trails the real pointer (which stays visible) and
 * swells over things you can press. Mouse only, never with reduced motion.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dot.current;
    if (!el) return;
    initGSAP();
    const mm = gsap.matchMedia();
    mm.add(`${MEDIA.finePointer} and ${MEDIA.motion}`, () => {
      const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
      let over = false;
      const onMove = (e: PointerEvent) => {
        el.classList.add("is-visible");
        x(e.clientX);
        y(e.clientY);
        const hit = (e.target as Element | null)?.closest?.(INTERACTIVE) != null;
        if (hit !== over) {
          over = hit;
          gsap.to(el, { scale: hit ? 1 : 0.18, duration: 0.4, ease: "back.out(2)" });
        }
      };
      const onLeave = () => el.classList.remove("is-visible");
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      return () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        el.classList.remove("is-visible");
      };
    });
    return () => mm.revert();
  }, []);

  return <div ref={dot} className="cursor-dot" aria-hidden="true" />;
}
