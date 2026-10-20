/**
 * The page intro (preloader, then the hero's entrance) is shared state between
 * components that otherwise don't know each other. A tiny event, not a store.
 */
let done = false;
const listeners = new Set<() => void>();

export function introFinished() {
  done = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

/** Runs `callback` once the intro is over (immediately if it already is). Returns an unsubscribe. */
export function onIntro(callback: () => void) {
  if (done) {
    callback();
    return () => {};
  }
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export const INTRO_KEY = "tm-intro-seen";

/**
 * Runs before first paint (inlined in <head>): marks that JS is available and
 * whether this session already saw the intro, so CSS can show or skip the
 * preloader without a flash in either direction.
 */
export const introScript = `try{var d=document.documentElement;d.classList.add('js');if(sessionStorage.getItem('${INTRO_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro-seen')}catch(e){}`;
