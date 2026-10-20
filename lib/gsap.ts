/**
 * Single place where GSAP and its plugins are registered. Every component
 * imports gsap from here, so plugins are always available and registered once.
 *
 * The site has no scrolling page: Observer turns wheel and touch into deck
 * moves, so ScrollTrigger isn't needed.
 */
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { Observer } from 'gsap/Observer';

let isRegistered = false;

export function initGSAP() {
  if (typeof window === 'undefined' || isRegistered) return gsap;
  gsap.registerPlugin(SplitText, DrawSVGPlugin, CustomEase, Observer);
  // The site's one easing: a quick start that settles slowly, like a pen stroke.
  CustomEase.create('stroke', 'M0,0 C0.18,0.7 0.24,1 1,1');
  gsap.defaults({ ease: 'stroke', duration: 0.9 });
  isRegistered = true;
  return gsap;
}

/** Conditions every animated component checks with gsap.matchMedia(). */
export const MEDIA = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 900px)',
  finePointer: '(hover: hover) and (pointer: fine)',
};

export { gsap, SplitText, Observer };
