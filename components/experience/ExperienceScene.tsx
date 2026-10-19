"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import type { ChromaticAberrationEffect } from "postprocessing";
import * as THREE from "three";
import ParticleCloud, { type ParticleCloudProps } from "./ParticleCloud";
import Floppies, { type FloppyItem } from "./Floppies";
import World from "./World";
import { journey } from "@/lib/experience/chapters";

/** Colour fringing that only shows up at speed, so travel feels fast and rest stays clean. */
function Effects() {
  const aberration = useRef<ChromaticAberrationEffect>(null);
  const offset = useRef(new THREE.Vector2());
  useFrame(() => {
    const k = 0.0004 + journey.warp * 0.0035;
    offset.current.set(k, k * 0.6);
    if (aberration.current) aberration.current.offset = offset.current;
  });
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.25} luminanceSmoothing={0.3} radius={0.7} />
      <ChromaticAberration ref={aberration} offset={offset.current} radialModulation={false} modulationOffset={0} />
      <Vignette offset={0.25} darkness={0.75} />
    </EffectComposer>
  );
}

interface SceneProps extends ParticleCloudProps {
  floppies: FloppyItem[];
  levels: string[];
  effects: boolean;
}

export default function ExperienceScene({ floppies, levels, effects, ...props }: SceneProps) {
  const dpr = useThree((state) => state.viewport.dpr);
  return (
    <>
      <World labels={levels} fonts={props.fonts} isMobile={props.isMobile} reducedMotion={props.reducedMotion} pixelRatio={dpr} />
      <ParticleCloud {...props} />
      <Floppies items={floppies} fonts={props.fonts} isMobile={props.isMobile} />
      {effects && <Effects />}
    </>
  );
}
