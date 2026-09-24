"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import {
  Physics,
  RigidBody,
  BallCollider,
  CuboidCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";
import { useIconTexture } from "./use-icon-texture";

export type SkillTier = "core" | "working" | "familiar";

/** drop: normal gravity, balls pile on the floor. attract: zero-g, balls
 *  clump toward the center and the cursor shoves them around. */
export type OrbMode = "drop" | "attract";

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

/**
 * The physics box, derived from what the camera actually sees. The old box
 * used fixed world units, so on any aspect ratio other than the one it was
 * tuned for the walls sat outside the frame and balls rolled off-screen.
 * Measuring at the FRONT plane (closest to the camera, where the visible
 * area is smallest) guarantees every ball stays fully in frame.
 */
interface Box {
  halfW: number;
  halfH: number;
  depth: number;
  radius: number;
}

function useBox(count: number, cameraZ: number, fov: number, mobile: boolean): Box {
  const size = useThree((s) => s.size);
  return useMemo(() => {
    const depth = mobile ? 1.1 : 1.6;
    const aspect = size.width / Math.max(size.height, 1);
    const halfH = Math.tan(THREE.MathUtils.degToRad(fov / 2)) * (cameraZ - depth) * 0.96;
    const halfW = halfH * aspect;
    // size balls so the pile fills roughly a third of the frame at any aspect
    const fit = Math.sqrt((0.32 * 4 * halfW * halfH) / (count * Math.PI));
    const radius = THREE.MathUtils.clamp(fit, 0.4, mobile ? 0.7 : 1.05);
    return { halfW, halfH, depth, radius };
  }, [size.width, size.height, count, cameraZ, fov, mobile]);
}

const MAX_SPEED = 22;
const ATTRACT_STRENGTH = 7;

function Balloon({
  skill,
  index,
  count,
  box,
  mode,
}: {
  skill: OrbSkill;
  index: number;
  count: number;
  box: Box;
  mode: OrbMode;
}) {
  const { halfW, halfH, depth, radius } = box;
  const bodyRef = useRef<RapierRigidBody>(null);
  const [hovered, setHovered] = useState(false);
  const dragging = useRef(false);
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1)), []);
  const dragTarget = useRef(new THREE.Vector3());
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const texture = useIconTexture(skill.Icon);

  // balls are free to spin so they roll off each other instead of stacking
  // into towers; the icon sits on a camera-facing Billboard, so it never
  // visibly turns with the ball
  // spawn above the visible frame in a loose, jittered grid — computed once,
  // so a resize reshapes the walls without teleporting balls mid-flight
  const startPos = useMemo<[number, number, number]>(() => {
    const cols = Math.max(2, Math.floor((2 * (halfW - radius)) / (radius * 2.3)));
    const spacing = (2 * (halfW - radius)) / Math.max(cols - 1, 1);
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = -halfW + radius + col * spacing + (Math.random() - 0.5) * radius * 1.6;
    const y = halfH + radius * 1.5 + row * radius * 2.4 + Math.random() * radius;
    const z = (Math.random() - 0.5) * (depth - radius);
    return [x, y, z];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count]);

  const restitution = useMemo(() => 0.3 + Math.random() * 0.25, []);

  // bodies at rest fall asleep and ignore a gravity change until touched —
  // nudge everyone awake when the mode flips
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.setLinearDamping(mode === "attract" ? 1.6 : 0.4);
    body.wakeUp();
  }, [mode]);

  // a release that happens off-canvas (or a touch cancelled by scrolling)
  // never reaches the mesh; without this the ball stayed "held" forever
  useEffect(() => {
    const end = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.userSelect = "";
      bodyRef.current?.setGravityScale(1, true);
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    window.addEventListener("blur", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      window.removeEventListener("blur", end);
    };
  }, []);

  useFrame((_, delta) => {
    const body = bodyRef.current;
    if (!body) return;
    const t = body.translation();

    // safety net: anything that escapes the box is dropped back in on top
    if (
      t.y < -halfH - 2 ||
      Math.abs(t.x) > halfW + 2 ||
      Math.abs(t.z) > depth + 2 ||
      t.y > halfH + 40
    ) {
      body.setTranslation(
        { x: (Math.random() - 0.5) * (halfW - radius), y: halfH + radius * 2, z: 0 },
        true
      );
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    if (dragging.current) {
      // the held ball stays a dynamic body and is steered by velocity, so it
      // still collides with walls and neighbours instead of being teleported
      // through them (which is what used to wedge balls inside each other)
      const target = dragTarget.current;
      scratch.set(target.x - t.x, target.y - t.y, target.z - t.z).multiplyScalar(14);
      scratch.clampLength(0, MAX_SPEED);
      body.setLinvel(scratch, true);
      return;
    }

    if (mode === "attract") {
      const dt = Math.min(delta, 1 / 30);
      scratch.set(-t.x, -t.y, -t.z * 2).multiplyScalar(ATTRACT_STRENGTH * body.mass() * dt);
      body.applyImpulse(scratch, true);
    }

    // hard cap so a wild fling can't tunnel through a wall
    const v = body.linvel();
    const speed = Math.hypot(v.x, v.y, v.z);
    if (speed > MAX_SPEED) {
      const k = MAX_SPEED / speed;
      body.setLinvel({ x: v.x * k, y: v.y * k, z: v.z * k }, true);
    }
  });

  function clampToBox(p: THREE.Vector3) {
    p.x = THREE.MathUtils.clamp(p.x, -halfW + radius, halfW - radius);
    p.y = THREE.MathUtils.clamp(p.y, -halfH + radius, halfH - radius);
    return p;
  }

  function onPointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const body = bodyRef.current;
    if (!body) return;
    dragging.current = true;
    // dragging across the page otherwise highlights every word it passes
    document.body.style.userSelect = "none";
    body.setGravityScale(0, true);
    const t = body.translation();
    dragPlane.set(new THREE.Vector3(0, 0, 1), -t.z);
    dragTarget.current.set(t.x, t.y, t.z);
  }

  function onPointerMove(e: ThreeEvent<PointerEvent>) {
    if (!dragging.current) return;
    if (!e.ray.intersectPlane(dragPlane, scratch)) return;
    dragTarget.current.copy(clampToBox(scratch));
  }

  function onPointerUp(e: ThreeEvent<PointerEvent>) {
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    if (!dragging.current) return;
    dragging.current = false;
    document.body.style.userSelect = "";
    bodyRef.current?.setGravityScale(1, true);
  }

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      ccd
      restitution={restitution}
      friction={0.25}
      linearDamping={mode === "attract" ? 1.6 : 0.4}
      angularDamping={0.8}
      position={startPos}
    >
      <BallCollider args={[radius]} />
      <mesh
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "grab";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        scale={radius}
      >
        <sphereGeometry args={[1, 40, 40]} />
        <meshPhysicalMaterial
          color={skill.color}
          roughness={0.35}
          clearcoat={0.8}
          clearcoatRoughness={0.25}
          metalness={0}
          emissive={skill.color}
          emissiveIntensity={hovered ? 0.35 : 0.08}
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
          <mesh position={[0, 0, radius * 1.02]} raycast={() => null}>
            <planeGeometry args={[radius * 1.05, radius * 1.05]} />
            <meshBasicMaterial
              map={texture}
              transparent
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
        )}
        {/* Text fetches its font on first use and suspends meanwhile — without
            its own boundary that suspension blanked the ENTIRE ball scene
            the first time anyone hovered a ball */}
        {hovered && (
          <Suspense fallback={null}>
            <Text
              position={[0, -radius * 1.5, radius * 1.1]}
              fontSize={Math.max(radius * 0.42, 0.26)}
              color="white"
              outlineWidth={radius * 0.045}
              outlineColor="black"
              anchorX="center"
              anchorY="middle"
              raycast={() => null}
            >
              {skill.name}
            </Text>
          </Suspense>
        )}
      </Billboard>
    </RigidBody>
  );
}

/** Invisible kinematic ball that follows the cursor in attract mode. */
function Pusher({ box, mode }: { box: Box; mode: OrbMode }) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const target = useRef<THREE.Vector3 | null>(null);
  const current = useRef(new THREE.Vector3(0, -100, 0));
  const parked = { x: 0, y: -box.halfH - 50, z: 0 };

  useFrame(() => {
    const body = bodyRef.current;
    if (!body) return;
    if (mode !== "attract" || !target.current) {
      current.current.set(parked.x, parked.y, parked.z);
      body.setNextKinematicTranslation(parked);
      return;
    }
    // coming back from parked: jump straight there instead of sweeping
    // through the whole pile on the way
    if (current.current.y < -box.halfH - 10) current.current.copy(target.current);
    current.current.lerp(target.current, 0.35);
    body.setNextKinematicTranslation(current.current);
  });

  return (
    <>
      <RigidBody ref={bodyRef} type="kinematicPosition" colliders={false} position={[0, -100, 0]}>
        <BallCollider args={[box.radius * 1.3]} />
      </RigidBody>
      {/* catches pointer movement anywhere over the frame; sits behind the
          balls so they still get their own hover/drag events first */}
      <mesh
        position={[0, 0, -box.depth - 0.01]}
        onPointerMove={(e) => {
          // a held button means someone is dragging a ball — get out of the way
          if (e.buttons !== 0 || !e.ray.intersectPlane(plane, hit)) {
            target.current = null;
            return;
          }
          target.current = (target.current ?? new THREE.Vector3()).copy(hit);
        }}
        onPointerLeave={() => {
          target.current = null;
        }}
      >
        <planeGeometry args={[box.halfW * 4, box.halfH * 4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

function Walls({ box }: { box: Box }) {
  const { halfW, halfH, depth } = box;
  const T = 1; // wall half-thickness; inner faces sit exactly on the box edges
  const tall = halfH + 20; // side walls reach well above the spawn area
  return (
    <>
      <CuboidCollider position={[0, -halfH - T, 0]} args={[halfW + 2, T, depth + 2]} />
      <CuboidCollider position={[0, halfH + 40 + T, 0]} args={[halfW + 2, T, depth + 2]} />
      <CuboidCollider position={[-halfW - T, tall - halfH, 0]} args={[T, tall, depth + 2]} />
      <CuboidCollider position={[halfW + T, tall - halfH, 0]} args={[T, tall, depth + 2]} />
      <CuboidCollider position={[0, tall - halfH, -depth - T]} args={[halfW + 2, tall, T]} />
      <CuboidCollider position={[0, tall - halfH, depth + T]} args={[halfW + 2, tall, T]} />
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 6]} intensity={1.3} />
      <directionalLight position={[-4, -2, 4]} intensity={0.45} />
    </>
  );
}

/** Scene fragment — render inside a drei <View> in the single global canvas. */
export default function SkillOrbScene({
  skills,
  mode = "drop",
  mobile = false,
  cameraZ,
  fov,
}: {
  skills: OrbSkill[];
  mode?: OrbMode;
  mobile?: boolean;
  cameraZ: number;
  fov: number;
}) {
  const box = useBox(skills.length, cameraZ, fov, mobile);
  return (
    <>
      <Lights />
      <Physics gravity={mode === "drop" ? [0, -9.8, 0] : [0, 0, 0]}>
        <Walls box={box} />
        <Pusher box={box} mode={mode} />
        {skills.map((skill, i) => (
          <Balloon
            key={skill.name}
            skill={skill}
            index={i}
            count={skills.length}
            box={box}
            mode={mode}
          />
        ))}
      </Physics>
    </>
  );
}
