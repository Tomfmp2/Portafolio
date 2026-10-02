"use client";

import { useEffect, useState } from 'react';
import { getPerformanceConfig, PerformanceConfig } from '@/lib/performance';

export function usePerformanceTier(): PerformanceConfig {
  const [config, setConfig] = useState<PerformanceConfig>(() => getPerformanceConfig());

  useEffect(() => {
    const handleResize = () => {
      setConfig(getPerformanceConfig());
    };

    window.addEventListener('resize', handleResize);
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => {
      setConfig(getPerformanceConfig());
    };
    
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return config;
}
