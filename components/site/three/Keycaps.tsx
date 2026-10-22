"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { MARKER, PAPER } from "@/lib/palette";
import Stage from "./Stage";

// A shade under the page ink: lit plastic reads lighter than its colour.
const INK = "#161616";

/** Events shared with the email button in Contact. */
export const ENTER_HOVER = "contact:enter-hover";
export const ENTER_PRESS = "contact:enter-press";

type Key = { label: string; x: number; z: number; w: number; accent?: boolean };

/** Key pitch: a 1u cap is 0.92 wide with a 0.14 gap, like a real board. */
const U = 1;
const GAP = 0.14;
const CAP = 0.92;

/**
 * A two-row macropad: save (Ctrl + S) and send (Enter) on top, Esc, Shift and
 * Tab under them. Rows are laid out from their widths, so every gap matches.
 */
const ROWS: { label: string; w: number; accent?: boolean }[][] = [
  [{ label: "Ctrl", w: 1.5 }, { label: "S", w: 1 }, { label: "Enter", w: 2, accent: true }],
  [{ label: "Esc", w: 1 }, { label: "Shift", w: 2.25 }, { label: "Tab", w: 1.25 }],
];
const ROW_WIDTH = 4.5 * U + 2 * GAP;
const KEYS: Key[] = ROWS.flatMap((row, r) => {
  let x = -ROW_WIDTH / 2;
  return row.map((k) => {
    const w = k.w * U;
    const key = { ...k, x: x + w / 2, z: (r - 0.5) * (CAP + GAP), w };
    x += w + GAP;
    return key;
  });
});
/** The plate: the keys plus an even margin. */
const PLATE = { w: ROW_WIDTH + 0.5, d: 2 * CAP + GAP + 0.5 };

function useLegend(label: string, accent: boolean) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-geo").trim() || "sans-serif";
      ctx.fillStyle = INK;
      ctx.font = `700 ${label.length > 1 ? 64 : 104}px ${family}`;
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

  const width = k.w - GAP;
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
      <RoundedBox args={[width, 0.55, CAP]} radius={0.12} smoothness={4}>
        <meshPhysicalMaterial color={k.accent ? MARKER : PAPER} roughness={0.45} clearcoat={0.6} clearcoatRoughness={0.4} />
      </RoundedBox>
      <mesh position={[-(width - CAP) / 2, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
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

  // Tilts toward the pointer anywhere on the page, and drifts slowly on its own.
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.32 + pointer.current.x * 0.5 + Math.sin(t * 0.5) * 0.04, 4, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.5 + pointer.current.y * 0.25, 4, delta);
    g.position.y = Math.sin(t * 0.8) * 0.06;
  });

  return (
    <group ref={group} rotation={[0.5, -0.32, 0]}>
      <RoundedBox args={[PLATE.w, 0.32, PLATE.d]} radius={0.16} smoothness={4} position={[0, -0.36, 0]}>
        <meshPhysicalMaterial color={INK} roughness={0.5} clearcoat={0.4} />
      </RoundedBox>
      {KEYS.map((k) => (
        <Keycap key={k.label} k={k} externalPress={Boolean(k.accent) && enterDown} />
      ))}
    </group>
  );
}

export default function Keycaps({ className = "", active = true }: { className?: string; active?: boolean }) {
  return (
    <Stage className={className} active={active} camera={[0, 2.6, 7.4]} fov={30}>
      <Keyboard />
    </Stage>
  );
}
