"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { View, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const COUNT = 140;
// particles drift along this direction — up and toward the viewer, like
// messages being sent off — then loop back to the start
const DIRECTION = new THREE.Vector3(0.55, 0.85, 0.3).normalize();
const SPAN = 14;

function ParticleStream({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const offsets = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
      speeds[i] = 0.18 + Math.random() * 0.3;
      offsets[i] = Math.random() * SPAN;
    }
    return { positions, speeds, offsets };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      const dist = ((t * speeds[i] + offsets[i]) % SPAN) - SPAN / 2;
      posAttr.setXYZ(
        i,
        positions[i * 3] + DIRECTION.x * dist,
        positions[i * 3 + 1] + DIRECTION.y * dist,
        positions[i * 3 + 2] + DIRECTION.z * dist
      );
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.18}
        transparent
        opacity={0.95}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

interface MessageParticlesProps {
  cameraZ?: number;
  className?: string;
}

/** Contact's signature 3D moment — particles streaming out, standing in for
 *  messages being sent, distinct from the wireframe shards used elsewhere. */
export default function MessageParticles({
  cameraZ = 7,
  className,
}: MessageParticlesProps) {
  const { resolvedTheme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion || !wrapperRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const color = resolvedTheme === "dark" ? "#f0a860" : "#c2661a";

  return (
    <div
      ref={wrapperRef}
      className={`absolute top-0 bottom-0 left-1/2 right-1/2 -mx-[50vw] w-screen -z-10 pointer-events-none ${className ?? ""}`}
      aria-hidden="true"
    >
      {visible && (
        <View className="absolute inset-0">
          <PerspectiveCamera makeDefault position={[0, 0, cameraZ]} fov={50} />
          <ParticleStream color={color} />
        </View>
      )}
    </div>
  );
}
