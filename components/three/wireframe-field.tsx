"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface ShardConfig {
  position: [number, number, number];
  scale: number;
  speed: number;
  /** how strongly this shard drifts toward the cursor; 0 disables parallax */
  parallax?: number;
}

function Shard({ position, scale, speed, parallax = 0, color }: ShardConfig & { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + seed;
    ref.current.rotation.x = t * 0.4;
    ref.current.rotation.y = t * 0.6;
    ref.current.position.y = position[1] + Math.sin(t) * 0.35;
    if (parallax > 0) {
      ref.current.position.x = position[0] + pointer.x * parallax;
      ref.current.position.z = position[2] + pointer.y * parallax * 0.5;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
    </mesh>
  );
}

interface WireframeSceneProps {
  shards: ShardConfig[];
  color?: string;
}

/** Scene fragment — render inside a drei <View> in the single global canvas. */
export default function WireframeScene({
  shards,
  color = "#e08a3e",
}: WireframeSceneProps) {
  return (
    <>
      {shards.map((s, i) => (
        <Shard key={i} {...s} color={color} />
      ))}
    </>
  );
}
