/**
 * The site as a deck of full-screen scenes. The window never scrolls: input
 * (wheel, swipe, keys, the controls) asks the deck to go forward or back. A
 * scene can have several steps (statements, layers, a case's lessons): going
 * forward plays the next step until the last one, then transitions to the
 * next scene. Every transition is one GSAP timeline: the outgoing scene's
 * content leaves, the stage changes composition, the incoming content enters.
 *
 * This module only holds state and the scene contract; Deck.tsx wires input,
 * timelines and the controls.
 */

export type Direction = 1 | -1;

/** How the stage itself changes when entering a scene. */
export type StageChange = "push" | "sweep" | "iris";

export interface SceneHandle {
  /** Steps inside the scene (default 1). */
  steps?: number;
  /** Adds the scene's content entrance to `tl` starting at `at`. */
  enter?(tl: gsap.core.Timeline, at: number, dir: Direction): void;
  /** Adds the scene's content exit to `tl` starting at `at`. */
  leave?(tl: gsap.core.Timeline, at: number, dir: Direction): void;
  /** Adds the change from the current step to step `to`. */
  step?(tl: gsap.core.Timeline, to: number, dir: Direction): void;
}

export interface SceneMeta {
  id: string;
  stage: StageChange;
  /** A dark scene: the fixed controls switch to light on it. */
  night?: boolean;
}

type Listener = () => void;

/**
 * Where the visitor is. Kept outside React so a language switch (which
 * remounts the content) lands back on the same scene and step.
 */
export const deckState = { index: 0, step: 0 };
const listeners = new Set<Listener>();

export function setDeckPosition(index: number, step: number) {
  deckState.index = index;
  deckState.step = step;
  listeners.forEach((listener) => listener());
}

export function subscribeDeck(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
