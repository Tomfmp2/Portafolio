"use client";

import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { getLenisInstance, scrollToTarget } from '@/lib/lenis';

export function useLenis() {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    setLenis(getLenisInstance());
  }, []);

  return {
    lenis,
    scrollTo: scrollToTarget,
  };
}
