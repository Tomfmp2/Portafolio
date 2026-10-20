"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { gsap, initGSAP, MEDIA, ScrollTrigger } from "@/lib/gsap";
import { scene, settle } from "@/lib/scene";

/** Vertical gap between plates once the stack has come apart (px). */
const SPREAD = 78;

function ToolsMarquee({ tools }: { tools: string[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    initGSAP();
    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      const rows = el.querySelectorAll<HTMLElement>("[data-row]");
      const loops = [...rows].map((row, i) => {
        const track = row.querySelector("[data-track]");
        // Each row is two copies of the list, so moving by -50% loops seamlessly.
        return gsap.fromTo(track, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 38, ease: "none", repeat: -1 });
      });
      // Scrolling speeds the bands up in proportion to how fast you scroll, then they settle.
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 6);
          loops.forEach((loop) => gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true, onComplete: () => void gsap.to(loop, { timeScale: 1, duration: 1.2 }) }));
        },
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);

  const half = Math.ceil(tools.length / 2);
  const rows = [tools.slice(0, half), tools.slice(half)];
  return (
    <div ref={root} data-reveal className="mt-[clamp(4rem,8vw,7rem)] space-y-3 border-y-[1.5px] border-ink py-6" aria-hidden="true">
      {rows.map((row, i) => (
        <div key={i} data-row className="marquee">
          <div data-track className="flex flex-none">
            {[0, 1].map((copy) => (
              <div key={copy} className="marquee-track">
                {row.map((tool) => (
                  <span key={tool} className="title !font-semibold">
                    {tool}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Layers() {
  const { t } = useLanguage();
  const l = t.layers;
  const root = useRef<HTMLElement>(null);
  // Plates are listed bottom-up (the domain is the core at the bottom); the copy reads top-down.
  const plates = [...l.items].reverse();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    initGSAP();
    const mm = gsap.matchMedia();
    mm.add({ motion: MEDIA.motion, desktop: MEDIA.desktop }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      const plateEls = gsap.utils.toArray<HTMLElement>("[data-plate]", el);
      const copyEls = gsap.utils.toArray<HTMLElement>("[data-layer-copy]", el);
      const spread = (i: number) => i * (desktop ? SPREAD : SPREAD * 0.6);

      // Hovering a layer's description lifts its plate (copy reads top-down, plates bottom-up).
      const hoverOffs = motion
        ? copyEls.map((copy, k) => {
            const plate = plateEls[plateEls.length - 1 - k];
            const lift = (up: boolean) => gsap.to(plate, { y: up ? -18 : 0, duration: 0.5, ease: "back.out(2)" });
            const on = () => lift(true);
            const off = () => lift(false);
            copy.addEventListener("pointerenter", on);
            copy.addEventListener("pointerleave", off);
            return () => {
              copy.removeEventListener("pointerenter", on);
              copy.removeEventListener("pointerleave", off);
            };
          })
        : [];
      const cleanup = () => hoverOffs.forEach((off) => off());

      if (!motion || !desktop) {
        plateEls.forEach((p, i) => gsap.set(p, { z: spread(i) }));
        return cleanup;
      }

      gsap.set(plateEls, { z: 0 });
      gsap.set(copyEls, { opacity: 0.3 });
      const stage = el.querySelector("[data-stage]");
      if (!stage) return;
      const tl = scene(stage, 440, {}, "power2.inOut");
      tl.to(plateEls, { z: (i) => spread(i), duration: 1, stagger: 0.05 });
      // Walk the layers from the core outwards: lift the plate, ink its description.
      plateEls.forEach((plate, i) => {
        const copy = copyEls[copyEls.length - 1 - i];
        tl.to(plate, { z: spread(i) + 36, duration: 0.5 }, 1 + i * 0.8)
          .to(copy, { opacity: 1, duration: 0.4 }, "<")
          .to(plate, { z: spread(i), duration: 0.5 }, 1.6 + i * 0.8);
      });
      settle(tl, 0.25);
      // Exit: the stack closes up again and flies off the top, and the copy fades with it.
      const out = tl.duration();
      tl.to(plateEls, { z: 0, duration: 0.4 }, out)
        .to(plateEls, { y: -260, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power2.in" }, out + 0.35)
        .to(stage.querySelectorAll("h2, [data-layers-lede], [data-layer-copy]"), { opacity: 0, y: -32, duration: 0.5, stagger: 0.05, ease: "power2.in" }, out + 0.3);
      return cleanup;
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="como-trabajo" className="section overflow-hidden" aria-labelledby="layers-title">
      <div data-stage data-pin className="wrap grid gap-12 lg:min-h-svh lg:grid-cols-2 lg:items-center">
        <div>
          <h2 id="layers-title" className="headline max-w-[13ch]" data-lines>
            {l.title}
          </h2>
          <p data-layers-lede className="body-copy mt-6">{l.lede}</p>
          <ol className="mt-10 space-y-5">
            {l.items.map((item) => (
              <li key={item.name} data-layer-copy className="grid grid-cols-[9rem_minmax(0,1fr)] gap-4 border-t-[1.5px] border-ink pt-4 max-sm:grid-cols-1">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="layer-scene relative mx-auto aspect-square w-full max-w-[30rem]" aria-hidden="true">
          <div className="layer-stack absolute inset-[22%]">
            {plates.map((item, i) => (
              <div key={item.name} data-plate className={`layer-plate ${i === 0 ? "is-core" : ""}`} style={{ zIndex: i }}>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap">
        <h3 data-reveal className="mt-[clamp(4rem,8vw,7rem)] text-lg font-semibold">{l.around}</h3>
        {/* The bands below are decorative motion; this is the same list for assistive tech. */}
        <p className="sr-only">{l.tools.join(", ")}</p>
      </div>
      <ToolsMarquee tools={l.tools} />
    </section>
  );
}
