"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/hooks/use-language";
import { deckState, setDeckPosition, subscribeDeck, type Direction, type SceneHandle, type SceneMeta } from "@/lib/deck";
import { gsap, initGSAP, MEDIA, Observer } from "@/lib/gsap";
import { onIntro } from "@/lib/intro";
import { changeStage, enterContent, leaveContent, revertLines } from "@/lib/reveal";

/* ---------- Scene context ---------- */

interface SceneContextValue {
  index: number;
  /** False when the deck is off (reduced motion, no JS): the page is a plain document. */
  deck: boolean;
  register: (index: number, handle: SceneHandle | null) => void;
}

const SceneContext = createContext<SceneContextValue>({ index: 0, deck: false, register: () => {} });

/** Registers the scene's animations with the deck. Pass a stable object (useMemo) or refs inside it. */
export function useScene(handle: SceneHandle) {
  const { index, register } = useContext(SceneContext);
  const latest = useRef(handle);
  latest.current = handle;
  useEffect(() => {
    // A proxy so the deck always calls the scene's latest closures.
    register(index, {
      get steps() {
        return latest.current.steps;
      },
      enter: (...args) => latest.current.enter?.(...args),
      leave: (...args) => latest.current.leave?.(...args),
      step: (...args) => latest.current.step?.(...args),
    });
    return () => register(index, null);
  }, [index, register]);
}

/** This scene's position in the deck. */
export function useSceneIndex() {
  return useContext(SceneContext).index;
}

export function useDeckOn() {
  return useContext(SceneContext).deck;
}

/* ---------- Deck ---------- */

/** The deck remounts on a language switch; only the page's first mount may treat a reload as a fresh start. */
let firstMount = true;
const isReload = () => (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type === "reload";

interface DeckScene extends SceneMeta {
  label: string;
  node: React.ReactNode;
}

/** Cooldown after a transition during which wheel input is ignored (trackpad inertia). */
const WHEEL_COOLDOWN = 420;
/** A scroller must have been still this long at its edge before a wheel/swipe leaves the scene. */
const EDGE_QUIET = 380;

function canScroll(el: HTMLElement, dir: Direction) {
  return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 2;
}

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
}

export default function Deck({ scenes }: { scenes: DeckScene[] }) {
  const { t } = useLanguage();
  const d = t.deck;
  const root = useRef<HTMLDivElement>(null);
  const handles = useRef<(SceneHandle | null)[]>([]);
  const [on, setOn] = useState(false);
  const position = useSyncExternalStore(subscribeDeck, () => deckState.index * 100 + deckState.step, () => 0);
  const index = Math.floor(position / 100);
  const live = useRef({
    busy: false,
    /** Latest request made while busy: a step direction or a scene index (from a key, the controls, a link). */
    pending: null as null | { dir: Direction } | { target: number },
    tl: null as gsap.core.Timeline | null,
    lastEnd: 0,
    lastInnerScroll: 0,
    fromKeyboard: false,
  });

  const register = useCallback((i: number, handle: SceneHandle | null) => {
    handles.current[i] = handle;
  }, []);

  // The deck runs only with motion allowed; otherwise the page stays a plain scrolling document.
  useEffect(() => {
    const query = matchMedia(MEDIA.motion);
    const update = () => {
      setOn(query.matches);
      document.documentElement.classList.toggle("deck-on", query.matches);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const els = () => Array.from(root.current?.querySelectorAll<HTMLElement>(":scope > .scene") ?? []);

  /** Puts the deck on `target` at `step` with no animation (first load, language switch, resize). */
  const place = useCallback((target: number, step: number) => {
    els().forEach((el, i) => {
      el.classList.toggle("is-active", i === target);
      el.classList.remove("is-leaving");
    });
    setDeckPosition(target, step);
  }, []);

  // Navigation lives in refs: transitions call back into it from GSAP callbacks and listeners,
  // which must always reach the current version.
  const nav = useRef({ go: (_target: number, _opts?: { hash?: boolean }) => {}, move: (_dir: Direction) => {} });

  /** The stage is in place: input is accepted again (the content may still be animating in). */
  const release = () => {
    const s = live.current;
    s.busy = false;
    s.lastEnd = performance.now();
    const next = s.pending;
    s.pending = null;
    if (next && "dir" in next) nav.current.move(next.dir);
    else if (next) nav.current.go(next.target);
  };

  /** The whole transition has played out. */
  const finish = () => {
    const s = live.current;
    els().forEach((el) => el.classList.remove("is-leaving"));
    if (s.fromKeyboard) {
      els()[deckState.index]?.focus({ preventScroll: true });
      s.fromKeyboard = false;
    }
  };

  /** Starts a transition timeline, first fast-forwarding one whose content is still animating in. */
  const begin = (releaseAt: number) => {
    const s = live.current;
    if (s.tl?.isActive()) s.tl.progress(1);
    s.busy = true;
    const tl = gsap.timeline({ onComplete: finish });
    tl.call(release, [], releaseAt);
    s.tl = tl;
    return tl;
  };

  /** Transition to another scene. */
  nav.current.go = (target, opts = {}) => {
    const s = live.current;
    const all = els();
    const from = deckState.index;
    if (target === from || target < 0 || target >= all.length) return;
    if (s.busy) {
      s.pending = { target };
      return;
    }
    // Every scene starts from its top.
    all[target].scrollTop = 0;
    const dir: Direction = target > from ? 1 : -1;
    // Input is free again once the stage has changed (see changeStage timings).
    const tl = begin(scenes[dir > 0 ? target : from].stage === "sweep" ? 1.5 : 1.3);
    // 1. What's on screen leaves.
    leaveContent(tl, all[from], 0, dir);
    handles.current[from]?.leave?.(tl, 0, dir);
    // 2. The stage changes composition (the entering scene picks how; going back reuses it).
    const stage = scenes[dir > 0 ? target : from].stage;
    const enterAt = changeStage(tl, stage, all[from], all[target], 0.35, dir);
    // 3. What's next arrives.
    enterContent(tl, all[target], enterAt);
    handles.current[target]?.enter?.(tl, enterAt, dir);
    setDeckPosition(target, 0);
    const hash = `#${scenes[target].id}`;
    if (opts.hash !== false && location.hash !== hash) history.replaceState(null, "", hash);
  };

  /** One step forward or back: within the scene if it has steps left, otherwise to the next scene. */
  nav.current.move = (dir) => {
    const s = live.current;
    if (s.busy) {
      s.pending = { dir };
      return;
    }
    const { index: i, step } = deckState;
    const handle = handles.current[i];
    const steps = handle?.steps ?? 1;
    const target = step + dir;
    if (handle?.step && target >= 0 && target < steps) {
      const tl = begin(0.6);
      handle.step(tl, target, dir);
      setDeckPosition(i, target);
      return;
    }
    nav.current.go(i + dir);
  };
  const move = (dir: Direction) => nav.current.move(dir);
  const go = (target: number, opts?: { hash?: boolean }) => nav.current.go(target, opts);

  // Input: wheel and touch through GSAP Observer, keys, the URL hash, and focus.
  useEffect(() => {
    if (!on) return;
    initGSAP();
    const s = live.current;

    // Start where the URL (or the language switch) says, then play that scene's entrance after the intro.
    // The deck keeps the current scene in the hash, so a reload would otherwise land mid-journey:
    // reloading starts over at the home, while a shared link (#ocap) still opens its scene.
    if (firstMount && isReload()) history.replaceState(null, "", location.pathname + location.search);
    firstMount = false;
    const fromHash = scenes.findIndex((scene) => `#${scene.id}` === location.hash);
    const start = fromHash >= 0 ? fromHash : deckState.index;
    place(start, 0);
    const offIntro = onIntro(() => {
      const el = els()[start];
      if (!el) return;
      const tl = gsap.timeline();
      enterContent(tl, el, 0);
      handles.current[start]?.enter?.(tl, 0, 1);
      // Tracked like any transition, so navigating mid-intro fast-forwards it instead of fighting it.
      s.tl = tl;
    });

    const intent = (dir: Direction, event?: Event) => {
      if (document.documentElement.classList.contains("menu-open")) return;
      if ((event?.target as HTMLElement | null)?.closest?.("[role='dialog']")) return;
      // Gestures never queue: trackpad inertia keeps firing during and right after a transition,
      // and each of those events would otherwise become an extra, unwanted step.
      if (s.busy || performance.now() - s.lastEnd < WHEEL_COOLDOWN) return;
      // A scene taller than the screen scrolls inside first; the deck only moves once it rests at its edge.
      const scroller = els()[deckState.index];
      if (scroller && (canScroll(scroller, dir) || performance.now() - s.lastInnerScroll < EDGE_QUIET)) return;
      s.fromKeyboard = false;
      move(dir);
    };

    const observer = Observer.create({
      target: window,
      type: "wheel,touch",
      wheelSpeed: -1,
      tolerance: 14,
      preventDefault: false,
      onUp: (self) => intent(1, self.event),
      onDown: (self) => intent(-1, self.event),
    });

    const onInnerScroll = () => (s.lastInnerScroll = performance.now());
    root.current?.addEventListener("scroll", onInnerScroll, { capture: true, passive: true });

    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || document.documentElement.classList.contains("menu-open")) return;
      if ((e.target as HTMLElement | null)?.closest?.("[role='dialog']")) return;
      const onControl = (e.target as HTMLElement | null)?.closest?.("a, button");
      const forward = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey && !onControl);
      const back = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey && !onControl);
      if (forward || back) {
        e.preventDefault();
        // Keys read through a long scene before leaving it, a screenful at a time.
        const scroller = els()[deckState.index];
        if (scroller && canScroll(scroller, forward ? 1 : -1)) {
          scroller.scrollBy({ top: (forward ? 1 : -1) * scroller.clientHeight * 0.8, behavior: "smooth" });
          return;
        }
        s.fromKeyboard = true;
        move(forward ? 1 : -1);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        s.fromKeyboard = true;
        go(e.key === "Home" ? 0 : scenes.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);

    // Links to #scene (menu, buttons, back/forward) travel through the deck.
    const onHash = () => {
      const target = scenes.findIndex((scene) => `#${scene.id}` === location.hash);
      if (target >= 0) go(target, { hash: false });
    };
    window.addEventListener("hashchange", onHash);

    return () => {
      offIntro();
      observer.kill();
      root.current?.removeEventListener("scroll", onInnerScroll, { capture: true });
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- set up once per deck mount
  }, [on]);

  // Heading splits are made lazily; undo them when the content unmounts (language switch).
  useEffect(() => {
    const el = root.current;
    return () => {
      if (el) revertLines(el);
    };
  }, []);

  const total = scenes.length;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <SceneContext.Provider value={{ index: 0, deck: on, register }}>
      <div ref={root} className="deck">
        {scenes.map((scene, i) => (
          <SceneContext.Provider key={scene.id} value={{ index: i, deck: on, register }}>
            <div id={scene.id} data-scene={i} tabIndex={-1} className={`scene ${i === 0 ? "is-active" : ""}`} aria-label={scene.label}>
              {scene.node}
            </div>
          </SceneContext.Provider>
        ))}
      </div>

      {on && (
        <>
          {/* The pagination of a print series: every scene's number, with an orange rule running after the current one. */}
          <div className={`deck-bar ${index === 0 ? "is-home" : ""} ${scenes[index]?.night ? "is-night" : ""}`}>
            <nav className="deck-pages" aria-label={d.scenes}>
              <ol>
                {scenes.map((scene, i) => (
                  <li key={scene.id}>
                    <a href={`#${scene.id}`} aria-current={i === index ? "step" : undefined} onClick={() => (live.current.fromKeyboard = true)}>
                      <span aria-hidden="true">{pad(i + 1)}</span>
                      <span className="deck-page-label">{scene.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="flex items-center gap-2">
              <button type="button" className="deck-arrow" onClick={() => move(-1)} disabled={index === 0 && deckState.step === 0} aria-label={d.prev}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <button type="button" className="deck-arrow is-next" onClick={() => move(1)} disabled={index === total - 1} aria-label={d.next}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Announces where the visitor is after each move. */}
          <p className="sr-only" aria-live="polite">
            {d.announce.replace("{n}", String(index + 1)).replace("{total}", String(total)).replace("{label}", scenes[index]?.label ?? "")}
          </p>
        </>
      )}
    </SceneContext.Provider>
  );
}
