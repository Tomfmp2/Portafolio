"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLanguage } from "@/hooks/use-language";
import { CHAPTERS } from "@/lib/experience/chapters";
import { emit, subscribe } from "@/lib/experience/store";
import { sound } from "@/lib/experience/sound";
import { scrollToTarget } from "@/lib/lenis";

/** Words a visitor might type for each level, in both languages. */
const LEVEL_ALIASES: string[][] = [
  ["INICIO", "HOME", "START"],
  ["TRABAJO", "WORK", "HABILIDADES", "SKILLS", "BACKEND", "CAPAS", "LAYERS"],
  ["OCAP", "PROYECTOS", "PROJECTS"],
  ["FERIA", "FERIA MAGICA", "FERIA MÁGICA", "GLOBO", "GLOBE"],
  ["MAS", "MÁS", "MORE", "DISCOS", "FLOPPIES"],
  ["SOBRE", "SOBRE MI", "SOBRE MÍ", "ABOUT"],
  ["CONTACTO", "CONTACT"],
];
const DEMOS: Record<string, string> = {
  BANCO: "banking", BANK: "banking", BANKING: "banking",
  BETPLAY: "betplay", LIGA: "betplay", LEAGUE: "betplay",
  AEROLINEA: "airline", AEROLÍNEA: "airline", AIRLINE: "airline", TIQUETES: "airline", TICKETS: "airline",
};
const REPOS: Record<string, string> = {
  AUTOTALLER: "https://github.com/Tomfmp2/AutoTallerManager-",
  AUTOTALLERMANAGER: "https://github.com/Tomfmp2/AutoTallerManager-",
  TECHDISTRIB: "https://github.com/Tomfmp2/MySQL-2-final-project",
  GITHUB: "https://github.com/Tomfmp2",
};

const isTyping = (el: Element | null) =>
  el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el as HTMLElement | null)?.isContentEditable;

/** A C64-style command line that navigates the portfolio like a text adventure. */
export default function Console() {
  const { t, toggleLang } = useLanguage();
  const c = t.console;
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => subscribe("console", (next) => setOpen(next)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !open && !isTyping(document.activeElement)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setLines((prev) => (prev.length ? prev : [c.welcome, c.ready]));
      requestAnimationFrame(() => input.current?.focus());
    } else {
      returnFocus.current?.focus?.();
    }
  }, [open, c.welcome, c.ready]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [lines]);

  const goToLevel = (index: number) => {
    scrollToTarget(`#${CHAPTERS[index].id}`);
    setOpen(false);
  };

  const run = (raw: string): string[] => {
    const text = raw.trim().toUpperCase().replace(/["“”]/g, "").replace(/,8,1$/, "");
    const [command, ...rest] = text.split(/\s+/);
    const arg = rest.join(" ");
    const findLevel = (word: string) => {
      const n = Number(word);
      if (Number.isInteger(n) && n >= 1 && n <= CHAPTERS.length) return n - 1;
      return LEVEL_ALIASES.findIndex((aliases) => aliases.includes(word));
    };

    switch (command) {
      case "":
        return [];
      case "AYUDA":
      case "HELP":
      case "?":
        return c.help;
      case "LISTA":
      case "LIST":
      case "DIR":
        return t.hud.levels.map((name, i) => `${String(i + 1).padStart(2, " ")}  ${name.toUpperCase()}`);
      case "IR":
      case "GOTO":
      case "GO": {
        const level = findLevel(arg);
        if (level < 0) return [c.syntaxError];
        goToLevel(level);
        return [c.ready];
      }
      case "CARGAR":
      case "LOAD":
      case "RUN": {
        if (DEMOS[arg]) {
          sound.load();
          emit("demo", DEMOS[arg]);
          setOpen(false);
          return [`${c.loading} ${arg}`, c.ready];
        }
        if (REPOS[arg]) {
          window.open(REPOS[arg], "_blank", "noopener,noreferrer");
          return [`${c.loading} ${arg}`, c.ready];
        }
        const level = findLevel(arg);
        if (level < 0) return [`${c.loading} ${arg}`, c.notFound];
        sound.load();
        goToLevel(level);
        return [`${c.loading} ${arg}`, c.ready];
      }
      case "DEMO": {
        if (!DEMOS[arg]) return [c.notFound];
        sound.load();
        emit("demo", DEMOS[arg]);
        setOpen(false);
        return [c.ready];
      }
      case "CV": {
        const a = document.createElement("a");
        a.href = "/CV/Tomas_Medina_CV.pdf";
        a.download = "Tomas_Medina_CV.pdf";
        a.click();
        return [c.ready];
      }
      case "CONTACTO":
      case "CONTACT":
        goToLevel(CHAPTERS.length - 1);
        return [c.ready];
      case "SONIDO":
      case "SOUND": {
        const on = arg === "ON" || arg === "SI" || arg === "SÍ" ? true : arg === "OFF" || arg === "NO" ? false : !sound.isEnabled();
        sound.setEnabled(on);
        return [on ? c.soundOn : c.soundOff];
      }
      case "IDIOMA":
      case "LANG":
      case "LANGUAGE":
        toggleLang();
        return [c.ready];
      case "LIMPIAR":
      case "CLS":
      case "CLEAR":
        setLines([]);
        return [];
      case "SALIR":
      case "EXIT":
      case "QUIT":
        setOpen(false);
        return [];
      default: {
        const level = findLevel(text);
        if (level >= 0) {
          goToLevel(level);
          return [c.ready];
        }
        return [c.syntaxError];
      }
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const command = value;
    setValue("");
    const output = run(command);
    if (command.trim().toUpperCase() === "LIMPIAR" || command.trim().toUpperCase() === "CLS" || command.trim().toUpperCase() === "CLEAR") return;
    setLines((prev) => [...prev, `> ${command.toUpperCase()}`, ...output].slice(-60));
  };

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="console-title" className="console">
      <div className="flex items-center justify-between border-b border-[var(--c64-border,#6c5eb5)] px-4 py-2">
        <h2 id="console-title" className="text-sm">{c.title}</h2>
        <button type="button" onClick={() => setOpen(false)} className="px-2 text-sm underline underline-offset-4" aria-label={c.close}>
          ESC
        </button>
      </div>
      <div ref={log} className="console-log" aria-live="polite">
        {lines.map((line, i) => (
          <p key={i}>{line || " "}</p>
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex items-center gap-2 px-4 pb-4">
        <label htmlFor="console-input" className="sr-only">{c.inputLabel}</label>
        <span aria-hidden="true">&gt;</span>
        <input
          ref={input}
          id="console-input"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            sound.tick();
          }}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="console-input"
        />
      </form>
    </div>
  );
}
