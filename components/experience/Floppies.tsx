"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/experience/chapters";
import { emit } from "@/lib/experience/store";
import { sound } from "@/lib/experience/sound";
import type { ShapeFonts } from "@/lib/experience/shapes";

export interface FloppyItem {
  name: string;
  stack: string;
  href: string;
  demoId?: string;
}

/** Chapter where the disks live (the "more projects" screen). */
const CHAPTER = 4;
const LABEL_COLORS = ["#F4B942", "#9C92F0", "#EDEBF7"];

/** Draws a 5¼" floppy sleeve with a handwritten-style label for one project. */
function floppyTexture(item: FloppyItem, index: number, fonts: ShapeFonts) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const c = canvas.getContext("2d")!;
  // Sleeve
  c.fillStyle = "#17142a";
  c.fillRect(0, 0, size, size);
  c.fillStyle = "rgba(255,255,255,0.035)";
  for (let i = 0; i < 900; i++) c.fillRect(Math.random() * size, Math.random() * size, 1.5, 1.5);
  // Write-protect notch
  c.fillStyle = "#07061a";
  c.fillRect(size - 22, 110, 22, 46);
  // Label
  c.fillStyle = "#EDEBF7";
  c.fillRect(36, 28, size - 72, 150);
  c.fillStyle = LABEL_COLORS[index % LABEL_COLORS.length];
  c.fillRect(36, 28, size - 72, 22);
  c.fillStyle = "#1c1650";
  c.font = `800 ${item.name.length > 14 ? 40 : 50}px ${fonts.display}`;
  c.textBaseline = "top";
  c.fillText(item.name, 56, 70, size - 112);
  c.font = `500 24px ${fonts.mono}`;
  c.fillStyle = "#352879";
  c.fillText(item.stack.toUpperCase(), 56, 132, size - 112);
  // Hub and index hole
  c.fillStyle = "#2a2547";
  c.beginPath();
  c.arc(size / 2, 310, 72, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#07061a";
  c.beginPath();
  c.arc(size / 2, 310, 36, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.arc(size / 2 + 98, 310, 9, 0, Math.PI * 2);
  c.fill();
  // Read window
  c.beginPath();
  c.roundRect(size / 2 - 22, 400, 44, 96, 22);
  c.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function Floppy({ item, index, total, fonts, isMobile }: { item: FloppyItem; index: number; total: number; fonts: ShapeFonts; isMobile: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);
  const lift = useRef(0);

  const materials = useMemo(() => {
    const edge = new THREE.MeshBasicMaterial({ color: "#100d20" });
    const front = new THREE.MeshBasicMaterial({ map: floppyTexture(item, index, fonts) });
    const back = new THREE.MeshBasicMaterial({ color: "#1f1a38" });
    return [edge, edge, edge, edge, front, back];
  }, [item, index, fonts]);

  useEffect(() => () => {
    materials.forEach((m) => {
      (m as THREE.MeshBasicMaterial).map?.dispose();
      m.dispose();
    });
  }, [materials]);

  // Fanned like a hand of cards.
  const spread = isMobile ? 0.3 : 0.34;
  const t = total > 1 ? index / (total - 1) - 0.5 : 0;
  const home = useMemo(() => new THREE.Vector3(t * spread * (total - 1), -Math.abs(t) * 0.25, Math.abs(t) * -0.15 + index * 0.012), [t, spread, total, index]);

  useFrame((_, dt) => {
    const mesh = ref.current;
    if (!mesh) return;
    lift.current += ((hovered.current ? 1 : 0) - lift.current) * (1 - Math.exp(-12 * Math.min(dt, 0.05)));
    mesh.position.set(home.x, home.y + lift.current * 0.22, home.z + lift.current * 0.25);
    mesh.rotation.set(-0.08 - lift.current * 0.12, -t * 0.5 * (1 - lift.current), -t * 0.35 * (1 - lift.current));
    mesh.scale.setScalar(1 + lift.current * 0.08);
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hovered.current = true;
    document.body.style.cursor = "pointer";
    sound.tick();
  };
  const onOut = () => {
    hovered.current = false;
    document.body.style.cursor = "";
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    sound.load();
    if (item.demoId) emit("demo", item.demoId);
    else window.open(item.href, "_blank", "noopener,noreferrer");
  };

  return (
    <mesh ref={ref} material={materials} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
      <boxGeometry args={[0.62, 0.62, 0.012]} />
    </mesh>
  );
}

/**
 * Project disks in front of the text-mode screen. They rise in as the visitor
 * reaches the chapter and drop away when leaving it; the DOM list beside them
 * offers the same actions for keyboard and screen-reader users.
 */
export default function Floppies({ items, fonts, isMobile }: { items: FloppyItem[]; fonts: ShapeFonts; isMobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const shown = useRef(0);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const target = Math.max(0, 1 - Math.abs(scrollState.chapter - CHAPTER) * 1.6);
    shown.current += (target - shown.current) * (1 - Math.exp(-6 * Math.min(dt, 0.05)));
    const v = shown.current;
    g.visible = v > 0.01;
    // Same anchor as the chapter's object offset, slightly toward the camera.
    if (isMobile) g.position.set(0, 0.55 - (1 - v) * 1.2, 1.1);
    else g.position.set(1.2, -0.5 - (1 - v) * 1.4, 1.2);
    g.scale.setScalar((isMobile ? 0.7 : 0.85) * (0.6 + v * 0.4));
  });

  useEffect(() => () => {
    document.body.style.cursor = "";
  }, []);

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <Floppy key={item.name} item={item} index={i} total={items.length} fonts={fonts} isMobile={isMobile} />
      ))}
    </group>
  );
}
