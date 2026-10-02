/**
 * Global Lenis Smooth Scroll Manager & GSAP Sync
 * Ensures a single global Lenis instance synchronized with GSAP ScrollTrigger ticker.
 */
import Lenis from 'lenis';
import { initGSAP, ScrollTrigger, gsap } from './gsap';
import { checkReducedMotion } from './performance';

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export function getLenisInstance(): Lenis | null {
  return lenisInstance;
}

export function initLenis(): Lenis | null {
  if (typeof window === 'undefined') return null;

  // If already created, return current instance
  if (lenisInstance) return lenisInstance;

  // Initialize GSAP first
  initGSAP();

  const isReducedMotion = checkReducedMotion();

  lenisInstance = new Lenis({
    duration: isReducedMotion ? 0 : 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: !isReducedMotion,
    touchMultiplier: 2,
    wheelMultiplier: 1,
  });

  // Synchronize Lenis scroll event with GSAP ScrollTrigger
  lenisInstance.on('scroll', () => {
    ScrollTrigger.update();
  });

  // Drive Lenis RAF loop via GSAP Ticker to prevent dual requestAnimationFrame loops
  tickerCallback = (time: number) => {
    if (lenisInstance) {
      lenisInstance.raf(time * 1000);
    }
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function destroyLenis() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

export function scrollToTarget(target: string | HTMLElement | number, options?: Parameters<Lenis['scrollTo']>[1]) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options,
    });
  } else if (typeof window !== 'undefined') {
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
