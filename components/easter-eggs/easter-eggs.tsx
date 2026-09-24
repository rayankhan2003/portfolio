"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const MATRIX_EVENT = "easter:matrix";

/** Start the matrix rain from anywhere (terminal command, konami code). */
export function startMatrix() {
  window.dispatchEvent(new Event(MATRIX_EVENT));
}

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];
const RAIN_MS = 7000;
const GLYPHS = "アイウエオカキクケコサシスセソ0123456789{}[]<>/=+*$#RAYANKHAN";

function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 16;
    let w = 0;
    let drops: number[] = [];
    const resize = () => {
      w = window.innerWidth;
      canvas.width = w * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = Array.from({ length: Math.ceil(w / size) }, () => Math.random() * -40);
    };
    resize();
    window.addEventListener("resize", resize);

    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() ||
      "#e07b39";
    const start = performance.now();
    let raf = 0;
    let last = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 45) return; // ~22fps reads as "terminal", not "video"
      last = now;
      const fading = now - start > RAIN_MS - 1200;
      ctx.fillStyle = fading ? "rgba(5,5,5,0.25)" : "rgba(5,5,5,0.12)";
      ctx.fillRect(0, 0, w, window.innerHeight);
      ctx.font = `${size}px var(--font-mono), monospace`;
      drops.forEach((y, i) => {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        ctx.fillStyle = Math.random() < 0.08 ? "#fff" : accent;
        ctx.fillText(ch, i * size, y * size);
        if (y * size > window.innerHeight && Math.random() > 0.975) drops[i] = 0;
        else drops[i] = y + 1;
      });
    };
    raf = requestAnimationFrame(draw);
    const done = window.setTimeout(onDone, RAIN_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
      window.removeEventListener("resize", resize);
    };
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      onClick={onDone}
      className="fixed inset-0 z-[150] h-full w-full cursor-pointer animate-in fade-in duration-500"
    />
  );
}

/**
 * Site-wide easter eggs: the konami code, matrix rain, and a hello in the
 * dev-tools console for anyone who goes looking.
 */
export default function EasterEggs() {
  const [raining, setRaining] = useState(false);
  const stop = useCallback(() => setRaining(false), []);

  useEffect(() => {
    console.log(
      "%c rayan@portfolio %c poking around? respect. press ctrl+k for a real shell — or try the konami code.",
      "background:#c2581c;color:#fff;padding:2px 6px;border-radius:3px;font-family:monospace",
      "font-family:monospace"
    );
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let progress = 0;
    const start = () => {
      if (reduceMotion) {
        toast("wake up, neo…", { description: "(the rain is off for reduced motion)" });
        return;
      }
      setRaining(true);
    };
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        toast("cheat code accepted", { description: "↑↑↓↓←→←→BA — you're one of us." });
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(MATRIX_EVENT, start);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(MATRIX_EVENT, start);
    };
  }, []);

  return raining ? <MatrixRain onDone={stop} /> : null;
}
