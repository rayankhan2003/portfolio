"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ShapeGrid from "@/components/reactbits/shape-grid";

export default function HeroBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <ShapeGrid
        direction="diagonal"
        speed={0.3}
        squareSize={40}
        borderColor={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}
        hoverFillColor={isDark ? "rgba(245,158,91,0.35)" : "rgba(194,102,26,0.18)"}
        vignetteColor={isDark ? "#141210" : "#ffffff"}
      />
    </div>
  );
}
