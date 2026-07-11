"use client";
import { useMemo, useRef, useState } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import { Decal } from "@react-three/drei";
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
  invert?: boolean;
}

const BALLOON_RADIUS = 1.05;
const GRID_COLS = 6;
const GRID_SPACING = 2.3; // > 2*radius, guarantees no spawn overlap

// container bounds the balloons fall and pack into — kept tight relative to
// ball size/count so the pile fills and overflows the frame, not floats in empty space
const BOUNDS = { x: 7.6, y: 2.9, z: 1.9 };

function Balloon({ skill, index }: { skill: OrbSkill; index: number }) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const [dragging, setDragging] = useState(false);
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
  }, [index]);

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
        scale={BALLOON_RADIUS}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={skill.color}
          roughness={0.55}
          metalness={0}
          toneMapped={false}
        />
        {/* map prop only — a child material would override drei's depth/offset
            setup and cause ghosted/mirrored bleed-through from other balls.
            small scale keeps the icon flat on the front face like a sticker
            instead of shrink-wrapping around the sphere's curvature */}
        {texture && (
          <Decal
            position={[0, 0, 1]}
            scale={0.9}
            map={texture}
            material-toneMapped={false}
          />
        )}
      </mesh>
    </RigidBody>
  );
}

function Walls() {
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
export default function SkillOrbScene({ skills }: { skills: OrbSkill[] }) {
  return (
    <>
      <Lights />
      <Physics gravity={[0, -9.8, 0]}>
        <Walls />
        {skills.map((skill, i) => (
          <Balloon key={skill.name} skill={skill} index={i} />
        ))}
      </Physics>
    </>
  );
}
