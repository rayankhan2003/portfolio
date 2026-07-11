"use client";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

/**
 * The ONE WebGL canvas for the whole site. Every 3D section renders into a
 * scissored <View> region of this single context via drei's View.Port.
 * Browsers cap live WebGL contexts and evict the oldest ("Context Lost") —
 * one persistent context sidesteps that class of crash entirely.
 */
export default function SceneCanvas() {
  const [eventSource, setEventSource] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!reduceMotion) setEventSource(document.body);
  }, []);

  if (!eventSource) return null;

  return (
    <Canvas
      eventSource={eventSource}
      eventPrefix="client"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <View.Port />
    </Canvas>
  );
}
