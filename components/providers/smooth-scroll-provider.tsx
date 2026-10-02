"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initLenis, destroyLenis, scrollToTarget } from '@/lib/lenis';
import { ScrollTrigger } from '@/lib/gsap';
import 'lenis/dist/lenis.css';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Lenis + GSAP sync once
    const lenis = initLenis();

    // Intercept in-page anchor links for smooth Lenis scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');

      if (anchor && anchor.hash && anchor.origin === window.location.origin && anchor.pathname === window.location.pathname) {
        e.preventDefault();
        scrollToTarget(anchor.hash);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      destroyLenis();
    };
  }, []);

  // Refresh ScrollTrigger positions on route changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, [pathname]);

  return <>{children}</>;
}
