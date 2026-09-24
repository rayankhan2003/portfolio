"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { View, PerspectiveCamera } from "@react-three/drei";
import { useTheme } from "next-themes";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import ProjectRing from "@/components/three/project-ring";
import type { Project } from "@/lib/projects/types";

/** Eases the live ring position toward the selected index (+ any drag). */
function RingDriver({
  target,
  offsetRef,
  dragRef,
}: {
  target: number;
  offsetRef: React.RefObject<number>;
  dragRef: React.RefObject<number>;
}) {
  useFrame((_, delta) => {
    offsetRef.current = THREE.MathUtils.damp(
      offsetRef.current,
      target + dragRef.current,
      6,
      delta
    );
  });
  return null;
}

export default function Projects3D({
  projects,
  index,
  setIndex,
}: {
  projects: Project[];
  index: number;
  setIndex: (i: number) => void;
}) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [narrow, setNarrow] = useState(false);
  const offsetRef = useRef(index);
  const dragRef = useRef(0);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const count = projects.length;
  const current = projects[index];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const go = (dir: 1 | -1) => setIndex(THREE.MathUtils.clamp(index + dir, 0, count - 1));

  // one px of drag = this much ring travel; a full panel is ~260px on desktop
  const perPx = narrow ? 1 / 180 : 1 / 260;

  function onPointerDown(e: React.PointerEvent) {
    drag.current = { x: e.clientX, moved: false };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    // rubber-band past the ends
    const raw = -dx * perPx;
    const next = index + raw;
    dragRef.current = next < 0 || next > count - 1 ? raw * 0.3 : raw;
  }
  function onPointerUp() {
    if (!drag.current) return;
    const landed = Math.round(index + dragRef.current);
    dragRef.current = 0;
    setIndex(THREE.MathUtils.clamp(landed, 0, count - 1));
    // keep the "moved" flag for the click that follows this pointerup
    setTimeout(() => (drag.current = null), 0);
  }

  function onSelect(i: number) {
    if (drag.current?.moved) return; // that was a drag, not a click
    if (i === index) router.push(`/projects/${projects[i].slug}`);
    else setIndex(i);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Enter" && current) {
      router.push(`/projects/${current.slug}`);
    }
  }

  if (!current) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Projects in 3D"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
    >
      <div
        className="relative h-[56vh] min-h-[380px] max-h-[620px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <View className="absolute inset-0">
          <PerspectiveCamera makeDefault position={[0, 0.15, narrow ? 8.8 : 5.4]} fov={40} />
          <RingDriver target={index} offsetRef={offsetRef} dragRef={dragRef} />
          <ProjectRing
            projects={projects}
            offsetRef={offsetRef}
            dark={resolvedTheme === "dark"}
            onSelect={onSelect}
          />
        </View>
        <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-mono text-[11px] text-muted-foreground">
          drag or ← → to browse · click the front window to open it
        </p>
      </div>

      <div className="mx-auto mt-4 max-w-3xl px-6 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          ~/projects/{current.slug}
          {current.year ? ` · ${current.year}` : ""}
          {current.category ? ` · ${current.category}` : ""}
        </p>
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{current.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{current.shortDescription}</p>
        <p className="mt-3 flex flex-wrap justify-center gap-x-2 gap-y-1 font-mono text-xs">
          {current.technologies.slice(0, 6).map((t) => (
            <span key={t} className="text-primary">
              #{t.replace(/\s+/g, "").toLowerCase()}
            </span>
          ))}
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Previous project"
          >
            <ArrowLeft weight="light" className="h-4 w-4" />
          </Button>
          <Button asChild className="font-mono">
            <Link href={`/projects/${current.slug}`}>open case study</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(1)}
            disabled={index === count - 1}
            aria-label="Next project"
          >
            <ArrowRight weight="light" className="h-4 w-4" />
          </Button>
        </div>
        <p aria-live="polite" className="mt-3 font-mono text-xs text-muted-foreground">
          {index + 1} / {count}
        </p>
      </div>
    </section>
  );
}
