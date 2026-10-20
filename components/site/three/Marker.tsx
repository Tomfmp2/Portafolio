"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { onIntro } from "@/lib/intro";
import Stage from "./Stage";

const INK = "#161616";
const PAPER = "#f2efe6";
const MARKER = "#d4ff3a";

/** The label wrapped around the barrel: the wordmark, drawn once into a texture. */
function useLabel() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-bricolage").trim() || "sans-serif";
      ctx.fillStyle = INK;
      ctx.font = `800 120px ${family}`;
      ctx.textBaseline = "middle";
      ctx.fillText("Tomás Medina", 70, 132);
      ctx.fillStyle = MARKER;
      ctx.fillRect(0, 214, canvas.width, 42);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, []);
}

function MarkerModel() {
  const group = useRef<THREE.Group>(null);
  const cap = useRef<THREE.Group>(null);
  const label = useLabel();
  const state = useRef({ appear: 0, target: 0 });

  // The canvas lets clicks through to the hero's drawing layer, so track the pointer on the window.
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const offIntro = onIntro(() => (state.current.target = 1));
    return () => {
      window.removeEventListener("pointermove", onMove);
      offIntro();
    };
  }, []);
  useEffect(() => () => label.dispose(), [label]);

  const plastic = useMemo(() => new THREE.MeshPhysicalMaterial({ color: INK, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.2 }), []);
  const capMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: MARKER, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 }), []);
  const felt = useMemo(() => new THREE.MeshStandardMaterial({ color: MARKER, roughness: 0.95 }), []);
  useEffect(() => () => [plastic, capMaterial, felt].forEach((m) => m.dispose()), [plastic, capMaterial, felt]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const s = state.current;
    const p = pointer.current;
    s.appear = THREE.MathUtils.damp(s.appear, s.target, 3, delta);
    // Scrolling through the hero turns the marker over and lifts it away (depth parallax).
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    g.scale.setScalar(0.001 + s.appear * 0.999);
    g.position.y = THREE.MathUtils.damp(g.position.y, -1.2 * (1 - s.appear) + scroll * 1.6, 4, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.35 + p.y * 0.25 + scroll * 0.6, 4, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.5 + p.x * 0.5 + scroll * 2.2, 4, delta);
    if (cap.current) cap.current.position.y = 2.75 + Math.sin(performance.now() / 900) * 0.06 + scroll * 0.8;
  });

  return (
    <group ref={group} rotation={[0.35, -0.5, -0.85]} position-x={-0.5}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        {/* Barrel, slightly flattened like a real highlighter */}
        <group scale={[1, 1, 0.74]}>
          <mesh material={plastic}>
            <cylinderGeometry args={[0.42, 0.42, 3, 48]} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.425, 0.425, 1.5, 48, 1, true]} />
            <meshStandardMaterial map={label} roughness={0.8} />
          </mesh>
          <mesh material={plastic} position={[0, -1.58, 0]}>
            <cylinderGeometry args={[0.36, 0.42, 0.16, 48]} />
          </mesh>
          <mesh material={plastic} position={[0, 1.62, 0]}>
            <cylinderGeometry args={[0.26, 0.42, 0.24, 48]} />
          </mesh>
        </group>
        {/* Chisel tip */}
        <mesh material={felt} position={[0, 1.92, 0]} rotation={[0, 0, 0.32]}>
          <boxGeometry args={[0.34, 0.42, 0.16]} />
        </mesh>
        {/* The cap, off the pen and floating beside it */}
        <group ref={cap} position={[0.35, 2.75, 0.1]} rotation={[0, 0, -0.18]}>
          <mesh material={capMaterial} scale={[1, 1, 0.76]}>
            <cylinderGeometry args={[0.47, 0.47, 1.25, 48]} />
          </mesh>
          <mesh material={capMaterial} position={[0.44, -0.15, 0]}>
            <boxGeometry args={[0.1, 0.95, 0.22]} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

export default function Marker({ className = "" }: { className?: string }) {
  return (
    <Stage className={className} camera={[0, 0.4, 12]} fov={32}>
      <MarkerModel />
    </Stage>
  );
}
