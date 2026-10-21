"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";
import { gsap, initGSAP, MEDIA, SplitText } from "@/lib/gsap";
import { useDeckOn, useScene } from "./Deck";
import HighlighterCanvas from "./HighlighterCanvas";
import Note from "./Note";

const MARKER = "#d4ff3a";

/** Weight of the name at rest (the font's heaviest); letters enter from the thinnest. */
const HEAVY = 800;
const LIGHT = 200;
/** How far the pointer reaches over the name (px), and how much it thins and widens a letter. */
const REACH = 340;
const THIN = 580;
const WIDEN = 15;
/** Seconds a trait stays before the next replaces it, and of stillness before the name breathes on its own. */
const TRAIT_HOLD = 2.4;
const IDLE = 2.2;

type Chars = HTMLElement[];
const charsOf = (split: SplitText | null) => (split?.chars ?? []) as Chars;

/** Local time in Bucaramanga, ticking. Client-only, so the server render and first paint agree. */
function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
    const tick = () => setNow(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <time className="tabular-nums">{now ?? "--:--:--"} COT</time>;
}

/** A round sticker slapped on the poster; its ring of text turns, faster under the pointer. */
function Sticker({ text }: { text: string }) {
  return (
    <div data-sticker data-hero-rest className="hero-sticker" aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <defs>
          <path id="hero-sticker-ring" d="M100 100 m-72 0 a72 72 0 1 1 144 0 a72 72 0 1 1 -144 0" />
        </defs>
        <circle cx="100" cy="100" r="97" className="hero-sticker-disc" />
        <g data-sticker-ring>
          <text>
            <textPath href="#hero-sticker-ring" textLength="452" lengthAdjust="spacing">
              {text}
            </textPath>
          </text>
        </g>
        <path className="hero-sticker-arrow" d="M82 82 L118 118 M118 90 V118 H90" />
      </svg>
    </div>
  );
}

/**
 * The opening poster. The name runs edge to edge in the variable font and
 * answers the pointer: letters near it thin out and widen, and when the
 * pointer rests a wave passes through them on its own. Around it, the live
 * facts of a header (time in Bucaramanga, availability), a line whose trait
 * keeps changing under the highlighter, and a turning sticker.
 */
export default function Hero() {
  const { t } = useLanguage();
  const h = t.hero;
  const root = useRef<HTMLElement>(null);
  const name = useRef<SplitText | null>(null);
  const traits = useRef<SplitText[]>([]);
  const live = useRef<{ start: () => void; stop: () => void } | null>(null);
  const deck = useDeckOn();

  const q = (selector: string) => root.current?.querySelector<HTMLElement>(selector) ?? null;
  const qa = (selector: string) => Array.from(root.current?.querySelectorAll<HTMLElement>(selector) ?? []);

  /** Trait `k` writes itself in, then the highlighter runs under it. */
  const showTrait = (tl: gsap.core.Timeline, k: number, at: number) => {
    const trait = qa("[data-trait]")[k];
    tl.set(trait, { opacity: 1 }, at);
    tl.fromTo(charsOf(traits.current[k]), { yPercent: 110, rotationX: -80, transformPerspective: 500, opacity: 0 }, { yPercent: 0, rotationX: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.018 }, at);
    tl.fromTo(trait?.querySelector(".hl") ?? null, { "--hl": "0%" }, { "--hl": "100%", duration: 0.6, ease: "power2.inOut" }, at + 0.3);
  };
  const hideTrait = (tl: gsap.core.Timeline, k: number, at: number) => {
    const trait = qa("[data-trait]")[k];
    tl.to(trait?.querySelector(".hl") ?? null, { "--hl": "0%", duration: 0.3, ease: "power2.in" }, at);
    tl.to(charsOf(traits.current[k]), { yPercent: -110, opacity: 0, duration: 0.35, ease: "power2.in", stagger: 0.01 }, at + 0.1);
    tl.set(trait, { opacity: 0 }, at + 0.6);
  };

  useEffect(() => {
    const el = root.current;
    if (!el || !deck) return;
    initGSAP();
    name.current = SplitText.create(el.querySelectorAll("[data-name-row]"), { type: "chars", charsClass: "hero-char" });
    // Words too, so a trait only ever wraps between words.
    traits.current = Array.from(el.querySelectorAll("[data-trait] .hl")).map((trait) => SplitText.create(trait, { type: "words,chars" }));
    const chars = charsOf(name.current);

    // Each letter keeps the box of its heaviest cut, so thinning and widening never reflow the name.
    const lockWidths = () =>
      chars.forEach((c) => {
        const size = parseFloat(getComputedStyle(c).fontSize);
        const saved = c.style.getPropertyValue("--wg");
        c.style.width = "";
        c.style.setProperty("--wg", String(HEAVY));
        c.style.width = `${c.getBoundingClientRect().width / size}em`;
        c.style.setProperty("--wg", saved);
      });
    document.fonts.ready.then(lockWidths);

    const thin = chars.map((c) => gsap.quickTo(c, "--wp", { duration: 0.7, ease: "power3.out" }));
    const widen = chars.map((c) => gsap.quickTo(c, "--xp", { duration: 0.7, ease: "power3.out" }));
    const relax = () => chars.forEach((_, i) => (thin[i](0), widen[i](0)));

    // The wave that runs through the name whenever the pointer rests (and on touch screens).
    const wave = gsap
      .timeline({ paused: true, delay: 0.6, repeat: -1, repeatDelay: IDLE })
      .to(chars, { "--wp": THIN, "--xp": WIDEN, duration: 0.45, ease: "sine.out", stagger: 0.06 })
      .to(chars, { "--wp": 0, "--xp": 0, duration: 0.7, ease: "sine.inOut", stagger: 0.06 }, 0.4);

    let centers: { x: number; y: number }[] = [];
    let active = false;
    let idle = 0;
    const measure = () =>
      (centers = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }));
    const rest = () => {
      relax();
      wave.restart(true);
    };
    const onMove = (e: PointerEvent) => {
      if (!active || e.pointerType === "touch") return;
      wave.pause();
      window.clearTimeout(idle);
      idle = window.setTimeout(rest, IDLE * 1000);
      centers.forEach((c, i) => {
        // Flattened vertically: the pointer sweeps along the line rather than a circle around each letter.
        const f = Math.max(0, 1 - Math.hypot(e.clientX - c.x, (e.clientY - c.y) * 0.6) / REACH) ** 2;
        thin[i](f * THIN);
        widen[i](f * WIDEN);
      });
    };
    if (matchMedia(MEDIA.finePointer).matches) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", measure);

    // The sticker's ring turns for as long as the hero is on screen; the pointer speeds it up.
    const sticker = el.querySelector<HTMLElement>("[data-sticker]");
    const spin = gsap.to(el.querySelector("[data-sticker-ring]"), { rotation: 360, svgOrigin: "100 100", duration: 16, ease: "none", repeat: -1, paused: true });
    const fast = () => gsap.to(spin, { timeScale: 5, duration: 0.6, ease: "power2.out" });
    const slow = () => gsap.to(spin, { timeScale: 1, duration: 1.2, ease: "power2.out" });
    sticker?.addEventListener("pointerenter", fast);
    sticker?.addEventListener("pointerleave", slow);

    // The traits take turns under the highlighter.
    let shown = 0;
    let swap: gsap.core.Timeline | null = null;
    let next: gsap.core.Tween | null = null;
    const cycle = () => {
      swap = gsap.timeline();
      hideTrait(swap, shown, 0);
      shown = (shown + 1) % traits.current.length;
      showTrait(swap, shown, 0.4);
      next = gsap.delayedCall(TRAIT_HOLD + 1.1, cycle);
    };

    live.current = {
      start() {
        active = true;
        shown = 0;
        measure();
        spin.play();
        wave.restart(true);
        next = gsap.delayedCall(TRAIT_HOLD, cycle);
      },
      stop() {
        active = false;
        window.clearTimeout(idle);
        wave.pause();
        relax();
        spin.pause();
        next?.kill();
        swap?.progress(1).kill();
      },
    };

    return () => {
      live.current?.stop();
      live.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", measure);
      sticker?.removeEventListener("pointerenter", fast);
      sticker?.removeEventListener("pointerleave", slow);
      wave.kill();
      spin.kill();
      traits.current.forEach((split) => split.revert());
      traits.current = [];
      name.current?.revert();
      name.current = null;
    };
  }, [deck]);

  useScene({
    // The opening of the whole site: the rules are drawn, the name rises out of its baseline and
    // swells from hairline to heavy, the highlighter strikes under the surname and the sticker lands.
    enter(tl, at) {
      const chars = charsOf(name.current);
      if (!chars.length) return;
      tl.set(qa("[data-name-row], [data-meta-item], [data-hero-role], [data-trait], [data-hero-rest]"), { visibility: "visible" }, 0);
      // Coming back after the exit: bring the blocks back before their parts animate in.
      tl.set(qa("[data-hero-out]"), { opacity: 1, y: 0, skewY: 0 }, 0);
      tl.set(qa("[data-trait]"), { opacity: (i: number) => (i === 0 ? 1 : 0) }, 0);

      tl.fromTo(q("[data-hero-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut" }, at);
      tl.fromTo(qa("[data-meta-item]"), { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.out", stagger: 0.08 }, at + 0.25);

      tl.fromTo(chars, { yPercent: 105 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.045 }, at + 0.1);
      tl.fromTo(chars, { "--wg": LIGHT }, { "--wg": HEAVY, duration: 1.3, ease: "power3.inOut", stagger: 0.045 }, at + 0.35);
      tl.fromTo(q("[data-swipe]"), { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, at + 1.1);

      tl.fromTo(q("[data-hero-role]"), { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.out" }, at + 0.6);
      showTrait(tl, 0, at + 0.8);
      tl.fromTo(qa("[data-hero-rest]:not([data-sticker])"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }, at + 1);
      tl.fromTo(q("[data-sticker]"), { opacity: 1, scale: 0, rotation: -160 }, { scale: 1, rotation: -12, duration: 1.1, ease: "back.out(1.6)" }, at + 1.2);
      tl.call(() => live.current?.start(), [], at + 1.8);
    },
    // The name thins back to a hairline and sinks into its baseline; everything else lifts away.
    leave(tl, at) {
      const chars = charsOf(name.current);
      if (!chars.length) return;
      tl.call(() => live.current?.stop(), [], at);
      tl.to(chars, { yPercent: 105, "--wg": LIGHT, duration: 0.6, ease: "power3.in", stagger: { each: 0.03, from: "edges" } }, at);
      tl.to(q("[data-swipe]"), { scaleX: 0, transformOrigin: "right center", duration: 0.4, ease: "power2.in" }, at);
      tl.to(q("[data-sticker]"), { scale: 0, rotation: 200, duration: 0.55, ease: "back.in(1.4)" }, at);
      tl.to(qa("[data-hero-out]"), { opacity: 0, y: -50, skewY: -4, duration: 0.45, stagger: 0.06, ease: "power2.in" }, at + 0.05);
    },
  });

  const metaLabel = "block text-ink-soft";
  return (
    <section ref={root} data-motion-owned className="hero scene-fill relative flex flex-col overflow-hidden" aria-labelledby="hero-name">
      <HighlighterCanvas color={MARKER} />
      <div className="hero-content wrap relative flex flex-1 flex-col justify-between gap-[clamp(1.75rem,4.5vh,3rem)] pb-[clamp(5.5rem,11vh,7rem)] pt-[clamp(5.5rem,12vh,7.5rem)]">
        <dl data-hero-out className="hero-meta">
          <div data-meta-item>
            <dt className={metaLabel}>(01)</dt>
            <dd>{h.meta.folio}</dd>
          </div>
          <div data-meta-item>
            <dt className={metaLabel}>Stack</dt>
            <dd>{h.meta.stack}</dd>
          </div>
          <div data-meta-item>
            <dt className={metaLabel}>{h.meta.clock}</dt>
            <dd>
              <Clock />
            </dd>
          </div>
          <div data-meta-item>
            <dt className="sr-only">{h.meta.open}</dt>
            <dd className="flex items-center gap-2">
              <span className="hero-live" aria-hidden="true" />
              {h.meta.open}
            </dd>
          </div>
          <span data-hero-rule className="hero-rule" aria-hidden="true" />
        </dl>

        <div data-hero-out className="max-md:order-last">
          <p className="hero-lead">
            <span data-hero-role className="block">
              {h.role}
            </span>
            <span className="hero-rotor" aria-hidden="true">
              {h.traits.map((trait) => (
                <span key={trait} data-trait className="hero-trait">
                  <span className="hl">{trait}</span>
                </span>
              ))}
            </span>
            <span className="sr-only">{h.traits.join(" ")}</span>
          </p>
          <p data-hero-rest className="small mt-4">
            {h.where}
          </p>
          <div data-hero-rest className="mt-6 flex flex-wrap items-center gap-3">
            <a href={links.cv} download className="btn btn-ink">
              {h.cv}
            </a>
            <a href="#proyectos" className="btn btn-line">
              {h.work}
            </a>
          </div>
        </div>

        <div className="relative">
          <Sticker text={h.sticker} />
          <div data-hero-rest data-hero-out className="pointer-hint hero-hint">
            <Note arrow="down" decorative>
              {h.drawHint}
            </Note>
          </div>
          <h1 id="hero-name" className="hero-name">
            <span data-name-row className="hero-name-row">
              {h.name[0]}
            </span>{" "}
            <span className="relative block w-fit max-md:ml-auto">
              <span data-name-row className="hero-name-row relative z-[1]">
                {h.name[1]}
              </span>
              {/* The highlighter stroke drawn under the surname on arrival */}
              <span data-swipe className="hero-swipe" aria-hidden="true" />
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
