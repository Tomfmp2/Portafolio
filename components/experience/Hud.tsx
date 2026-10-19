"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { CHAPTERS } from "@/lib/experience/chapters";
import { emit, getLevel, interaction, subscribe } from "@/lib/experience/store";
import { sound } from "@/lib/experience/sound";
import { scrollToTarget } from "@/lib/lenis";

function useTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => setTouch(window.matchMedia("(pointer: coarse)").matches), []);
  return touch;
}

/** Game-style overlay: which level you're on, how to play it, sound and console. */
export default function Hud() {
  const { t } = useLanguage();
  const h = t.hud;
  const touch = useTouch();
  const [entered, setEntered] = useState(interaction.entered);
  const [level, setLevelState] = useState(getLevel());
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const offEnter = subscribe("entered", () => setEntered(true));
    const offLevel = subscribe("level", (n) => {
      setLevelState(n);
      sound.level(n);
    });
    const offSound = sound.onChange(setSoundOn);
    setSoundOn(sound.isEnabled());
    setEntered(interaction.entered);
    return () => {
      offEnter();
      offLevel();
      offSound();
    };
  }, []);

  if (!entered) return null;
  const hints = touch ? h.hintsTouch : h.hints;

  return (
    <div className="hud" role="region" aria-label="HUD">
      <nav className="hud-levels" aria-label={h.goTo}>
        <ol className="flex gap-1.5">
          {CHAPTERS.map((chapter, i) => (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => scrollToTarget(`#${chapter.id}`)}
                className={`hud-segment ${i === level ? "is-active" : i < level ? "is-done" : ""}`}
                aria-label={`${h.goTo} ${h.levels[i]}`}
                aria-current={i === level ? "step" : undefined}
              />
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-dim">
          <span className="prompt text-phosphor">{level + 1}/{CHAPTERS.length}</span> {h.levels[level]}
        </p>
      </nav>

      {/* Not a live region: it changes on every level and would be noisy for screen readers. */}
      <p className="hud-hint">{hints[level]}</p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="hud-button"
          aria-pressed={soundOn}
          onClick={() => sound.setEnabled(!soundOn)}
          aria-label={soundOn ? h.soundOn : h.soundOff}
          title={soundOn ? h.soundOn : h.soundOff}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" />
            {soundOn ? <path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" /> : <path d="M16.5 9.5l5 5M21.5 9.5l-5 5" />}
          </svg>
        </button>
        <button type="button" className="hud-button prompt" onClick={() => emit("console", true)} aria-label={h.console} title={`${h.console} (/)`}>
          &gt;_
        </button>
      </div>
    </div>
  );
}
