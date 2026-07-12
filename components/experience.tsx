"use client";
import { motion } from "motion/react";
import Reveal from "@/components/reveal";
import SectionPrompt from "@/components/section-prompt";
import TerminalWindow from "@/components/terminal-window";
import SectionWebGL from "@/components/three/section-webgl";
import type { ShardConfig } from "@/components/three/wireframe-field";

const EXPERIENCE_SHARDS: ShardConfig[] = [
  { position: [-6.5, 2, -5], scale: 1.3, speed: 0.09 },
  { position: [6.8, -2.2, -6], scale: 1.7, speed: 0.07 },
  { position: [-5.8, -2.6, -7.5], scale: 1, speed: 0.1 },
];

const COMMITS = [
  {
    hash: "8f2a1c9",
    tag: "HEAD -> main",
    date: "2021-11 — present",
    title: "Enrolled: BSc Computer Science",
    body: "Edwardes College, Peshawar. Currently in 8th semester.",
  },
  {
    hash: "3d7e650",
    date: "ongoing",
    title: "Facilitated guest speaker sessions",
    body: "Including a Breast Cancer Empowerment awareness program at Edwardes College.",
  },
  {
    hash: "b41f0aa",
    date: "ongoing",
    title: "Contributed to collaborative dev projects",
    body: "Small team projects at university level, focused on clean code and user-centered design.",
  },
  {
    hash: "1c9d3e2",
    date: "ongoing",
    title: "Attended coding & web dev workshops",
    body: "University-level workshops strengthening front-end and full-stack skills.",
  },
  {
    hash: "a0e77bc",
    date: "ongoing",
    title: "Active in open-source & dev communities",
    body: "Following modern web development trends, learning from the community.",
  },
];

export default function Experience() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 py-24">
      <SectionWebGL shards={EXPERIENCE_SHARDS} cameraZ={6} shape="octahedron" />
      <h2 className="sr-only">Experience &amp; Education</h2>
      <SectionPrompt path="experience" command="git log --graph --oneline" className="mb-10" />

      <Reveal>
        <TerminalWindow title="experience.log" contentClassName="p-6 sm:p-8">
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-8">
              {COMMITS.map((commit, i) => (
                <motion.div
                  key={commit.hash}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                  className="relative flex gap-4 pl-0"
                >
                  <div className="relative z-10 mt-1.5 shrink-0">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 ${
                        i === 0
                          ? "bg-primary border-primary"
                          : "bg-background border-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-muted-foreground mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-primary">{commit.hash}</span>
                      {commit.tag && (
                        <span className="text-foreground/70">({commit.tag})</span>
                      )}
                      <span>{commit.date}</span>
                    </p>
                    <p className="font-semibold text-foreground">{commit.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {commit.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TerminalWindow>
      </Reveal>
    </section>
  );
}
