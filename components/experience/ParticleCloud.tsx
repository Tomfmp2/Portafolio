"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CHAPTERS, SHAPES, scrollState, type Pose, type ShapeKey } from "@/lib/experience/chapters";
import { buildProceduralShapes, loadBakedShape, type ShapeFonts } from "@/lib/experience/shapes";

const BAKED: Partial<Record<ShapeKey, string>> = {
  c64: "/particles/c64.bin",
  globe: "/particles/globe.bin",
};

// Palette tokens shared with globals.css (--phosphor, --signal, --paper).
const PHOSPHOR = new THREE.Color("#9C92F0");
const SIGNAL = new THREE.Color("#F4B942");
const PAPER = new THREE.Color("#EDEBF7");

const vertexShader = /* glsl */ `
  ${SHAPES.map((key) => `attribute vec3 a_${key};`).join("\n  ")}
  attribute vec4 aSeed;

  uniform float uWeights[${SHAPES.length}];
  uniform float uIntro;
  uniform float uTurbulence;
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;

  varying vec3 vColor;
  varying float vAlpha;

  uniform vec3 uPhosphor;
  uniform vec3 uSignal;
  uniform vec3 uPaper;

  void main() {
    vec3 target = ${SHAPES.map((key, i) => `a_${key} * uWeights[${i}]`).join(" + ")};
    // Before the first model arrives the cloud waits in its drift shape.
    vec3 pos = mix(a_drift, target, uIntro);

    // Turbulence peaks halfway through a morph, so particles visibly travel
    // instead of sliding in straight lines.
    float phase = uTime * 0.6;
    vec3 swirl = vec3(
      sin(pos.y * 3.1 + phase + aSeed.z * 6.2831),
      sin(pos.z * 2.7 + phase * 1.3 + aSeed.w * 6.2831),
      sin(pos.x * 3.3 + phase * 0.9 + aSeed.x * 6.2831)
    );
    pos += swirl * (0.006 + uTurbulence * 0.22) * (0.4 + aSeed.y);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * (0.55 + aSeed.x * 0.9) * uScale / -mv.z, 1.0, 9.0);

    vColor = aSeed.y > 0.88 ? uSignal : (aSeed.y > 0.8 ? uPaper : uPhosphor);
    // Fade particles far from the focal plane for depth.
    vAlpha = clamp(1.4 - (-mv.z - 3.5) * 0.12, 0.25, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.0, d);
    if (disc < 0.01) discard;
    // Low per-point alpha: additive blending sums overlaps, dense areas still glow.
    gl_FragColor = vec4(vColor, disc * disc * vAlpha * 0.5);
  }
`;

const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

/** Pose interpolated between the two chapters around `value`. */
function poseAt(value: number, mobile: boolean): Pose {
  const i = Math.min(Math.floor(value), CHAPTERS.length - 1);
  const j = Math.min(i + 1, CHAPTERS.length - 1);
  const t = value - i;
  const a = mobile ? CHAPTERS[i].mobile : CHAPTERS[i].desktop;
  const b = mobile ? CHAPTERS[j].mobile : CHAPTERS[j].desktop;
  const mix3 = (p: number[], q: number[]) => p.map((v, k) => v + (q[k] - v) * t) as [number, number, number];
  return {
    camera: mix3(a.camera, b.camera),
    offset: mix3(a.offset, b.offset),
    rotation: mix3(a.rotation, b.rotation),
    scale: a.scale + (b.scale - a.scale) * t,
  };
}

const ease = (t: number) => t * t * (3 - 2 * t);

export interface ParticleCloudProps {
  count: number;
  isMobile: boolean;
  reducedMotion: boolean;
  fonts: ShapeFonts;
}

export default function ParticleCloud({ count, isMobile, reducedMotion, fonts }: ParticleCloudProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl, invalidate } = useThree();
  const live = useRef({ chapter: scrollState.chapter, intro: 0, introTarget: 0, pointerX: 0, pointerY: 0 });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const procedural = buildProceduralShapes(count, fonts);
    SHAPES.forEach((key) => {
      const data = procedural[key] ?? new Float32Array(count * 3);
      geo.setAttribute(`a_${key}`, new THREE.BufferAttribute(data, 3));
    });
    // Three needs `position` for draw count; the shader ignores it.
    geo.setAttribute("position", geo.getAttribute("a_drift"));
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
    return geo;
  }, [count, fonts]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uWeights: { value: SHAPES.map((key) => (key === CHAPTERS[0].shape ? 1 : 0)) },
          uIntro: { value: 0 },
          uTurbulence: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: isMobile ? 0.04 : 0.032 },
          uScale: { value: 1 },
          uPhosphor: { value: PHOSPHOR },
          uSignal: { value: SIGNAL },
          uPaper: { value: PAPER },
        },
      }),
    [isMobile]
  );

  // Load the baked models; the hero assembles itself once the C64 arrives.
  useEffect(() => {
    const controller = new AbortController();
    Object.entries(BAKED).forEach(([key, url]) => {
      loadBakedShape(url, count, controller.signal)
        .then((data) => {
          const attr = geometry.getAttribute(`a_${key}`) as THREE.BufferAttribute;
          (attr.array as Float32Array).set(data);
          attr.needsUpdate = true;
          if (key === CHAPTERS[0].shape) live.current.introTarget = 1;
          invalidate();
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          // The site stays fully usable without the model; the hero just keeps its drift shape.
          console.warn(error);
        });
    });
    return () => controller.abort();
  }, [count, geometry, invalidate]);

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const onPointer = (e: PointerEvent) => {
      live.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      live.current.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, [reducedMotion, isMobile]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const dt = Math.min(rawDelta, 0.05);
    const s = live.current;
    const u = material.uniforms;

    // Reduced motion snaps to the scroll position instead of easing toward it.
    s.chapter = reducedMotion ? scrollState.chapter : damp(s.chapter, scrollState.chapter, 5, dt);
    s.intro = reducedMotion ? s.introTarget : damp(s.intro, s.introTarget, 1.6, dt);

    const base = Math.floor(s.chapter);
    const frac = s.chapter - base;
    const weights = u.uWeights.value as number[];
    weights.fill(0);
    const from = SHAPES.indexOf(CHAPTERS[Math.min(base, CHAPTERS.length - 1)].shape);
    const to = SHAPES.indexOf(CHAPTERS[Math.min(base + 1, CHAPTERS.length - 1)].shape);
    const t = ease(frac);
    weights[from] += 1 - t;
    weights[to] += t;

    u.uIntro.value = s.intro;
    u.uTurbulence.value = reducedMotion ? 0 : Math.sin(Math.PI * frac) + (1 - s.intro) * 0.6;
    if (!reducedMotion) u.uTime.value = state.clock.elapsedTime;
    const fov = (camera as THREE.PerspectiveCamera).fov ?? 40;
    u.uScale.value = gl.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2));

    const pose = poseAt(s.chapter, isMobile);
    const idle = reducedMotion ? 0 : state.clock.elapsedTime * 0.05;
    group.position.set(pose.offset[0], pose.offset[1], pose.offset[2]);
    group.rotation.set(
      pose.rotation[0] + s.pointerY * 0.08,
      pose.rotation[1] + Math.sin(idle) * 0.25 + s.pointerX * 0.18,
      pose.rotation[2]
    );
    group.scale.setScalar(pose.scale);

    camera.position.set(
      pose.offset[0] + pose.camera[0],
      pose.offset[1] + pose.camera[1],
      pose.offset[2] + pose.camera[2]
    );
    // Look to the left of the object so it sits off-center, beside the text column.
    lookAt.set(pose.offset[0] - (isMobile ? 0 : 1.6), pose.offset[1] - (isMobile ? 0.95 : 0), 0);
    camera.lookAt(lookAt);

    // Keep rendering while easing; stop once settled in demand mode.
    if (Math.abs(s.chapter - scrollState.chapter) > 0.001 || Math.abs(s.intro - s.introTarget) > 0.001) invalidate();
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
