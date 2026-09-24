"use client";
import { useEffect } from "react";
import Lenis from "lenis";

let activeLenis: Lenis | null = null;

/** Smooth-scroll to a section by id, falling back to native scrolling when
 *  Lenis is off (reduced motion) or not mounted yet. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return false;
  if (activeLenis) activeLenis.scrollTo(target, { offset: -64 });
  else target.scrollIntoView({ behavior: "smooth" });
  return true;
}

export default function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    activeLenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    function onAnchorClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -64 });
    }
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
      activeLenis = null;
    };
  }, []);

  return null;
}
