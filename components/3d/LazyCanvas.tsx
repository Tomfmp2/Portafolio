"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import type { CanvasContainerProps } from './CanvasContainer';

// Dynamically import CanvasContainer with SSR disabled to prevent initial bundle bloat
const CanvasContainer = dynamic(() => import('./CanvasContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-transparent">
      <div className="w-6 h-6 border-2 border-[#FF3333]/30 border-t-[#FF3333] rounded-full animate-spin" />
    </div>
  ),
});

export default function LazyCanvas(props: CanvasContainerProps) {
  return <CanvasContainer {...props} />;
}
