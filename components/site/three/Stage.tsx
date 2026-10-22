"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { MARKER } from "@/lib/palette";

/**
 * Shared canvas for the decorative 3D objects. It only renders while it is on
 * screen, caps the pixel ratio, and lights the scene with code-built softboxes
 * (no HDR download). With reduced motion it draws a single still frame.
 */
export default function Stage({ children, className = "", camera = [0, 0, 6] as [number, number, number], fov = 35, active = true }: {
  children: React.ReactNode;
  className?: string;
  /** False while its deck scene is off screen: nothing is rendered then. */
  active?: boolean;
  camera?: [number, number, number];
  fov?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className={className} aria-hidden="true">
      <Canvas
        frameloop={reduced ? "demand" : visible && active ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: camera, fov }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        shadows={false}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[6, 2, 1]} />
          <Lightformer form="rect" intensity={1.5} position={[-5, 1, 2]} rotation-y={Math.PI / 3} scale={[3, 5, 1]} />
          <Lightformer form="rect" intensity={1} color={MARKER} position={[5, -1, 1]} rotation-y={-Math.PI / 3} scale={[2, 4, 1]} />
        </Environment>
        {children}
      </Canvas>
    </div>
  );
}
