"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Reveal from "@/components/reveal";
import SectionPrompt from "@/components/section-prompt";
import TerminalWindow from "@/components/terminal-window";
import SectionWebGL from "@/components/three/section-webgl";
import type { ShardConfig } from "@/components/three/wireframe-field";

// pushed well out past the cards on both sides — full-bleed View gives
// plenty of room now, so these read as clean rings, not a tangled overlap
const ABOUT_SHARDS: ShardConfig[] = [
  { position: [-6.8, 1.8, -5], scale: 1.9, speed: 0.1 },
  { position: [7.2, -1.6, -6], scale: 2.3, speed: 0.07 },
  { position: [-6, -2.6, -8], scale: 1.5, speed: 0.09 },
];

export const FILE_LINES = [
  { key: "role", value: "Full-Stack Web Developer" },
  { key: "location", value: "Peshawar, Pakistan" },
  { key: "focus", value: "React · Next.js · Node.js" },
  { key: "status", value: "open to work" },
];

export const BIO =
  "I'm Rayan Khan. I work across the full stack — clean, responsive interfaces with React and Tailwind on the front end, reliable APIs and server logic with Node.js on the back. I like writing code that works and that also makes life easier for whoever's using it. Outside the editor, I like sharing ideas and learning new ways to solve real problems through software.";

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const lineVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function About() {
  const imgRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-32, 32]);

  return (
    <section className="relative max-w-6xl mx-auto px-6 py-24">
      <SectionWebGL shards={ABOUT_SHARDS} cameraZ={5} shape="torus" />
      <h2 className="sr-only">About</h2>
      <SectionPrompt path="about" command="cat about.md" className="mb-10" />

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
        <Reveal>
          <TerminalWindow title="about.md" contentClassName="p-6 sm:p-8">
            <motion.dl
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="font-mono text-sm space-y-1.5 mb-6"
            >
              {FILE_LINES.map(({ key, value }) => (
                <motion.div key={key} variants={lineVariants} className="flex gap-3">
                  <dt className="text-primary shrink-0">{key}:</dt>
                  <dd className="text-muted-foreground">{value}</dd>
                </motion.div>
              ))}
            </motion.dl>

            <div className="h-px bg-border mb-6" />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-foreground/90 text-base sm:text-lg leading-relaxed"
            >
              {BIO}
            </motion.p>
          </TerminalWindow>
        </Reveal>

        <Reveal delay={0.15} className="relative" x={24}>
          <div ref={imgRef}>
            <motion.div style={{ y }}>
              <TerminalWindow title="workspace.jpg">
                <Image
                  src="/images/workspace.jpg"
                  alt="Rayan's development workspace with laptop, tablet, and coffee"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </TerminalWindow>
            </motion.div>
          </div>

          <div className="absolute -bottom-4 left-4 sm:left-8 flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            available for freelance
          </div>
        </Reveal>
      </div>
    </section>
  );
}
