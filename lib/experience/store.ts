/**
 * Shared state between the DOM (HUD, console, sections) and the WebGL scene.
 *
 * The scene reads `interaction` every frame, so it stays a plain mutable object.
 * React only needs to know about a few discrete changes (entering, the current
 * level, opening a demo), which go through `emit`/`subscribe`.
 */

export const interaction = {
  /** True once the visitor passes the boot screen; the C64 assembles on entry. */
  entered: false,
  /** Ring index of Clean Architecture to lift (-1 = none), set by hovering the layer list. */
  highlightLayer: -1,
  /** Pending click shockwave in normalized device coordinates, consumed by the scene. */
  shock: null as { x: number; y: number } | null,
};

type Events = {
  entered: void;
  level: number;
  demo: string;
  console: boolean;
};

type Listener<T> = (payload: T) => void;
const listeners: { [K in keyof Events]?: Set<Listener<Events[K]>> } = {};

export function subscribe<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
  const set = (listeners[event] ??= new Set() as never) as Set<Listener<Events[K]>>;
  set.add(listener);
  return () => {
    set.delete(listener);
  };
}

export function emit<K extends keyof Events>(event: K, payload: Events[K]) {
  (listeners[event] as Set<Listener<Events[K]>> | undefined)?.forEach((listener) => listener(payload));
}

let level = 0;
/** The level (rounded chapter) shown in the HUD; only emits when it changes. */
export function setLevel(next: number) {
  if (next === level) return;
  level = next;
  emit('level', next);
}
export const getLevel = () => level;

export function enter() {
  if (interaction.entered) return;
  interaction.entered = true;
  emit('entered', undefined);
}
