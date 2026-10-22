"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP, MEDIA } from "@/lib/gsap";
import { useScene } from "./Deck";

/** Vertical gap between plates once the stack has come apart (px). */
const SPREAD = 74;

/** The tools, as one band that loops on its own (decorative; the list is repeated for screen readers). */
function ToolsBand({ tools }: { tools: string[] }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    initGSAP();
    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      gsap.fromTo(el, { xPercent: 0 }, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
    });
    return () => mm.revert();
  }, []);
  return (
    <div className="marquee border-y-[1.5px] border-ink py-3" aria-hidden="true">
      <div ref={track} className="flex flex-none">
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-track">
            {tools.map((tool) => (
              <span key={tool} className="text-xl font-semibold [font-variation-settings:'opsz'_48,'wdth'_85]">
                {tool}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The architecture as a scene with one step per layer. The stack of plates
 * opens on arrival; each step lifts the next layer, from the core outwards,
 * and inks its description. On the way out the stack closes and flies off.
 */
export default function Layers() {
  const { t } = useLanguage();
  const l = t.layers;
  const root = useRef<HTMLElement>(null);
  // Plates are listed bottom-up (the domain is the core at the bottom); the copy reads top-down.
  const plates = [...l.items].reverse();
  const spread = (i: number) => i * (typeof window !== "undefined" && window.innerWidth < 900 ? SPREAD * 0.6 : SPREAD);

  const plateEls = () => Array.from(root.current?.querySelectorAll<HTMLElement>("[data-plate]") ?? []);
  const copyEls = () => Array.from(root.current?.querySelectorAll<HTMLElement>("[data-layer-copy]") ?? []);

  /** Lights layer `k` (0 = core): its plate rises out of the stack and its description inks in. */
  const light = (tl: gsap.core.Timeline, k: number, at: number) => {
    const ps = plateEls();
    const cs = copyEls();
    ps.forEach((plate, i) => tl.to(plate, { z: spread(i) + (i === k ? 46 : 0), duration: 0.6, ease: "back.out(1.6)" }, at));
    cs.forEach((copy, j) => tl.to(copy, { opacity: cs.length - 1 - j <= k ? 1 : 0.28, x: cs.length - 1 - j === k ? 10 : 0, duration: 0.45 }, at));
  };

  // Hovering a layer's description lifts its plate a little more.
  useEffect(() => {
    const ps = plateEls();
    const cs = copyEls();
    const offs = cs.map((copy, j) => {
      const plate = ps[ps.length - 1 - j];
      const on = () => gsap.to(plate, { y: -16, duration: 0.45, ease: "back.out(2)" });
      const off = () => gsap.to(plate, { y: 0, duration: 0.45, ease: "power2.out" });
      copy.addEventListener("pointerenter", on);
      copy.addEventListener("pointerleave", off);
      return () => {
        copy.removeEventListener("pointerenter", on);
        copy.removeEventListener("pointerleave", off);
      };
    });
    return () => offs.forEach((off) => off());
  }, []);

  useScene({
    steps: l.items.length,
    enter(tl, at) {
      const ps = plateEls();
      tl.set(copyEls(), { opacity: 0.28, x: 0 }, 0);
      tl.fromTo(ps, { z: 0, y: -240, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" }, at);
      tl.to(ps, { z: (i) => spread(i), duration: 0.8, stagger: 0.05, ease: "power3.out" }, at + 0.6);
      light(tl, 0, at + 1.1);
    },
    step(tl, to) {
      light(tl, to, 0);
    },
    leave(tl, at, dir) {
      const ps = plateEls();
      tl.to(ps, { z: 0, duration: 0.35, ease: "power2.in" }, at);
      tl.to(ps, { y: -280 * dir, opacity: 0, rotation: () => gsap.utils.random(-12, 12), duration: 0.5, stagger: 0.05, ease: "power2.in" }, at + 0.3);
      tl.to(copyEls(), { clipPath: "inset(0% 0% 100% 0%)", y: -30, duration: 0.4, stagger: 0.05, ease: "power2.in" }, at);
      tl.set(copyEls(), { clearProps: "clipPath" }, at + 1);
    },
  });

  return (
    <section ref={root} className="scene-fill flex flex-col justify-center gap-10 py-[clamp(5rem,9vh,6rem)]" aria-labelledby="layers-title">
      <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 id="layers-title" className="headline max-w-[13ch]" data-lines>
            {l.title}
          </h2>
          <p data-reveal className="body-copy mt-5">
            {l.lede}
          </p>
          <ol className="mt-8 space-y-4">
            {l.items.map((item) => (
              <li key={item.name} data-layer-copy className="grid grid-cols-[9rem_minmax(0,1fr)] gap-4 border-t-[1.5px] border-ink pt-3 max-sm:grid-cols-1">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="layer-scene relative mx-auto aspect-square w-full max-w-[26rem] max-lg:max-w-[18rem]" aria-hidden="true">
          <div className="layer-stack absolute inset-[22%]">
            {plates.map((item, i) => (
              <div key={item.name} data-plate className={`layer-plate ${i === 0 ? "is-core" : ""}`} style={{ zIndex: i, transform: `translateZ(${i * SPREAD}px)` }}>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div data-reveal>
        <h3 className="wrap mb-3 text-sm font-semibold">{l.around}</h3>
        {/* The band below is decorative motion; this is the same list for assistive tech. */}
        <p className="sr-only">{l.tools.join(", ")}</p>
        <ToolsBand tools={l.tools} />
      </div>
    </section>
  );
}
