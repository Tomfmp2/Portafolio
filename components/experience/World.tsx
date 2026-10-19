"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CHAPTERS, STATION_GAP, journey, poseAt, stationAt } from "@/lib/experience/chapters";
import type { ShapeFonts } from "@/lib/experience/shapes";

/*
 * Everything the camera flies past on its way between stations. None of it
 * carries content: it exists to give depth cues (parallax, perspective lines,
 * things passing by) so scrolling reads as travelling, not as slides changing.
 */

const PHOSPHOR = "#9C92F0";
const PAPER = "#EDEBF7";
const SIGNAL = "#F4B942";
const C64 = "#352879";

/** Path span covered by scenery, in chapter units (a little before the first and after the last). */
const PATH_START = -0.4;
const PATH_END = CHAPTERS.length - 1 + 0.6;
const FLOOR_Y = -4.2;

function useDisposable<T extends { dispose(): void }>(items: T[]) {
  useEffect(() => () => items.forEach((item) => item.dispose()), [items]);
}

/** Random point on a ring around the path: close enough to pass by, never on the flight line. */
function aroundPath(minRadius: number, spread: number, out: THREE.Vector3) {
  const v = PATH_START + Math.random() * (PATH_END - PATH_START);
  const [x, y, z] = stationAt(v);
  const angle = Math.random() * Math.PI * 2;
  const r = minRadius + Math.pow(Math.random(), 0.7) * spread;
  return out.set(x + 1.2 + Math.cos(angle) * r, y + Math.sin(angle) * r * 0.65, z + (Math.random() - 0.5) * 4);
}

/* ---------- Dust and warp streaks ---------- */

const dustVertex = /* glsl */ `
  attribute float aSeed;
  attribute float aTail;
  uniform float uWarp;
  uniform float uPixel;
  uniform float uLine;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    // Line mode: the tail vertex trails behind along +z, longer the faster we fly.
    pos.z += aTail * uWarp * (1.5 + aSeed * 7.0);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uPixel * (0.6 + aSeed) / -mv.z, 1.0, 4.0);
    float depth = -mv.z;
    // Fade in out of the distance and out right before it hits the lens.
    float fade = smoothstep(70.0, 25.0, depth) * smoothstep(0.5, 3.0, depth);
    vAlpha = fade * mix(0.7, uWarp * (1.0 - aTail * 0.9), uLine);
  }
`;

const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uLine;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = mix(smoothstep(0.5, 0.1, d), 1.0, uLine);
    if (disc * vAlpha < 0.01) discard;
    gl_FragColor = vec4(uColor, disc * vAlpha);
  }
`;

function Dust({ count, pixelRatio }: { count: number; pixelRatio: number }) {
  const { points, lines, disposables } = useMemo(() => {
    const p = new THREE.Vector3();
    const pointPos = new Float32Array(count * 3);
    const pointSeed = new Float32Array(count);
    const linePos = new Float32Array(count * 6);
    const lineSeed = new Float32Array(count * 2);
    const lineTail = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      aroundPath(2.5, 20, p);
      const seed = Math.random();
      pointPos.set([p.x, p.y, p.z], i * 3);
      pointSeed[i] = seed;
      linePos.set([p.x, p.y, p.z, p.x, p.y, p.z], i * 6);
      lineSeed.set([seed, seed], i * 2);
      lineTail.set([0, 1], i * 2);
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(pointPos, 3));
    pointGeo.setAttribute("aSeed", new THREE.BufferAttribute(pointSeed, 1));
    pointGeo.setAttribute("aTail", new THREE.BufferAttribute(new Float32Array(count), 1));

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    lineGeo.setAttribute("aSeed", new THREE.BufferAttribute(lineSeed, 1));
    lineGeo.setAttribute("aTail", new THREE.BufferAttribute(lineTail, 1));

    const material = (line: boolean, color: string) =>
      new THREE.ShaderMaterial({
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uWarp: { value: 0 },
          uPixel: { value: 90 * pixelRatio },
          uLine: { value: line ? 1 : 0 },
          uColor: { value: new THREE.Color(color) },
        },
      });
    const pointMat = material(false, PAPER);
    const lineMat = material(true, PHOSPHOR);
    return {
      points: new THREE.Points(pointGeo, pointMat),
      lines: new THREE.LineSegments(lineGeo, lineMat),
      disposables: [pointGeo, lineGeo, pointMat, lineMat],
    };
  }, [count, pixelRatio]);
  useDisposable(disposables);

  useFrame(() => {
    (points.material as THREE.ShaderMaterial).uniforms.uWarp.value = journey.warp;
    (lines.material as THREE.ShaderMaterial).uniforms.uWarp.value = journey.warp;
    lines.visible = journey.warp > 0.02;
  });

  return (
    <>
      <primitive object={points} frustumCulled={false} />
      <primitive object={lines} frustumCulled={false} />
    </>
  );
}

/* ---------- Retro floor grid ---------- */

const floorVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const floorFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uGlow;
  uniform vec3 uCamera;
  uniform float uWarp;
  varying vec3 vWorld;

  void main() {
    vec2 cell = vWorld.xz / 2.0;
    vec2 grid = abs(fract(cell - 0.5) - 0.5) / fwidth(cell);
    float line = 1.0 - min(min(grid.x, grid.y), 1.0);
    float dist = length(vWorld.xz - uCamera.xz);
    float fade = exp(-dist * 0.035);
    // Lines nearest the camera brighten as speed builds.
    vec3 color = mix(uColor, uGlow, exp(-dist * 0.08) * (0.35 + uWarp * 0.65));
    gl_FragColor = vec4(color, line * fade * 0.6);
  }
`;

function Floor() {
  const { camera } = useThree();
  const { mesh, disposables } = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(260, 260);
    geometry.rotateX(-Math.PI / 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: floorVertex,
      fragmentShader: floorFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: new THREE.Color("#5a4bc4") },
        uGlow: { value: new THREE.Color(PHOSPHOR) },
        uCamera: { value: new THREE.Vector3() },
        uWarp: { value: 0 },
      },
    });
    return { mesh: new THREE.Mesh(geometry, material), disposables: [geometry, material] };
  }, []);
  useDisposable(disposables);

  useFrame(() => {
    // The plane rides under the camera; the grid is drawn in world space, so it still slides past.
    mesh.position.set(camera.position.x, FLOOR_Y, camera.position.z - 90);
    const u = (mesh.material as THREE.ShaderMaterial).uniforms;
    (u.uCamera.value as THREE.Vector3).copy(camera.position);
    u.uWarp.value = journey.warp;
  });

  return <primitive object={mesh} />;
}

/* ---------- Gates between chapters ---------- */

function roundedRect(w: number, h: number, r: number) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

/** A frame band: the outline of a rounded rectangle with a given thickness. */
function frameGeometry(w: number, h: number, r: number, band: number) {
  const outer = roundedRect(w, h, r);
  outer.holes.push(roundedRect(w - band * 2, h - band * 2, Math.max(r - band, 0.01)));
  return new THREE.ShapeGeometry(outer, 12);
}

function labelTexture(text: string, fonts: ShapeFonts) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.font = `500 52px ${fonts.mono}`;
    ctx.fillStyle = PAPER;
    ctx.textBaseline = "middle";
    ctx.fillText(text, 8, 50);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

const GATE_W = 16;
const GATE_H = 9;

function Gates({ labels, fonts, isMobile }: { labels: string[]; fonts: ShapeFonts; isMobile: boolean }) {
  const { camera } = useThree();
  const { gates, disposables } = useMemo(() => {
    const outer = frameGeometry(GATE_W, GATE_H, 1, 0.08);
    const inner = frameGeometry(GATE_W - 0.8, GATE_H - 0.8, 0.7, 0.025);
    const labelGeo = new THREE.PlaneGeometry(4.8, 0.45);
    const owned: { dispose(): void }[] = [outer, inner, labelGeo];

    const list = CHAPTERS.slice(1).map((_, k) => {
      const i = k + 1;
      // Halfway between stations, centred on the camera's line so the flight goes right through it.
      const v = i - 0.5;
      const [sx, sy, sz] = stationAt(v);
      const pose = poseAt(v, isMobile);
      const group = new THREE.Group();
      group.position.set(sx + pose.offset[0] + pose.camera[0] - (isMobile ? 0 : 0.8), sy + pose.offset[1] + pose.camera[1] - 0.3, sz);

      const frameMat = new THREE.MeshBasicMaterial({ color: PHOSPHOR, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const innerMat = new THREE.MeshBasicMaterial({ color: SIGNAL, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const texture = labelTexture(`${String(i + 1).padStart(2, "0")} / ${labels[i] ?? ""}`.toUpperCase(), fonts);
      const labelMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
      owned.push(frameMat, innerMat, labelMat, texture);

      group.add(new THREE.Mesh(outer, frameMat));
      group.add(new THREE.Mesh(inner, innerMat));
      const label = new THREE.Mesh(labelGeo, labelMat);
      label.position.set(-GATE_W / 2 + 2.9, GATE_H / 2 - 0.85, 0);
      group.add(label);
      return { group, materials: [frameMat, innerMat, labelMat], weights: [0.9, 0.35, 0.85] };
    });
    return { gates: list, disposables: owned };
  }, [labels, fonts, isMobile]);
  useDisposable(disposables);

  useFrame(({ clock }) => {
    const pulse = 0.85 + Math.sin(clock.elapsedTime * 2.2) * 0.15;
    for (const gate of gates) {
      // Positive while the gate is still ahead of the lens.
      const ahead = camera.position.z - gate.group.position.z;
      const fade = THREE.MathUtils.smoothstep(ahead, -1.5, 3) * (1 - THREE.MathUtils.smoothstep(ahead, STATION_GAP * 0.9, STATION_GAP * 1.6));
      gate.group.visible = fade > 0.01;
      gate.materials.forEach((m, k) => (m.opacity = fade * gate.weights[k] * (k === 1 ? pulse : 1)));
    }
  });

  return (
    <>
      {gates.map((gate, i) => (
        <primitive key={i} object={gate.group} />
      ))}
    </>
  );
}

/* ---------- Floating pixel blocks ---------- */

function Blocks({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const { mesh, spin, disposables } = useMemo(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending });
    const instanced = new THREE.InstancedMesh(geometry, material, count);
    const palette = [new THREE.Color(C64).multiplyScalar(1.6), new THREE.Color(PHOSPHOR).multiplyScalar(0.5), new THREE.Color(SIGNAL).multiplyScalar(0.45)];
    const p = new THREE.Vector3();
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3();
    const spins: { pos: THREE.Vector3; rot: THREE.Euler; speed: number; size: number }[] = [];
    for (let i = 0; i < count; i++) {
      // Kept well off the flight line: a block that grazes the lens fills the screen.
      aroundPath(7.5, 14, p);
      const size = 0.12 + Math.pow(Math.random(), 3) * 0.4;
      const rot = e.set(Math.random() * 6, Math.random() * 6, 0).clone();
      spins.push({ pos: p.clone(), rot, speed: 0.1 + Math.random() * 0.4, size });
      m.compose(p, q.setFromEuler(rot), s.setScalar(size));
      instanced.setMatrixAt(i, m);
      // Mostly blue, some lavender, a rare amber one.
      const r = Math.random();
      instanced.setColorAt(i, palette[r > 0.93 ? 2 : r > 0.7 ? 1 : 0]);
    }
    return { mesh: instanced, spin: spins, disposables: [geometry, material] };
  }, [count]);
  useDisposable(disposables);

  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), e: new THREE.Euler(), s: new THREE.Vector3() }), []);
  useFrame((_, dt) => {
    if (reducedMotion) return;
    const step = Math.min(dt, 0.05);
    spin.forEach((b, i) => {
      b.rot.x += b.speed * step;
      b.rot.y += b.speed * 0.7 * step;
      tmp.m.compose(b.pos, tmp.q.setFromEuler(b.rot), tmp.s.setScalar(b.size));
      mesh.setMatrixAt(i, tmp.m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <primitive object={mesh} frustumCulled={false} />;
}

/* ---------- Backdrop stars ---------- */

/** Far stars that ride with the camera: they only turn, so they read as infinitely far away. */
function Starfield({ count }: { count: number }) {
  const { camera } = useThree();
  const { points, disposables } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const r = 60 + Math.random() * 20;
      const s = Math.sqrt(1 - u * u);
      positions.set([Math.cos(a) * s * r, u * r, Math.sin(a) * s * r], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: "#C9C4F2", size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.55, depthWrite: false, fog: false });
    return { points: new THREE.Points(geometry, material), disposables: [geometry, material] };
  }, [count]);
  useDisposable(disposables);

  useFrame(() => {
    points.position.copy(camera.position);
    points.rotation.y = journey.chapter * 0.12;
  });

  return <primitive object={points} frustumCulled={false} />;
}

export default function World({
  labels,
  fonts,
  isMobile,
  reducedMotion,
  pixelRatio,
}: {
  labels: string[];
  fonts: ShapeFonts;
  isMobile: boolean;
  reducedMotion: boolean;
  pixelRatio: number;
}) {
  return (
    <>
      <Starfield count={isMobile ? 500 : 1200} />
      <Floor />
      <Dust count={isMobile ? 900 : 2600} pixelRatio={pixelRatio} />
      <Blocks count={isMobile ? 70 : 180} reducedMotion={reducedMotion} />
      <Gates labels={labels} fonts={fonts} isMobile={isMobile} />
    </>
  );
}
