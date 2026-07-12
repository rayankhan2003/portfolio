"use client";
import SectionWebGL from "@/components/three/section-webgl";
import type { ShardConfig } from "@/components/three/wireframe-field";

const GITHUB_SHARDS: ShardConfig[] = [
  { position: [-6.5, 2, -5], scale: 1.6, speed: 0.08 },
  { position: [6.8, -1.8, -6], scale: 2, speed: 0.06 },
  { position: [-5.8, -2.4, -7.5], scale: 1.2, speed: 0.1 },
];

/** Client wrapper so the server-rendered GithubActivity section can still
 *  get a 3D backdrop — SectionWebGL relies on hooks (theme, refs). */
export default function GithubShards() {
  return <SectionWebGL shards={GITHUB_SHARDS} cameraZ={5} shape="box" />;
}
