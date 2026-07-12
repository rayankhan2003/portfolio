"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { View, PerspectiveCamera } from "@react-three/drei";
import WireframeScene, { type ShardConfig, type ShardShape } from "./wireframe-field";
import { useViewportWidth } from "@/hooks/use-viewport-width";

interface SectionWebGLProps {
  shards: ShardConfig[];
  cameraZ?: number;
  className?: string;
  /** distinct geometry per section so every backdrop isn't the same shape */
  shape?: ShardShape;
  /**
   * Pin the 3D layer to a fixed height instead of stretching across the
   * whole parent. Tall multi-card sections (e.g. Projects) otherwise give
   * the View a narrow portrait aspect ratio, which shrinks the effective
   * horizontal field of view and pushes shards outside the frustum.
   */
  heightPx?: number;
}

/** Ambient wireframe backdrop — renders into the single global canvas via a
 *  drei View, mounted only while the section is near the viewport. */
export default function SectionWebGL({
  shards,
  cameraZ = 6,
  className,
  heightPx,
  shape = "icosahedron",
}: SectionWebGLProps) {
  const { resolvedTheme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const viewportWidth = useViewportWidth();

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
      // full-bleed breakout: the View clips to this element's exact rect, so
      // it must span the real viewport width, not just this section's own
      // (often much narrower) max-w-* container. Width is measured via JS
      // (window.innerWidth) rather than CSS 100vw, which on non-overlay-
      // scrollbar systems (common on Windows desktops/large displays)
      // includes the scrollbar's width and causes horizontal overflow.
      className={`absolute top-0 left-1/2 -z-10 pointer-events-none ${
        heightPx ? "" : "bottom-0"
      } ${className ?? ""}`}
      style={{
        width: viewportWidth ?? "100vw",
        transform: "translateX(-50%)",
        ...(heightPx ? { height: heightPx } : {}),
      }}
      aria-hidden="true"
    >
      {visible && (
        <View className="absolute inset-0">
          <PerspectiveCamera makeDefault position={[0, 0, cameraZ]} fov={45} />
          <WireframeScene shards={shards} color={color} shape={shape} />
        </View>
      )}
    </div>
  );
}
