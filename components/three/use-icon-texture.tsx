"use client";
import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";

/** Rasterizes one of our tech-icons.tsx SVG components into a transparent-background
 *  canvas texture, suitable for projecting onto a mesh via drei's <Decal>. */
export function useIconTexture(
  Icon: React.ComponentType<{ className?: string }>
): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: THREE.CanvasTexture | null = null;

    const markup = renderToStaticMarkup(<Icon />);
    const withXmlns = markup.includes("xmlns=")
      ? markup
      : markup.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    const svg64 = btoa(unescape(encodeURIComponent(withXmlns)));
    const dataUrl = `data:image/svg+xml;base64,${svg64}`;

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      // clip to a circle so icons with their own square/rect background
      // (JS's yellow square, TS's blue square, etc.) read as a round coin
      // embedded in the ball, not a sticker with hard corners
      const r = size / 2;
      ctx.beginPath();
      ctx.arc(r, r, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      const pad = size * 0.06;
      ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
      created = new THREE.CanvasTexture(canvas);
      // DecalGeometry's UVs use the opposite vertical convention to three's
      // default — without this, icons land flipped on the ball
      created.flipY = false;
      created.colorSpace = THREE.SRGBColorSpace;
      created.needsUpdate = true;
      setTexture(created);
    };
    img.src = dataUrl;

    return () => {
      cancelled = true;
      created?.dispose();
    };
  }, [Icon]);

  return texture;
}
