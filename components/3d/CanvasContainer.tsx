"use client";

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { usePerformanceTier } from '@/hooks/use-performance-tier';
import { disposeThreeObject } from '@/lib/three-utils';
import * as THREE from 'three';

export interface CanvasContainerProps {
  children: React.ReactNode;
  className?: string;
  frameloop?: 'always' | 'demand' | 'never';
  camera?: Parameters<typeof Canvas>[0]['camera'];
  gl?: THREE.WebGLRendererParameters;
  onCreated?: (state: { gl: THREE.WebGLRenderer; scene: THREE.Scene }) => void;
}

/**
 * Optimized React Three Fiber Canvas Wrapper
 * Automatically tunes DPR, power preferences, context loss recovery, and memory cleanup.
 */
export default function CanvasContainer({
  children,
  className = 'w-full h-full min-h-[300px]',
  frameloop,
  camera = { position: [0, 0, 5], fov: 50 },
  gl = {},
  onCreated,
}: CanvasContainerProps) {
  const perfConfig = usePerformanceTier();
  const sceneRef = useRef<THREE.Scene | null>(null);

  const activeFrameloop = frameloop || perfConfig.frameloop;

  useEffect(() => {
    return () => {
      // Memory cleanup on unmount
      if (sceneRef.current) {
        disposeThreeObject(sceneRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Canvas
        dpr={[1, perfConfig.dpr]}
        frameloop={activeFrameloop}
        camera={camera}
        gl={{
          powerPreference: perfConfig.isLowPower ? 'low-power' : 'high-performance',
          antialias: !perfConfig.isMobile,
          alpha: true,
          ...gl,
        }}
        onCreated={(state) => {
          sceneRef.current = state.scene;

          // Configure WebGL Context Lost handling
          const canvasEl = state.gl.domElement;
          const handleContextLost = (event: Event) => {
            event.preventDefault();
            console.warn('WebGL context lost. Restoring when possible.');
          };
          canvasEl.addEventListener('webglcontextlost', handleContextLost, false);

          if (onCreated) {
            onCreated(state);
          }
        }}
      >
        {children}
      </Canvas>
    </div>
  );
}
