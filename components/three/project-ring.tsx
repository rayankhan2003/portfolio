"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

export interface RingProject {
  slug: string;
  title: string;
  coverImage: string | null;
}

const PANEL_W = 3.2;
const PANEL_H = 2; // 16:10, same as the cards
const BAR_H = 0.18;
const RADIUS = 5.5;
const STEP = 0.72; // radians between neighbouring windows

/** Cover-fit an image texture into the 16:10 panel, anchored to the top
 *  (screenshots matter most at the top, same as object-top on the cards). */
function fitCover(tex: THREE.Texture) {
  const img = tex.image as { width: number; height: number } | undefined;
  if (!img?.width || !img.height) return;
  const imgAspect = img.width / img.height;
  const panelAspect = PANEL_W / PANEL_H;
  tex.repeat.set(1, 1);
  tex.offset.set(0, 0);
  if (imgAspect > panelAspect) {
    tex.repeat.x = panelAspect / imgAspect;
    tex.offset.x = (1 - tex.repeat.x) / 2;
  } else {
    tex.repeat.y = imgAspect / panelAspect;
    tex.offset.y = 1 - tex.repeat.y;
  }
}

/** Title-card texture for projects without a cover (or whose cover fails). */
function placeholderTexture(title: string, dark: boolean) {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 400;
  const g = c.getContext("2d")!;
  g.fillStyle = dark ? "#1d1a16" : "#f3efe9";
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = dark ? "#f0a860" : "#c2661a";
  g.font = "bold 44px monospace";
  g.textAlign = "center";
  g.fillText(title, c.width / 2, c.height / 2, c.width - 60);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function useCoverTexture(project: RingProject, dark: boolean) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let disposed = false;
    let loaded: THREE.Texture | null = null;
    const fallback = () => {
      if (disposed) return;
      loaded = placeholderTexture(project.title, dark);
      setTex(loaded);
    };
    if (!project.coverImage) fallback();
    else {
      new THREE.TextureLoader().load(
        project.coverImage,
        (t) => {
          if (disposed) return t.dispose();
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = 4;
          fitCover(t);
          loaded = t;
          setTex(t);
        },
        undefined,
        fallback
      );
    }
    return () => {
      disposed = true;
      loaded?.dispose();
    };
  }, [project.coverImage, project.title, dark]);
  return tex;
}

function ProjectWindow({
  project,
  index,
  offsetRef,
  dark,
  accent,
  onSelect,
}: {
  project: RingProject;
  index: number;
  offsetRef: React.RefObject<number>;
  dark: boolean;
  accent: string;
  onSelect: (index: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const tex = useCoverTexture(project, dark);
  const [hovered, setHovered] = useState(false);
  const dim = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // angle relative to the front of the ring; wrap-free (a finite arc)
    const theta = (index - offsetRef.current) * STEP;
    g.position.set(Math.sin(theta) * RADIUS, Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.05, Math.cos(theta) * RADIUS - RADIUS);
    g.rotation.y = theta * 0.9;
    const focus = Math.max(0, 1 - Math.abs(theta) / (STEP * 1.2));
    const target = hovered ? 1.04 : 1;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, target, 8, delta));
    // side windows fall back into the dark instead of competing for focus
    if (screen.current) {
      screen.current.color.copy(dim.setScalar(0.35 + 0.65 * focus));
    }
  });

  const frame = dark ? "#26221d" : "#e7e2da";
  const bar = dark ? "#34302a" : "#d8d2c8";

  return (
    <group ref={group}>
      {/* window chrome */}
      <mesh position={[0, BAR_H / 2, -0.01]}>
        <planeGeometry args={[PANEL_W + 0.08, PANEL_H + BAR_H + 0.08]} />
        <meshBasicMaterial color={hovered ? accent : frame} toneMapped={false} />
      </mesh>
      <mesh position={[0, PANEL_H / 2 + BAR_H / 2, 0]}>
        <planeGeometry args={[PANEL_W, BAR_H]} />
        <meshBasicMaterial color={bar} toneMapped={false} />
      </mesh>
      {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
        <mesh key={c} position={[-PANEL_W / 2 + 0.14 + i * 0.13, PANEL_H / 2 + BAR_H / 2, 0.005]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color={c} toneMapped={false} />
        </mesh>
      ))}
      {/* the screenshot */}
      <mesh
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(index);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <planeGeometry args={[PANEL_W, PANEL_H]} />
        {/* keyed on the texture: three.js only rebuilds the shader for a
            map that appears after first render if the material is new */}
        <meshBasicMaterial key={tex?.uuid ?? "none"} ref={screen} map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Scene fragment — render inside a drei <View>. `offsetRef` is the live,
 *  fractional ring position (index + drag), eased by the parent. */
export default function ProjectRing({
  projects,
  offsetRef,
  dark,
  onSelect,
}: {
  projects: RingProject[];
  offsetRef: React.RefObject<number>;
  dark: boolean;
  onSelect: (index: number) => void;
}) {
  const accent = dark ? "#f0a860" : "#c2661a";
  const tilt = useRef<THREE.Group>(null);

  // the whole ring leans gently toward the pointer
  useFrame((state, delta) => {
    const g = tilt.current;
    if (!g) return;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.06, 3, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.08, 3, delta);
  });

  return (
    <group ref={tilt}>
      {projects.map((p, i) => (
        <ProjectWindow
          key={p.slug}
          project={p}
          index={i}
          offsetRef={offsetRef}
          dark={dark}
          accent={accent}
          onSelect={onSelect}
        />
      ))}
      {/* terminal-green-screen floor */}
      <gridHelper
        args={[40, 28, accent, accent]}
        position={[0, -PANEL_H / 2 - 0.6, -2]}
        material-transparent
        material-opacity={0.1}
      />
    </group>
  );
}
