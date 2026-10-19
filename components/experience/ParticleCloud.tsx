"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CHAPTERS, SHAPES, scrollState, type Pose, type ShapeKey } from "@/lib/experience/chapters";
import { buildProceduralShapes, loadBakedShape, type ShapeFonts } from "@/lib/experience/shapes";
import { interaction, setLevel, subscribe } from "@/lib/experience/store";
import { sound } from "@/lib/experience/sound";

const BAKED: Partial<Record<ShapeKey, string>> = {
  c64: "/particles/c64.bin",
  globe: "/particles/globe.bin",
};

// Palette tokens shared with globals.css (--phosphor, --signal, --paper).
const PHOSPHOR = new THREE.Color("#9C92F0");
const SIGNAL = new THREE.Color("#F4B942");
const PAPER = new THREE.Color("#EDEBF7");

const LAYERS_INDEX = SHAPES.indexOf("layers");
const GLOBE_INDEX = SHAPES.indexOf("globe");

const vertexShader = /* glsl */ `
  ${SHAPES.map((key) => `attribute vec3 a_${key};`).join("\n  ")}
  attribute vec4 aSeed;
  attribute float aLayer;

  uniform float uWeights[${SHAPES.length}];
  uniform float uIntro;
  uniform float uTurbulence;
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  uniform vec3 uPointer;
  uniform float uPointerForce;
  uniform vec3 uShockOrigin;
  uniform float uShockAge;
  uniform float uHighlight;
  uniform float uHighlightMix;

  uniform vec3 uPhosphor;
  uniform vec3 uSignal;
  uniform vec3 uPaper;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 target = ${SHAPES.map((key, i) => `a_${key} * uWeights[${i}]`).join(" + ")};
    // Before the visitor enters, the cloud waits in its drift shape.
    vec3 pos = mix(a_drift, target, uIntro);

    // Lift the hovered Clean Architecture ring (only meaningful while the layers shape is showing).
    float lifted = step(abs(aLayer - uHighlight), 0.5) * uHighlightMix * uWeights[${LAYERS_INDEX}];
    pos.y += lifted * 0.16;

    // The cursor pushes particles away: a soft sphere of influence.
    vec3 away = pos - uPointer;
    float push = uPointerForce * exp(-dot(away, away) / 0.05);
    pos += normalize(away + vec3(1e-4)) * push * 0.28;

    // Click shockwave: a ring that travels outward and fades.
    vec3 fromShock = pos - uShockOrigin;
    float front = uShockAge * 2.4;
    float ring = exp(-pow((length(fromShock) - front) * 9.0, 2.0)) * exp(-uShockAge * 1.6);
    pos += normalize(fromShock + vec3(1e-4)) * ring * 0.26;

    // Turbulence peaks halfway through a morph (and when the globe is shaken).
    float phase = uTime * 0.6;
    vec3 swirl = vec3(
      sin(pos.y * 3.1 + phase + aSeed.z * 6.2831),
      sin(pos.z * 2.7 + phase * 1.3 + aSeed.w * 6.2831),
      sin(pos.x * 3.3 + phase * 0.9 + aSeed.x * 6.2831)
    );
    pos += swirl * (0.006 + uTurbulence * 0.22) * (0.4 + aSeed.y);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float energy = push * 2.0 + ring * 1.4 + lifted;
    gl_PointSize = clamp(uSize * (0.55 + aSeed.x * 0.9) * (1.0 + energy * 0.6) * uScale / -mv.z, 1.0, 10.0);

    vec3 base = aSeed.y > 0.88 ? uSignal : (aSeed.y > 0.8 ? uPaper : uPhosphor);
    vColor = mix(base, uSignal, clamp(energy, 0.0, 1.0) * 0.85);
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
  const live = useRef({
    chapter: scrollState.chapter,
    intro: 0,
    modelReady: false,
    // Pointer in NDC, how recently it moved, and how fast.
    ndc: new THREE.Vector2(9, 9),
    lastMove: -10,
    speed: 0,
    tiltX: 0,
    tiltY: 0,
    // Drag-to-spin
    dragging: false,
    dragX: 0,
    dragDistance: 0,
    spin: 0,
    spinVelocity: 0,
    // Effects
    force: 0,
    shake: 0,
    shockAge: 99,
    highlight: 0,
  });

  const { geometry } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const { shapes, layerIndex } = buildProceduralShapes(count, fonts);
    SHAPES.forEach((key) => {
      const data = shapes[key] ?? new Float32Array(count * 3);
      geo.setAttribute(`a_${key}`, new THREE.BufferAttribute(data, 3));
    });
    // Three needs `position` for draw count; the shader ignores it.
    geo.setAttribute("position", geo.getAttribute("a_drift"));
    geo.setAttribute("aLayer", new THREE.BufferAttribute(layerIndex, 1));
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
    return { geometry: geo };
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
          uPointer: { value: new THREE.Vector3(99, 99, 99) },
          uPointerForce: { value: 0 },
          uShockOrigin: { value: new THREE.Vector3(99, 99, 99) },
          uShockAge: { value: 99 },
          uHighlight: { value: -1 },
          uHighlightMix: { value: 0 },
          uPhosphor: { value: PHOSPHOR },
          uSignal: { value: SIGNAL },
          uPaper: { value: PAPER },
        },
      }),
    [isMobile]
  );

  // Load the baked models; the hero assembles once the C64 arrives and the visitor enters.
  useEffect(() => {
    const controller = new AbortController();
    Object.entries(BAKED).forEach(([key, url]) => {
      loadBakedShape(url, count, controller.signal)
        .then((data) => {
          const attr = geometry.getAttribute(`a_${key}`) as THREE.BufferAttribute;
          (attr.array as Float32Array).set(data);
          attr.needsUpdate = true;
          if (key === CHAPTERS[0].shape) live.current.modelReady = true;
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

  useEffect(() => subscribe("entered", () => invalidate()), [invalidate]);

  // Pointer: push particles, drag to spin (mouse), click or tap for a shockwave.
  useEffect(() => {
    if (reducedMotion) return;
    const s = live.current;
    const canvas = gl.domElement;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    const toNdc = (e: PointerEvent) => s.ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      // Pixels per millisecond, smoothed — fast flicks shake the snow globe.
      s.speed = s.speed * 0.8 + (dist / dt) * 0.2;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      toNdc(e);
      s.lastMove = now / 1000;
      s.tiltX = (e.clientX / window.innerWidth) * 2 - 1;
      s.tiltY = (e.clientY / window.innerHeight) * 2 - 1;
      if (s.dragging) {
        const dx = e.clientX - s.dragX;
        s.dragX = e.clientX;
        s.dragDistance += Math.abs(dx);
        s.spinVelocity += dx * 0.0009;
      }
      invalidate();
    };
    let downOnCanvas = false;
    const onDown = (e: PointerEvent) => {
      downOnCanvas = true;
      s.dragDistance = 0;
      s.dragX = e.clientX;
      s.dragging = e.pointerType === "mouse";
      toNdc(e);
    };
    // Listened on window so a drag that ends over the text still releases.
    const onUp = (e: PointerEvent) => {
      const wasDrag = s.dragDistance > 6;
      const started = downOnCanvas;
      s.dragging = false;
      downOnCanvas = false;
      if (!started || wasDrag) return;
      toNdc(e);
      interaction.shock = { x: s.ndc.x, y: s.ndc.y };
      invalidate();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [gl, invalidate, reducedMotion]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  const tmp = useMemo(
    () => ({
      lookAt: new THREE.Vector3(),
      raycaster: new THREE.Raycaster(),
      plane: new THREE.Plane(),
      normal: new THREE.Vector3(),
      hit: new THREE.Vector3(),
      ndc: new THREE.Vector2(),
    }),
    []
  );

  /** Projects an NDC point onto the plane through the object facing the camera, in object space. */
  const pick = (group: THREE.Group, x: number, y: number, out: THREE.Vector3) => {
    tmp.ndc.set(x, y);
    tmp.raycaster.setFromCamera(tmp.ndc, camera);
    camera.getWorldDirection(tmp.normal);
    tmp.plane.setFromNormalAndCoplanarPoint(tmp.normal, group.position);
    if (!tmp.raycaster.ray.intersectPlane(tmp.plane, tmp.hit)) return false;
    group.updateMatrixWorld();
    out.copy(group.worldToLocal(tmp.hit));
    return true;
  };

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const dt = Math.min(rawDelta, 0.05);
    const s = live.current;
    const u = material.uniforms;
    const now = performance.now() / 1000;

    // Reduced motion snaps to the scroll position instead of easing toward it.
    s.chapter = reducedMotion ? scrollState.chapter : damp(s.chapter, scrollState.chapter, 5, dt);
    const introTarget = interaction.entered && s.modelReady ? 1 : 0;
    s.intro = reducedMotion ? introTarget : damp(s.intro, introTarget, 1.6, dt);
    setLevel(Math.round(scrollState.chapter));

    const base = Math.floor(s.chapter);
    const frac = s.chapter - base;
    const weights = u.uWeights.value as number[];
    weights.fill(0);
    const from = SHAPES.indexOf(CHAPTERS[Math.min(base, CHAPTERS.length - 1)].shape);
    const to = SHAPES.indexOf(CHAPTERS[Math.min(base + 1, CHAPTERS.length - 1)].shape);
    const t = ease(frac);
    weights[from] += 1 - t;
    weights[to] += t;

    // Pointer force fades out a moment after the cursor stops.
    const active = !reducedMotion && now - s.lastMove < 1.2 ? 1 : 0;
    s.force = damp(s.force, active, active ? 8 : 2, dt);
    s.speed = damp(s.speed, 0, 2.5, dt);
    // Shaking only stirs the snow globe; elsewhere fast moves add a little life.
    const globeWeight = weights[GLOBE_INDEX];
    // Capped so the globe swirls but keeps its silhouette.
    s.shake = damp(s.shake, Math.min(s.speed * (0.08 + globeWeight * 0.5), 0.1 + globeWeight * 0.45), 5, dt);

    s.spin += s.spinVelocity;
    s.spinVelocity *= Math.pow(0.04, dt);
    s.spin = damp(s.spin, 0, s.dragging ? 0 : 0.35, dt);

    s.highlight = damp(s.highlight, interaction.highlightLayer >= 0 ? 1 : 0, 7, dt);
    if (interaction.highlightLayer >= 0) u.uHighlight.value = interaction.highlightLayer;

    u.uIntro.value = s.intro;
    u.uTurbulence.value = reducedMotion ? 0 : Math.sin(Math.PI * frac) + (1 - s.intro) * 0.6 + s.shake;
    if (!reducedMotion) u.uTime.value = state.clock.elapsedTime;
    u.uPointerForce.value = s.force;
    u.uHighlightMix.value = s.highlight;
    const fov = (camera as THREE.PerspectiveCamera).fov ?? 40;
    u.uScale.value = gl.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2));

    const pose = poseAt(s.chapter, isMobile);
    const idle = reducedMotion ? 0 : state.clock.elapsedTime * 0.05;
    group.position.set(pose.offset[0], pose.offset[1], pose.offset[2]);
    group.rotation.set(
      pose.rotation[0] + (isMobile ? 0 : s.tiltY * 0.08),
      pose.rotation[1] + Math.sin(idle) * 0.25 + (isMobile ? 0 : s.tiltX * 0.18) + s.spin,
      pose.rotation[2]
    );
    group.scale.setScalar(pose.scale);

    camera.position.set(
      pose.offset[0] + pose.camera[0],
      pose.offset[1] + pose.camera[1],
      pose.offset[2] + pose.camera[2]
    );
    // Look to the left of the object so it sits off-center, beside the text column.
    tmp.lookAt.set(pose.offset[0] - (isMobile ? 0 : 1.6), pose.offset[1] - (isMobile ? 0.95 : 0), 0);
    camera.lookAt(tmp.lookAt);
    camera.updateMatrixWorld();

    if (s.force > 0.01) pick(group, s.ndc.x, s.ndc.y, u.uPointer.value as THREE.Vector3);

    if (interaction.shock) {
      const { x, y } = interaction.shock;
      interaction.shock = null;
      if (pick(group, x, y, u.uShockOrigin.value as THREE.Vector3)) {
        s.shockAge = 0;
        sound.blip();
      }
    }
    if (s.shockAge < 10) s.shockAge += dt;
    u.uShockAge.value = s.shockAge;

    // Keep rendering while anything is still moving; stop once settled in demand mode.
    const moving =
      Math.abs(s.chapter - scrollState.chapter) > 0.001 ||
      Math.abs(s.intro - introTarget) > 0.001 ||
      s.force > 0.01 ||
      s.shockAge < 3 ||
      Math.abs(s.spin) > 0.001;
    if (moving) invalidate();
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
