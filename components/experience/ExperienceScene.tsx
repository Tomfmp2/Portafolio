"use client";

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleCloud, { type ParticleCloudProps } from "./ParticleCloud";
import { scrollState } from "@/lib/experience/chapters";

/** Distant static stars: they turn a little with the chapters to give the camera parallax. */
function Starfield({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const r = 18 + Math.random() * 14;
      const s = Math.sqrt(1 - u * u);
      positions.set([Math.cos(a) * s * r, u * r, Math.sin(a) * s * r], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: "#C9C4F2",
      size: 1.6,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    return new THREE.Points(geometry, material);
  }, [count]);

  useEffect(() => () => {
    points.geometry.dispose();
    (points.material as THREE.Material).dispose();
  }, [points]);

  useFrame(() => {
    points.rotation.y = scrollState.chapter * 0.12;
    if (!reducedMotion) points.rotation.x = scrollState.chapter * 0.03;
  });

  return <primitive object={points} />;
}

export default function ExperienceScene(props: ParticleCloudProps) {
  return (
    <>
      <Starfield count={props.isMobile ? 500 : 1200} reducedMotion={props.reducedMotion} />
      <ParticleCloud {...props} />
    </>
  );
}
