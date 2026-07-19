"use client";
import { useMemo, useRef, useState } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";
import { useIconTexture } from "./use-icon-texture";

export type SkillTier = "core" | "working" | "familiar";

export interface OrbSkill {
  name: string;
  tier: SkillTier;
  /** the tech's real brand color, e.g. HTML's #E44D26 */
  color: string;
  Icon: React.ComponentType<{ className?: string }>;
  /** icon is dark-by-default; flip to light in dark mode (2D fallback only) */
  invert?: boolean;
  /** icon is white-by-default (for ball contrast); flip to dark in light mode */
  lightInvert?: boolean;
}

// mobile gets smaller balls, a tighter grid, and a narrower spread — the
// full-bleed canvas is portrait-ish on narrow screens, so there's much less
// horizontal room than on desktop
const DESKTOP = {
  radius: 1.05,
  gridCols: 6,
  gridSpacing: 2.3, // > 2*radius, guarantees no spawn overlap
  bounds: { x: 7.6, y: 2.9, z: 1.9 },
};
const MOBILE = {
  radius: 0.62,
  gridCols: 4,
  gridSpacing: 1.4,
  bounds: { x: 3.0, y: 3.6, z: 1.3 },
};

function Balloon({
  skill,
  index,
  mobile,
}: {
  skill: OrbSkill;
  index: number;
  mobile: boolean;
}) {
  const { radius: BALLOON_RADIUS, gridCols: GRID_COLS, gridSpacing: GRID_SPACING, bounds: BOUNDS } =
    mobile ? MOBILE : DESKTOP;
  const bodyRef = useRef<RapierRigidBody>(null);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1)), []);
  const dragPoint = useMemo(() => new THREE.Vector3(), []);
  const lastPoint = useRef(new THREE.Vector3());
  const lastTime = useRef(0);
  const velocity = useRef(new THREE.Vector3());
  const texture = useIconTexture(skill.Icon);

  // loose grid + heavy jitter: enough structure to avoid deep spawn overlap,
  // enough randomness that the pile settles like dumped balls, not racked rows
  const startPos = useMemo<[number, number, number]>(() => {
    const col = index % GRID_COLS;
    const row = Math.floor(index / GRID_COLS);
    const x =
      (col - (GRID_COLS - 1) / 2) * GRID_SPACING +
      (Math.random() - 0.5) * 1.6;
    const y = 4.5 + row * GRID_SPACING + Math.random() * 1.8;
    const z = (Math.random() - 0.5) * (BOUNDS.z - BALLOON_RADIUS);
    return [x, y, z];
  }, [index, mobile]);

  const restitution = useMemo(() => 0.35 + Math.random() * 0.3, []);

  function onPointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const body = bodyRef.current;
    if (!body) return;
    setDragging(true);
    body.setBodyType(2, true); // kinematicPosition
    const t = body.translation();
    dragPlane.set(new THREE.Vector3(0, 0, 1), -t.z);
    lastPoint.current.set(t.x, t.y, t.z);
    lastTime.current = performance.now();
  }

  function onPointerMove(e: ThreeEvent<PointerEvent>) {
    if (!dragging) return;
    const body = bodyRef.current;
    if (!body) return;
    if (!e.ray.intersectPlane(dragPlane, dragPoint)) return;
    const x = THREE.MathUtils.clamp(dragPoint.x, -BOUNDS.x, BOUNDS.x);
    const y = THREE.MathUtils.clamp(dragPoint.y, -BOUNDS.y, BOUNDS.y + 3);
    body.setNextKinematicTranslation({ x, y, z: lastPoint.current.z });

    const now = performance.now();
    const dt = Math.max((now - lastTime.current) / 1000, 1 / 120);
    velocity.current.set(
      (x - lastPoint.current.x) / dt,
      (y - lastPoint.current.y) / dt,
      0
    );
    lastPoint.current.set(x, y, lastPoint.current.z);
    lastTime.current = now;
  }

  function onPointerUp(e: ThreeEvent<PointerEvent>) {
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    const body = bodyRef.current;
    if (!body) return;
    setDragging(false);
    body.setBodyType(0, true); // dynamic
    body.setLinvel(
      {
        x: THREE.MathUtils.clamp(velocity.current.x, -12, 12),
        y: THREE.MathUtils.clamp(velocity.current.y, -12, 12),
        z: 0,
      },
      true
    );
  }

  return (
    <RigidBody
      ref={bodyRef}
      colliders="ball"
      restitution={restitution}
      friction={0.5}
      linearDamping={0.4}
      angularDamping={0.8}
      position={startPos}
      enabledRotations={[false, false, false]}
    >
      <mesh
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        scale={BALLOON_RADIUS}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={skill.color}
          roughness={0.55}
          metalness={0}
          toneMapped={false}
        />
      </mesh>
      {/* a decal glued to the sphere surface only looks centered when the
          ball sits dead-center in frame — balls near the edges are viewed
          at an angle by the perspective camera, so a fixed-orientation decal
          reads as skewed. A camera-facing Billboard always looks correct,
          regardless of where the ball ends up on screen. Same Billboard
          carries the hover-only name tooltip, so it stays perfectly synced
          with the ball's physics position with no extra bookkeeping. */}
      <Billboard>
        {texture && (
          <mesh
            position={[0, 0, BALLOON_RADIUS * 1.02]}
            raycast={() => null}
          >
            <planeGeometry args={[BALLOON_RADIUS * 1.05, BALLOON_RADIUS * 1.05]} />
            <meshBasicMaterial
              map={texture}
              transparent
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
        )}
        {hovered && (
          <Text
            position={[0, -BALLOON_RADIUS * 1.5, BALLOON_RADIUS * 1.1]}
            fontSize={BALLOON_RADIUS * 0.42}
            color="white"
            outlineWidth={BALLOON_RADIUS * 0.045}
            outlineColor="black"
            anchorX="center"
            anchorY="middle"
            raycast={() => null}
          >
            {skill.name}
          </Text>
        )}
      </Billboard>
    </RigidBody>
  );
}

function Walls({ mobile }: { mobile: boolean }) {
  const { bounds: BOUNDS } = mobile ? MOBILE : DESKTOP;
  return (
    <>
      <CuboidCollider position={[0, -BOUNDS.y, 0]} args={[BOUNDS.x + 1, 0.5, BOUNDS.z + 1]} />
      <CuboidCollider position={[-BOUNDS.x, 0, 0]} args={[0.5, BOUNDS.y + 3, BOUNDS.z + 1]} />
      <CuboidCollider position={[BOUNDS.x, 0, 0]} args={[0.5, BOUNDS.y + 3, BOUNDS.z + 1]} />
      <CuboidCollider position={[0, 0, -BOUNDS.z]} args={[BOUNDS.x + 1, BOUNDS.y + 3, 0.5]} />
      <CuboidCollider position={[0, 0, BOUNDS.z]} args={[BOUNDS.x + 1, BOUNDS.y + 3, 0.5]} />
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 6]} intensity={1.1} />
      <directionalLight position={[-4, -2, 4]} intensity={0.4} />
    </>
  );
}

/** Scene fragment — render inside a drei <View> in the single global canvas. */
export default function SkillOrbScene({
  skills,
  mobile = false,
}: {
  skills: OrbSkill[];
  mobile?: boolean;
}) {
  return (
    <>
      <Lights />
      <Physics gravity={[0, -9.8, 0]}>
        <Walls mobile={mobile} />
        {skills.map((skill, i) => (
          <Balloon key={skill.name} skill={skill} index={i} mobile={mobile} />
        ))}
      </Physics>
    </>
  );
}
