"use client";
import { useEffect, useState } from "react";

/**
 * Real viewport width via window.innerWidth. Unlike CSS 100vw (which
 * includes the vertical scrollbar's width on non-overlay-scrollbar
 * systems), this correctly matches the visible area — used for full-bleed
 * breakout layers so they don't cause horizontal overflow.
 */
export function useViewportWidth(): number | null {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}
