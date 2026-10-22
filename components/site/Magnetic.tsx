"use client";

import { useEffect } from "react";
import { gsap, initGSAP, MEDIA } from "@/lib/gsap";

/**
 * Magnetic buttons: with a mouse, every .btn leans a little toward the
 * pointer and springs back when it leaves. Buttons that handle this
 * themselves opt out with [data-own-magnet].
 */
export default function Magnetic() {
  useEffect(() => {
    initGSAP();
    const mm = gsap.matchMedia();
    mm.add(`${MEDIA.motion} and ${MEDIA.finePointer}`, () => {
      const buttons = gsap.utils.toArray<HTMLElement>(".btn:not([data-own-magnet])");
      const offs = buttons.map((btn) => {
        const x = gsap.quickTo(btn, "x", { duration: 0.5, ease: "elastic.out(1, 0.45)" });
        const y = gsap.quickTo(btn, "y", { duration: 0.5, ease: "elastic.out(1, 0.45)" });
        const move = (e: PointerEvent) => {
          const r = btn.getBoundingClientRect();
          x((e.clientX - (r.left + r.width / 2)) * 0.25);
          y((e.clientY - (r.top + r.height / 2)) * 0.35);
        };
        const leave = () => {
          x(0);
          y(0);
        };
        btn.addEventListener("pointermove", move);
        btn.addEventListener("pointerleave", leave);
        return () => {
          btn.removeEventListener("pointermove", move);
          btn.removeEventListener("pointerleave", leave);
        };
      });
      return () => offs.forEach((off) => off());
    });
    return () => mm.revert();
  }, []);

  return null;
}
