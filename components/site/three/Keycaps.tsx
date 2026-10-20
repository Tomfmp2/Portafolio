"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import Stage from "./Stage";

const INK = "#161616";
const PAPER = "#f2efe6";
const MARKER = "#d4ff3a";

/** Events shared with the email button in Contact. */
export const ENTER_HOVER = "contact:enter-hover";
export const ENTER_PRESS = "contact:enter-press";

type Key = { label: string; x: number; z: number; w: number; accent?: boolean };

// A fragment of a keyboard: save (Ctrl + S) and send (Enter).
const KEYS: Key[] = [
  { label: "Tab", x: -1.55, z: -1.05, w: 1.5 },
  { label: "Ctrl", x: -1.55, z: 1.05, w: 1.5 },
  { label: "S", x: 0.05, z: 0, w: 1 },
  { label: "Shift", x: -1.3, z: 0, w: 2 },
  { label: "Enter", x: 1.55, z: -0.55, w: 2.1, accent: true },
];

function useLegend(label: string, accent: boolean) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-bricolage").trim() || "sans-serif";
      ctx.fillStyle = INK;
      ctx.font = `700 ${label.length > 1 ? 70 : 110}px ${family}`;
      ctx.textBaseline = "top";
      ctx.fillText(label, 28, 28);
      if (accent) ctx.fillRect(28, 200, 120, 10);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, [label, accent]);
}

function Keycap({ k, externalPress }: { k: Key; externalPress: boolean }) {
  const mesh = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const legend = useLegend(k.label, Boolean(k.accent));
  useEffect(() => () => legend.dispose(), [legend]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const pressed = hovered || externalPress;
    mesh.current.position.y = THREE.MathUtils.damp(mesh.current.position.y, pressed ? -0.18 : 0, 14, delta);
  });

  const width = k.w * 0.92;
  return (
    <group
      ref={mesh}
      position={[k.x, 0, k.z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={() => k.accent && window.dispatchEvent(new Event(ENTER_PRESS))}
    >
      <RoundedBox args={[width, 0.6, 0.92]} radius={0.14} smoothness={4}>
        <meshPhysicalMaterial color={k.accent ? MARKER : PAPER} roughness={0.45} clearcoat={0.6} clearcoatRoughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.305, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[Math.min(width, 0.9) * 0.9, 0.8]} />
        <meshBasicMaterial map={legend} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

function Keyboard() {
  const group = useRef<THREE.Group>(null);
  const [enterDown, setEnterDown] = useState(false);

  useEffect(() => {
    const onHover = (e: Event) => setEnterDown((e as CustomEvent<boolean>).detail);
    window.addEventListener(ENTER_HOVER, onHover);
    return () => window.removeEventListener(ENTER_HOVER, onHover);
  }, []);

  useFrame(({ gl }, delta) => {
    const g = group.current;
    if (!g) return;
    // Turn with the scroll while the canvas crosses the viewport (0 entering, 1 leaving).
    const r = gl.domElement.getBoundingClientRect();
    const progress = THREE.MathUtils.clamp(1 - (r.top + r.height) / (window.innerHeight + r.height), 0, 1);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.75 + progress * 0.9, 5, delta);
  });

  return (
    <group ref={group} rotation={[0.62, -0.6, 0]}>
      <RoundedBox args={[5.9, 0.35, 3.5]} radius={0.2} smoothness={4} position={[0, -0.42, 0]}>
        <meshPhysicalMaterial color={INK} roughness={0.5} clearcoat={0.4} />
      </RoundedBox>
      {KEYS.map((k) => (
        <Keycap key={k.label} k={k} externalPress={Boolean(k.accent) && enterDown} />
      ))}
    </group>
  );
}

export default function Keycaps({ className = "" }: { className?: string }) {
  return (
    <Stage className={className} camera={[0, 4.2, 7]} fov={36}>
      <Keyboard />
    </Stage>
  );
}
