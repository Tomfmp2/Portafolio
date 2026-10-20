"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { isWriting, pen } from "@/lib/pen";
import { onIntro } from "@/lib/intro";

const INK = "#161616";
const PAPER = "#f2efe6";
const MARKER = "#d4ff3a";

/** Distance from the barrel's centre to the end of the chisel tip, in model units. */
const TIP = 2.13;
/** Writing pose: barrel rising up and to the right of the tip, like a right hand holds it. */
const WRITE_ROT = new THREE.Euler(0.35, -0.45, 2.5);

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

/** The highlighter, modelled along +Y with the chisel tip at the origin and the cap posted on the back. */
function Highlighter() {
  const label = useLabel();
  const plastic = useMemo(() => new THREE.MeshPhysicalMaterial({ color: INK, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.2 }), []);
  const lime = useMemo(() => new THREE.MeshPhysicalMaterial({ color: MARKER, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 }), []);
  const felt = useMemo(() => new THREE.MeshStandardMaterial({ color: MARKER, roughness: 0.95 }), []);
  useEffect(() => () => [label, plastic, lime, felt].forEach((r) => r.dispose()), [label, plastic, lime, felt]);

  return (
    <group position-y={-TIP}>
      <group scale={[1, 1, 0.74]}>
        <mesh material={plastic}>
          <cylinderGeometry args={[0.42, 0.42, 3, 48]} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.425, 0.425, 1.5, 48, 1, true]} />
          <meshStandardMaterial map={label} roughness={0.8} />
        </mesh>
        <mesh material={plastic} position={[0, 1.62, 0]}>
          <cylinderGeometry args={[0.26, 0.42, 0.24, 48]} />
        </mesh>
        {/* Cap posted on the back end, the way you hold an open highlighter */}
        <mesh material={lime} position={[0, -1.85, 0]}>
          <cylinderGeometry args={[0.47, 0.47, 1.25, 48]} />
        </mesh>
        <mesh material={lime} position={[0.45, -1.7, 0]}>
          <boxGeometry args={[0.1, 0.95, 0.22]} />
        </mesh>
      </group>
      <mesh material={felt} position={[0, 1.92, 0]} rotation={[0, 0, 0.32]}>
        <boxGeometry args={[0.34, 0.42, 0.16]} />
      </mesh>
    </group>
  );
}

function Rig() {
  const rig = useRef<THREE.Group>(null);
  const { size } = useThree();
  const live = useRef({ appear: 0, target: 0, lastY: 0, spin: 0, pointerX: 0, pointerY: 0, blend: 0 });
  const restRot = useMemo(() => new THREE.Euler(), []);
  const goal = useMemo(() => new THREE.Vector3(), []);
  const rest = useMemo(() => new THREE.Vector3(), []);
  const write = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const s = live.current;
    s.lastY = window.scrollY;
    const onMove = (e: PointerEvent) => {
      s.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      s.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const off = onIntro(() => (s.target = 1));
    return () => {
      window.removeEventListener("pointermove", onMove);
      off();
    };
  }, []);

  useFrame((state, rawDelta) => {
    const g = rig.current;
    if (!g) return;
    const dt = Math.min(rawDelta, 0.05);
    const s = live.current;
    const { width: w, height: h } = size;
    const mobile = w < 900;
    const writing = isWriting();

    // Scroll speed spins the pen while it rests (and settles when scrolling stops).
    const y = window.scrollY;
    const velocity = (y - s.lastY) / Math.max(dt, 1e-3);
    s.lastY = y;
    s.spin += THREE.MathUtils.clamp(velocity, -4000, 4000) * 0.00004;
    s.spin = THREE.MathUtils.damp(s.spin, 0, 1.5, dt);
    s.appear = THREE.MathUtils.damp(s.appear, s.target, 2.5, dt);

    // One continuous blend between resting and writing instead of a hard switch,
    // so the pen visibly travels to the phrase and back.
    s.blend = THREE.MathUtils.damp(s.blend, writing ? 1 : 0, writing ? 3.2 : 1.6, dt);
    const k = s.blend;

    // Resting places: big beside the name on the hero (scrolling away with it), small in the margin below.
    const onHero = y < h * 0.45;
    const t = state.clock.elapsedTime;
    if (onHero) rest.set((mobile ? 0.28 : 0.27) * w, (mobile ? 0.38 : 0.24) * h + y + Math.sin(t * 1.1) * 8, 0);
    else rest.set((mobile ? 0.5 : 0.44) * w, -0.18 * h + Math.sin(t * 0.9) * 10, 0);
    const restScale = onHero ? (mobile ? 42 : 78) : mobile ? 26 : 44;
    restRot.set(0.5 + s.pointerY * 0.2, -0.6 + s.pointerX * 0.4 + s.spin, onHero ? -1.05 : -0.4 + s.spin * 0.5);

    write.set(pen.x - w / 2, h / 2 - pen.y, 0);
    goal.lerpVectors(rest, write, k);
    const scale = THREE.MathUtils.lerp(restScale, mobile ? 34 : 56, k);

    // Loose while travelling, tight once it is actually writing, so the tip stays on the stroke.
    const lambda = THREE.MathUtils.lerp(3, 11, k * k);
    g.position.x = THREE.MathUtils.damp(g.position.x, goal.x, lambda, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, goal.y - (1 - s.appear) * h * 0.6, lambda, dt);
    const sway = Math.sin(t * 6) * 0.025 * k;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, THREE.MathUtils.lerp(restRot.x, WRITE_ROT.x, k), 3, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, THREE.MathUtils.lerp(restRot.y, WRITE_ROT.y, k) + sway, 3, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, THREE.MathUtils.lerp(restRot.z, WRITE_ROT.z, k), 3, dt);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, scale * s.appear + 0.001, 3, dt));
  });

  return (
    <group ref={rig}>
      <Highlighter />
    </group>
  );
}

/**
 * A fixed, click-through layer over the whole page with the 3D highlighter.
 * Orthographic camera: one unit is one CSS pixel, so the tip lands exactly on
 * the text it highlights.
 */
export default function Pen() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true">
      <Canvas orthographic camera={{ position: [0, 0, 500], near: 1, far: 2000, zoom: 1 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[300, 500, 400]} intensity={1.6} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[6, 2, 1]} />
          <Lightformer form="rect" intensity={1.5} position={[-5, 1, 2]} rotation-y={Math.PI / 3} scale={[3, 5, 1]} />
          <Lightformer form="rect" intensity={1} color={MARKER} position={[5, -1, 1]} rotation-y={-Math.PI / 3} scale={[2, 4, 1]} />
        </Environment>
        <Rig />
      </Canvas>
    </div>
  );
}
