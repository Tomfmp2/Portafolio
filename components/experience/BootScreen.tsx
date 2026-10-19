"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { enter } from "@/lib/experience/store";
import { sound } from "@/lib/experience/sound";
import { getLenisInstance, scrollToTarget } from "@/lib/lenis";
import { checkReducedMotion } from "@/lib/performance";

const SESSION_KEY = "tfm-booted";
const LINES = [
  "    **** TFM PORTAFOLIO 64 V2 ****",
  "",
  " 64K RAM SYSTEM  38911 BASIC BYTES FREE",
  "",
  "READY.",
  'LOAD "TOMAS MEDINA",8,1',
  "",
  "SEARCHING FOR TOMAS MEDINA",
  "LOADING",
  "READY.",
];
const EXIT_MS = 1100;

function seenThisSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * The C64 power-on screen. The visitor chooses sound or silence, then the screen
 * shrinks back into the particle monitor while the machine assembles — we were
 * "inside" the monitor all along. Shown once per session.
 */
export default function BootScreen() {
  const { t } = useLanguage();
  const b = t.boot;
  // Rendered on the server too, so the page never flashes before the screen appears.
  const [state, setState] = useState<"typing" | "ready" | "leaving" | "gone">("typing");
  const [typed, setTyped] = useState(0);
  const firstButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (seenThisSession()) {
      enter();
      setState("gone");
      return;
    }
    if (checkReducedMotion()) {
      setState("ready");
      setTyped(LINES.length);
    }
    // Hold the hero entrance until the visitor is actually looking at it.
    root.classList.add("booting");
    root.style.overflow = "hidden";
    getLenisInstance()?.stop();
  }, []);

  useEffect(() => {
    if (state !== "typing") return;
    if (typed >= LINES.length) {
      setState("ready");
      return;
    }
    const id = window.setTimeout(() => setTyped((n) => n + 1), LINES[typed] === "" ? 90 : 210);
    return () => window.clearTimeout(id);
  }, [state, typed]);

  useEffect(() => {
    if (state === "ready") firstButton.current?.focus();
  }, [state]);

  const start = (withSound: boolean, goTo?: string) => {
    if (state === "leaving" || state === "gone") return;
    // Inside the click handler, so the browser allows the AudioContext.
    sound.setEnabled(withSound);
    sound.boot();
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Without storage the boot screen simply shows again next visit.
    }
    enter();
    setState("leaving");
    document.documentElement.classList.remove("booting");
    const reduced = checkReducedMotion();
    window.setTimeout(() => {
      document.documentElement.style.overflow = "";
      getLenisInstance()?.start();
      setState("gone");
      if (goTo) scrollToTarget(goTo);
      else document.getElementById("hero-name")?.focus({ preventScroll: true });
    }, reduced ? 0 : EXIT_MS);
  };

  useEffect(() => {
    if (state !== "ready" && state !== "typing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") start(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (state === "gone") return null;

  return (
    <>
    {/* Without JavaScript nothing could dismiss the screen, so it is never shown. */}
    <noscript>
      <style>{`.boot-screen{display:none}`}</style>
    </noscript>
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="boot-title"
      className={`boot-screen ${state === "leaving" ? "boot-leaving" : ""}`}
    >
      <h2 id="boot-title" className="sr-only">{b.title}</h2>
      <div className="boot-inner">
        <pre className="boot-text" aria-hidden={state !== "ready"}>
          {LINES.slice(0, typed).join("\n")}
          {state === "typing" && <span className="cursor" />}
        </pre>
        {state !== "typing" && (
          <div className="boot-prompt">
            <p>{b.question}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button ref={firstButton} type="button" className="boot-button" onClick={() => start(true)}>
                {b.withSound}
              </button>
              <button type="button" className="boot-button" onClick={() => start(false)}>
                {b.withoutSound}
              </button>
            </div>
            <button type="button" className="boot-skip" onClick={() => start(false, "#proyectos")}>
              {b.skip}
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
