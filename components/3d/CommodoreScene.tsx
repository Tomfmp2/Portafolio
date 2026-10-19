"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center, ContactShadows, Sparkles, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { DRACO_DECODER_PATH } from "@/lib/three-utils";

const MODEL_URL = "https://pub-18dfde3731984fdd8859b4b55c6a0de7.r2.dev/commodore_64__computer_full_pack.glb";

if (typeof window !== "undefined") {
  useGLTF.preload(MODEL_URL, DRACO_DECODER_PATH);
}

interface CommodoreSceneProps {
  scrollProgressRef: React.RefObject<number>;
  isMobile: boolean;
  enablePostprocessing: boolean;
}

/**
 * 3D Four-pointed Diamond Star Element (matches reference floating star shape)
 */
function FloatingStar({
  position,
  scale = 1,
  color = "#FF3333",
  speed = 1.5,
  rotationIntensity = 1,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
  rotationIntensity?: number;
}) {
  const starGeo = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 1, 0,   1, 0, 0,   0, 0, 1,
      0, 1, 0,   0, 0, 1,  -1, 0, 0,
      0, 1, 0,  -1, 0, 0,   0, 0,-1,
      0, 1, 0,   0, 0,-1,   1, 0, 0,
      0,-1, 0,   0, 0, 1,   1, 0, 0,
      0,-1, 0,  -1, 0, 0,   0, 0, 1,
      0,-1, 0,   0, 0,-1,  -1, 0, 0,
      0,-1, 0,   1, 0, 0,   0, 0,-1,
    ]);
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <Float speed={speed} rotationIntensity={rotationIntensity} floatIntensity={1.2} position={position}>
      <mesh geometry={starGeo} scale={[scale * 0.3, scale * 0.5, scale * 0.3]}>
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.25}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

/**
 * 3D Podium Platform (matching reference table/pedestal stage composition)
 */
function PodiumPlatform() {
  return (
    <group position={[0, -1.55, 0]}>
      {/* Main Table Top Stage */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[2.8, 3.0, 0.22, 64]} />
        <meshStandardMaterial
          color="#121218"
          roughness={0.35}
          metalness={0.65}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* Red LED Glow Border Trim */}
      <mesh position={[0, 0.11, 0]}>
        <ringGeometry args={[2.75, 2.79, 64]} />
        <meshBasicMaterial color="#FF3333" side={THREE.DoubleSide} />
      </mesh>

      {/* Base Support Bevel */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[3.0, 3.2, 0.2, 64]} />
        <meshStandardMaterial color="#0A0A0E" roughness={0.5} metalness={0.4} />
      </mesh>
    </group>
  );
}

export function CommodoreModel({
  scrollProgressRef,
  isMobile,
}: {
  scrollProgressRef: React.RefObject<number>;
  isMobile: boolean;
}) {
  const { scene } = useGLTF(MODEL_URL, DRACO_DECODER_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.isMeshStandardMaterial) {
            mat.envMapIntensity = 1.3;
            mat.roughness = Math.max(0.2, mat.roughness ?? 0.5);
          }
        }
      }
    });
    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const scrollProgress = scrollProgressRef.current ?? 0;

    // Smooth pointer tilt effect
    const pointerFactor = isMobile ? 0.08 : 0.28;
    targetRotation.current.x = THREE.MathUtils.lerp(
      targetRotation.current.x,
      state.pointer.y * pointerFactor,
      delta * 4
    );
    targetRotation.current.y = THREE.MathUtils.lerp(
      targetRotation.current.y,
      state.pointer.x * pointerFactor,
      delta * 4
    );

    const p = Math.min(Math.max(scrollProgress, 0), 1);

    // Precise reference camera framing: Centered lower-middle, balanced scale
    const basePosX = 0;
    const basePosY = isMobile ? -0.8 : -0.65 + p * 0.25;
    const basePosZ = isMobile ? -0.2 + p * 0.4 : 0.0 + p * 0.6;

    // Slight frontal tilt angle matching reference
    const baseRotX = 0.08 - p * 0.2 + targetRotation.current.x * 0.1;
    const baseRotY = -0.1 + p * 0.5 + targetRotation.current.y * 0.18;
    const baseRotZ = p * -0.03;

    // Scaled down by ~35% from previous to match reference framing exactly
    const baseScale = isMobile ? 0.42 + p * 0.1 : 0.65 + p * 0.15;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, basePosX, delta * 5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, basePosY, delta * 5);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, basePosZ, delta * 5);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, baseRotX, delta * 5);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, baseRotY, delta * 5);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, baseRotZ, delta * 5);

    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, baseScale, delta * 5));
  });

  return (
    <group ref={groupRef}>
      <Center top position={[0, -1.42, 0]}>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

export default function CommodoreScene({
  scrollProgressRef,
  isMobile = false,
  enablePostprocessing = true,
}: CommodoreSceneProps) {
  return (
    <>
      {/* ── Soft Studio & Atmospheric Lighting ── */}
      <ambientLight intensity={0.7} />
      
      {/* Key Directional Light */}
      <directionalLight
        position={[5, 9, 6]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-bias={-0.0001}
      />
      
      {/* Fill Light */}
      <directionalLight
        position={[-6, 4, 3]}
        intensity={0.8}
        color="#95B2FF"
      />

      {/* Crimson Accent Rim Light (#FF3333) */}
      <spotLight
        position={[5, 4, -4]}
        intensity={8}
        color="#FF3333"
        angle={0.7}
        penumbra={0.8}
        distance={18}
      />

      {/* Rear Soft Ambient Glow */}
      <pointLight
        position={[0, 0.2, -2]}
        intensity={3}
        color="#FF3333"
        distance={8}
      />

      {/* ── Stage Podium Base ── */}
      <PodiumPlatform />

      {/* ── Floating Decorative Elements (Reference Inspired) ── */}
      {!isMobile && (
        <>
          {/* Crimson Floating Diamond Star (Left) */}
          <FloatingStar position={[-2.3, 0.3, 0.4]} scale={0.95} color="#FF3333" speed={1.6} />
          {/* Silver/Chrome Floating Star (Right) */}
          <FloatingStar position={[2.3, 0.4, -0.2]} scale={0.85} color="#E0E0E0" speed={1.3} />
          {/* Crimson Orb (Right Base) */}
          <Float speed={1.8} floatIntensity={1.1} position={[2.0, -0.8, 0.6]}>
            <mesh scale={0.2}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial color="#FF3333" metalness={0.8} roughness={0.2} />
            </mesh>
          </Float>
        </>
      )}

      {/* ── Floating Atmospheric Particles ── */}
      <Sparkles
        count={isMobile ? 18 : 40}
        scale={[9, 5, 7]}
        size={isMobile ? 1.3 : 1.8}
        speed={0.2}
        opacity={0.3}
        color="#FF6666"
      />

      {/* ── Ground Shadow Anchor on Podium ── */}
      <ContactShadows
        position={[0, -1.44, 0]}
        opacity={0.7}
        scale={6.5}
        blur={1.8}
        far={3}
        color="#000000"
      />

      {/* ── Main 3D Model ── */}
      <React.Suspense fallback={null}>
        <CommodoreModel scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
      </React.Suspense>

      {/* ── Selective Postprocessing ── */}
      {enablePostprocessing && (
        <EffectComposer enableNormalPass={false} multisampling={0}>
          <Bloom
            intensity={0.3}
            luminanceThreshold={0.82}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.25} darkness={0.65} />
        </EffectComposer>
      )}
    </>
  );
}
