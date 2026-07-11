"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { View, PerspectiveCamera } from "@react-three/drei";
import WireframeScene, { type ShardConfig } from "./wireframe-field";

interface SectionWebGLProps {
  shards: ShardConfig[];
  cameraZ?: number;
  className?: string;
}

/** Ambient wireframe backdrop — renders into the single global canvas via a
 *  drei View, mounted only while the section is near the viewport. */
export default function SectionWebGL({
  shards,
  cameraZ = 6,
  className,
}: SectionWebGLProps) {
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
      className={`absolute inset-0 -z-10 pointer-events-none ${className ?? ""}`}
      aria-hidden="true"
    >
      {visible && (
        <View className="absolute inset-0">
          <PerspectiveCamera makeDefault position={[0, 0, cameraZ]} fov={45} />
          <WireframeScene shards={shards} color={color} />
        </View>
      )}
    </div>
  );
}
