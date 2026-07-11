"use client";
import { useEffect, useRef, useState } from "react";
import { View, PerspectiveCamera } from "@react-three/drei";
import SkillOrbScene, { type OrbSkill } from "./skill-orb-field";

const TIER_LABEL: Record<OrbSkill["tier"], string> = {
  core: "core stack",
  working: "working knowledge",
  familiar: "familiar",
};

function FallbackList({ skills }: { skills: OrbSkill[] }) {
  const tiers: OrbSkill["tier"][] = ["core", "working", "familiar"];
  return (
    <div className="grid sm:grid-cols-3 gap-6 p-6 sm:p-8">
      {tiers.map((tier) => (
        <div key={tier}>
          <p className="font-mono text-xs text-muted-foreground mb-3">
            [ {TIER_LABEL[tier]} ]
          </p>
          <div className="flex flex-wrap gap-3">
            {skills
              .filter((s) => s.tier === tier)
              .map(({ name, Icon, invert }) => (
                <div key={name} className="flex items-center gap-1.5 font-mono text-xs">
                  <Icon className={`w-3.5 h-3.5 ${invert ? "dark:invert" : ""}`} />
                  {name}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SkillOrbs({ skills }: { skills: OrbSkill[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [canRender3D, setCanRender3D] = useState(false);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setCanRender3D(!reduceMotion);
    if (reduceMotion || !wrapperRef.current) return;

    // one-shot: defer the physics WASM load until first scrolled near, then
    // keep it alive — the scene shares the single global canvas, so there is
    // no per-section WebGL context to leak or lose
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="relative min-h-140 sm:min-h-168">
      {canRender3D ? (
        shouldMount && (
          <View className="absolute inset-0 cursor-grab active:cursor-grabbing">
            {/* narrow FOV + pulled-back camera keeps spheres round at the
                frame edges instead of stretching into ovals */}
            <PerspectiveCamera makeDefault position={[0, 0, 11.8]} fov={35} />
            <SkillOrbScene skills={skills} />
          </View>
        )
      ) : (
        <FallbackList skills={skills} />
      )}
    </div>
  );
}
