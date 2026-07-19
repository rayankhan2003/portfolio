"use client";
import { useEffect, useRef, useState } from "react";
import { View, PerspectiveCamera } from "@react-three/drei";
import SkillOrbScene, { type OrbSkill } from "./skill-orb-field";
import { useViewportWidth } from "@/hooks/use-viewport-width";

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
              .map(({ name, Icon, invert, lightInvert }) => (
                <div key={name} className="flex items-center gap-1.5 font-mono text-xs">
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      invert ? "dark:invert" : lightInvert ? "invert dark:invert-0" : ""
                    }`}
                  />
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
  const viewportWidth = useViewportWidth();
  const isMobile = (viewportWidth ?? 1440) < 640;

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setCanRender3D(!reduceMotion);
    if (reduceMotion || !wrapperRef.current) return;

    // one-shot: defer physics mount until the section is substantially in
    // view (not just 150px away) — the fall-and-settle animation finishes in
    // well under a second, faster than a real scroll takes to arrive, so
    // triggering early meant every visitor only ever saw an already-settled,
    // static-looking pile and never the actual drop. Triggering close to
    // "centered in view" instead means people actually see the balls fall.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[75dvh] max-h-[820px] min-h-120">
      {canRender3D ? (
        shouldMount && (
          <View className="absolute inset-0 cursor-grab active:cursor-grabbing">
            {/* Billboard (see skill-orb-field.tsx) already keeps icons facing
                the camera regardless of viewing angle, so FOV no longer needs
                to be artificially narrow to avoid icon skew. A wider FOV here
                means the whole ball pile actually fits in frame instead of
                part of it falling outside the frustum. Mobile gets its own
                tighter camera to match the narrower portrait-ish viewport. */}
            <PerspectiveCamera
              makeDefault
              position={[0, 0, isMobile ? 14 : 15]}
              fov={isMobile ? 50 : 34}
            />
            <SkillOrbScene skills={skills} mobile={isMobile} />
          </View>
        )
      ) : (
        <FallbackList skills={skills} />
      )}
    </div>
  );
}
