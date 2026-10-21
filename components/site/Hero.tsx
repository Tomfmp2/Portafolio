"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/use-language";
import { links } from "@/lib/content";
import { gsap, initGSAP, MEDIA } from "@/lib/gsap";
import { MARKER } from "@/lib/palette";
import { useDeckOn, useScene } from "./Deck";
import Workstation from "./Workstation";

const SOCIAL = [
  { short: "Gh", label: "GitHub", href: links.github },
  { short: "In", label: "LinkedIn", href: links.linkedin },
  { short: "Tg", label: "Telegram", href: links.telegram },
  { short: "@", label: "Email", href: `mailto:${links.email}` },
];

/** Seconds per typed character, after a command, and before the terminal starts over. */
const TYPE = 0.055;
const RUN = 0.45;
const HOLD = 2.8;
/** How far (px) the nearest piece of the illustration drifts with the pointer. */
const DRIFT = 12;

/**
 * The opening scene, composed like a gallery print: a short stack of type on
 * the left (name, role in orange, a three-line motto) and a line-art
 * workstation on the right whose terminal really runs, its lights blink and
 * its pieces drift apart with the pointer. An orange block rises from the
 * bottom edge under it.
 */
export default function Hero() {
  const { t } = useLanguage();
  const h = t.hero;
  const root = useRef<HTMLElement>(null);
  const live = useRef<{ start: () => void; stop: () => void; clear: () => void } | null>(null);
  const deck = useDeckOn();

  const q = (selector: string) => root.current?.querySelector<HTMLElement>(selector) ?? null;
  const qa = (selector: string) => Array.from(root.current?.querySelectorAll<HTMLElement>(selector) ?? []);

  useEffect(() => {
    const el = root.current;
    if (!el || !deck) return;
    initGSAP();
    const svg = el.querySelector<SVGSVGElement>(".workstation");
    if (!svg) return;
    const $ = <T extends Element>(s: string) => Array.from(svg.querySelectorAll<T>(s));

    // The terminal: each command is typed with the cursor following it, then its output prints.
    const lines = $<SVGTextElement>("[data-cmd], [data-out]");
    const prompts = $<SVGTextElement>("[data-prompt]");
    const cursor = svg.querySelector<SVGRectElement>("[data-cursor]");
    const charWidth = (() => {
      const first = $<SVGTextElement>("[data-cmd]")[0];
      return first ? first.getComputedTextLength() / (first.dataset.cmd?.length || 1) : 6.4;
    })();
    const placeCursor = (line: SVGTextElement, chars: number) =>
      gsap.set(cursor, { attr: { x: Number(line.getAttribute("x")) + chars * charWidth, y: Number(line.getAttribute("y")) - 9 } });
    const clear = () => {
      lines.forEach((line) => (line.dataset.cmd !== undefined ? (line.textContent = "") : gsap.set(line, { opacity: 0 })));
      gsap.set(prompts, { opacity: (i: number) => (i === 0 ? 1 : 0) });
      if (lines[0]) placeCursor(lines[0], 0);
    };
    const terminal = gsap.timeline({ paused: true, repeat: -1, repeatDelay: HOLD });
    terminal.call(clear, [], 0);
    let at = 0.4;
    lines.forEach((line) => {
      const cmd = line.dataset.cmd;
      if (cmd !== undefined) {
        const prompt = line.previousElementSibling;
        terminal.set(prompt, { opacity: 1 }, at);
        const typed = { n: 0 };
        terminal.to(typed, {
          n: cmd.length,
          duration: cmd.length * TYPE,
          ease: "none",
          onStart: () => placeCursor(line, 0),
          onUpdate: () => {
            const n = Math.round(typed.n);
            line.textContent = cmd.slice(0, n);
            placeCursor(line, n);
          },
        }, at);
        at += cmd.length * TYPE + RUN;
      } else {
        terminal.set(line, { opacity: 1 }, at);
        at += 0.25;
      }
    });
    // Back to the empty prompt at the bottom, waiting.
    const last = prompts[prompts.length - 1];
    terminal.call(() => {
      gsap.set(last, { opacity: 1 });
      gsap.set(cursor, { attr: { x: 208, y: 263 } });
    }, [], at);

    const blink = gsap.to(cursor, { opacity: 0, duration: 0.5, ease: "steps(1)", repeat: -1, yoyo: true, paused: true });
    // Each status light flickers on its own irregular beat.
    const leds = gsap.timeline({ paused: true });
    $("[data-led]").forEach((led) => leds.to(led, { fill: MARKER, duration: 0.09, repeat: -1, yoyo: true, repeatDelay: gsap.utils.random(0.4, 2.2) }, gsap.utils.random(0, 1.5)));
    const steam = gsap.fromTo($("[data-steam]"), { y: 6, opacity: 0 }, { y: -10, opacity: 0.7, duration: 1.6, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.55, paused: true });

    // Parallax: nearer pieces drift further with the pointer, so the drawing gains depth.
    const pieces = $<SVGGElement>("[data-piece]");
    const drift = pieces.map((piece) => {
      const depth = Number(piece.dataset.depth) || 1;
      return { depth, x: gsap.quickTo(piece, "x", { duration: 0.9, ease: "power3.out" }), y: gsap.quickTo(piece, "y", { duration: 0.9, ease: "power3.out" }) };
    });
    let active = false;
    const onMove = (e: PointerEvent) => {
      if (!active) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      drift.forEach((d) => (d.x(-nx * DRIFT * d.depth), d.y(-ny * DRIFT * 0.6 * d.depth)));
    };
    if (matchMedia(MEDIA.finePointer).matches) window.addEventListener("pointermove", onMove, { passive: true });

    live.current = {
      clear,
      start() {
        active = true;
        terminal.restart();
        blink.play();
        leds.play();
        steam.play();
      },
      stop() {
        active = false;
        drift.forEach((d) => (d.x(0), d.y(0)));
        terminal.pause();
        blink.pause();
        leds.pause();
        steam.pause();
      },
    };

    return () => {
      live.current = null;
      window.removeEventListener("pointermove", onMove);
      [terminal, blink, leds, steam].forEach((anim) => anim.revert());
      lines.forEach((line) => line.dataset.cmd !== undefined && (line.textContent = line.dataset.cmd));
    };
  }, [deck]);

  useScene({
    // The print is laid out piece by piece: the orange block rises, the type is pulled up line by
    // line, the workstation is set down object by object, its keys drop in and the CRT warms up.
    enter(tl, at) {
      live.current?.clear();
      tl.set(qa("[data-line], [data-hero-in], [data-piece], [data-hero-block]"), { visibility: "visible" }, 0);
      tl.fromTo(q("[data-hero-block]"), { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 100%", duration: 0.9, ease: "expo.out" }, at);
      tl.fromTo(qa("[data-line]"), { yPercent: 105 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.09 }, at + 0.1);
      tl.fromTo(qa("[data-hero-in]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, at + 0.55);
      tl.fromTo(qa("[data-piece]"), { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.09 }, at + 0.25);
      tl.fromTo(qa("[data-key]"), { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(2.5)", stagger: { each: 0.008, from: "random" } }, at + 0.85);
      tl.fromTo(q("[data-screen]"), { scaleY: 0.02, scaleX: 0.6, transformOrigin: "50% 50%" }, { scaleY: 1, scaleX: 1, duration: 0.55, ease: "expo.out" }, at + 1.25);
      tl.call(() => live.current?.start(), [], at + 1.6);
    },
    // Everything is lifted off the print again, the block sinking back under the edge.
    leave(tl, at, dir) {
      tl.call(() => live.current?.stop(), [], at);
      tl.to(qa("[data-line]"), { yPercent: -105 * dir, duration: 0.5, ease: "power3.in", stagger: 0.04 }, at);
      tl.to(qa("[data-hero-in]"), { opacity: 0, y: -16, duration: 0.35, ease: "power2.in" }, at);
      tl.to(qa("[data-piece]"), { yPercent: 22, opacity: 0, duration: 0.55, ease: "power3.in", stagger: { each: 0.05, from: "end" } }, at);
      tl.to(q("[data-hero-block]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.5, ease: "power3.in" }, at + 0.1);
    },
  });

  return (
    <section ref={root} data-motion-owned className="hero scene-fill relative overflow-hidden" aria-labelledby="hero-name">
      <div className="hero-layout wrap">
        <h1 id="hero-name" className="hero-title">
          {h.name.map((part, i) => (
            <span key={part} className="hero-mask">
              <span data-line className="block">
                {i > 0 && <span className="sr-only"> </span>}
                {part}
              </span>
            </span>
          ))}
        </h1>
        <p data-hero-in className="hero-kicker">
          {h.role}
        </p>
        <p className="hero-tagline">
          {h.tagline.map((line, i) => (
            <span key={line} className="hero-mask">
              <span data-line className="block">
                {i > 0 && <span className="sr-only"> </span>}
                {line}
              </span>
            </span>
          ))}
        </p>
        <div data-hero-in className="hero-actions">
          <a href={links.cv} download className="hero-cta is-solid">
            {h.cv}
          </a>
          <a href="#proyectos" className="hero-cta">
            {h.work}
            <span aria-hidden="true"> →</span>
          </a>
        </div>
        <div className="hero-art">
          <Workstation title={h.art} />
        </div>
        <ul data-hero-in className="hero-social">
          {SOCIAL.map((s) => (
            <li key={s.label}>
              <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={s.label}>
                {s.short}
              </a>
            </li>
          ))}
        </ul>
        <p data-hero-in className="hero-folio">
          {h.folio}
        </p>
      </div>
      <span data-hero-block className="hero-block" aria-hidden="true" />
    </section>
  );
}
