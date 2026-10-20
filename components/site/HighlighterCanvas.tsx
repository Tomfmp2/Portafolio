"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type Stroke = { points: Point[]; endedAt: number | null };

/** How long a finished stroke stays before it fades, and how long the fade takes (ms). */
const HOLD = 2600;
const FADE = 900;
const WIDTH = 30;

/**
 * Drag on the hero to draw with the highlighter. The canvas sits behind the
 * text, so strokes land under the letters like real ink. Mouse and pen only:
 * on touch screens a drag must keep scrolling the page.
 */
export default function HighlighterCanvas({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const strokes: Stroke[] = [];
    let current: Stroke | null = null;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      schedule();
    };

    const draw = (now: number) => {
      frame = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = strokes.length - 1; i >= 0; i--) {
        const s = strokes[i];
        const age = s.endedAt == null ? 0 : now - s.endedAt;
        const alpha = age < HOLD ? 1 : 1 - (age - HOLD) / FADE;
        if (alpha <= 0) {
          strokes.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = alpha * 0.9;
        ctx.strokeStyle = color;
        // A chisel tip: wide, flat ends, slightly rough joins.
        ctx.lineWidth = WIDTH;
        ctx.lineCap = "butt";
        ctx.lineJoin = "round";
        ctx.beginPath();
        s.points.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.stroke();
      }
      if (strokes.length) schedule();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const local = (e: PointerEvent): Point => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      current = { points: [local(e)], endedAt: null };
      strokes.push(current);
      canvas.setPointerCapture(e.pointerId);
      // Drawing, not selecting text underneath.
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      if (!current) return;
      const p = local(e);
      const last = current.points[current.points.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) > 2) current.points.push(p);
      schedule();
    };
    const onUp = () => {
      if (current) current.endedAt = performance.now();
      current = null;
      schedule();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [color]);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
