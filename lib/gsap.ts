/**
 * GSAP + ScrollTrigger Core Infrastructure & Utilities
 * Single point of initialization and cleanup for GSAP in Next.js.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { checkReducedMotion } from './performance';

let isRegistered = false;

/**
 * Initializes and registers GSAP plugins safely on client side.
 */
export function initGSAP() {
  if (typeof window === 'undefined') return gsap;
  if (!isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    
    // Configure default GSAP defaults
    gsap.defaults({
      ease: 'power3.out',
      duration: 1,
    });

    isRegistered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };

/**
 * Helper to create a GSAP context for safe React component lifecycle cleanup.
 */
export function createGSAPContext(func: (self: gsap.Context) => void, scope?: Element | string | object) {
  initGSAP();
  return gsap.context(func, scope);
}

/**
 * Text reveal animation utility using GSAP & ScrollTrigger.
 */
export function revealText(
  targets: gsap.TweenTarget,
  vars: Omit<gsap.TweenVars, 'scrollTrigger'> & { scrollTrigger?: ScrollTrigger.Vars } = {}
) {
  initGSAP();
  if (checkReducedMotion()) {
    return gsap.set(targets, { opacity: 1, y: 0 });
  }

  const { scrollTrigger, ...rest } = vars;

  return gsap.fromTo(
    targets,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: scrollTrigger ? {
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        ...scrollTrigger,
      } : undefined,
      ...rest,
    }
  );
}

/**
 * Parallax scroll utility using GSAP ScrollTrigger.
 */
export function createParallax(
  target: HTMLElement | string,
  speed: number = 0.2,
  trigger?: HTMLElement | string
) {
  initGSAP();
  if (checkReducedMotion()) return null;

  const yMovement = speed * 100;
  const triggerEl = trigger || target;

  return gsap.to(target, {
    y: `${yMovement}px`,
    ease: 'none',
    scrollTrigger: {
      trigger: triggerEl,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/**
 * Section pinning utility using GSAP ScrollTrigger.
 */
export function createPin(
  target: HTMLElement | string,
  pinSpacing: boolean = true,
  extraVars: Partial<ScrollTrigger.StaticVars> = {}
) {
  initGSAP();
  if (checkReducedMotion()) return null;

  return ScrollTrigger.create({
    trigger: target,
    pin: true,
    pinSpacing,
    start: 'top top',
    end: '+=100%',
    scrub: 1,
    ...extraVars,
  });
}
