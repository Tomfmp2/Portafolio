"use client";

import { useLayoutEffect, useEffect, useRef } from 'react';
import { createGSAPContext, gsap } from '@/lib/gsap';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface UseGSAPOptions {
  scope?: React.RefObject<HTMLElement | null> | HTMLElement | string;
  dependencies?: React.DependencyList;
}

/**
 * Custom hook to safely handle GSAP animations and ScrollTrigger context in React.
 * Automatically cleans up all animations, timelines, and triggers when component unmounts.
 */
export function useGSAP(
  callback: (context: gsap.Context) => void | (() => void),
  options: UseGSAPOptions = {}
) {
  const { scope, dependencies = [] } = options;
  const ctxRef = useRef<gsap.Context | null>(null);

  useIsomorphicLayoutEffect(() => {
    const scopeElement =
      typeof scope === 'object' && scope !== null && 'current' in scope
        ? scope.current
        : scope;

    ctxRef.current = createGSAPContext((self) => {
      callback(self);
    }, scopeElement || undefined);

    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, dependencies);

  return ctxRef;
}
