/**
 * Performance Infrastructure & Device Tier Utility
 * Ensures optimal DPR, particle counts, postprocessing toggles and reduced-motion compliance.
 */

export interface PerformanceConfig {
  isMobile: boolean;
  isLowPower: boolean;
  reducedMotion: boolean;
  dpr: number;
  maxParticles: number;
  enablePostprocessing: boolean;
  frameloop: 'always' | 'demand';
}

/**
 * Checks if the user prefers reduced motion.
 */
export function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets performance metrics and optimal tier configuration based on device capabilities.
 */
export function getPerformanceConfig(): PerformanceConfig {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isLowPower: false,
      reducedMotion: false,
      dpr: 1,
      maxParticles: 500,
      enablePostprocessing: true,
      frameloop: 'always',
    };
  }

  const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const isLowPower = hardwareConcurrency <= 4 || isMobile;
  const reducedMotion = checkReducedMotion();

  // Optimal Device Pixel Ratio: cap to 2 for retina desktop, max 1.25/1.5 for mobile/low power
  const maxDPR = isMobile ? 1.25 : isLowPower ? 1.5 : 2;
  const rawDPR = window.devicePixelRatio || 1;
  const dpr = Math.min(rawDPR, maxDPR);

  // Particle limit tuning
  const maxParticles = isMobile ? 120 : isLowPower ? 250 : 600;

  // Postprocessing toggle (disable on low-end mobile to avoid shader bottlenecks)
  const enablePostprocessing = !isLowPower && !reducedMotion;

  // Frameloop: if reduced motion is on, use demand rendering
  const frameloop = reducedMotion ? 'demand' : 'always';

  return {
    isMobile,
    isLowPower,
    reducedMotion,
    dpr,
    maxParticles,
    enablePostprocessing,
    frameloop,
  };
}
