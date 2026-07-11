"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowSquareOut, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/reveal";
import SectionPrompt from "@/components/section-prompt";
import TerminalWindow from "@/components/terminal-window";

const PROJECTS = [
  {
    slug: "stayease",
    title: "StayEase",
    description:
      "A hotel management system delivering seamless room bookings, efficient check-ins, and streamlined branch operations — with role-based workflows built for real front-desk teams.",
    tags: ["Next.js", "Tailwind CSS", "Supabase"],
    image: "/images/stayease.webp",
    alt: "StayEase hotel management system screenshot",
    code: "https://github.com/rayankhan2003/StayEase",
    demo: "https://stay-ease-rayan.vercel.app/",
  },
  {
    slug: "project-runner",
    title: "Project Runner",
    description:
      "An all-in-one construction site management platform that centralizes material requests, deliveries, and on-site workflows into a single, easy-to-use system.",
    tags: ["React", "Tailwind CSS", "JavaScript"],
    image: "/images/project-runner.webp",
    alt: "Project Runner website mockup",
    code: "https://github.com/rayankhan2003/project-runner-landing",
    demo: "https://project-runner-landing-seven.vercel.app/",
  },
  {
    slug: "forkify",
    title: "Forkify",
    description:
      "A recipe search app for exploring meals, viewing ingredients and cooking steps, and bookmarking favorites for later.",
    tags: ["HTML", "CSS", "JavaScript"],
    image: "/images/forkify.webp",
    alt: "Forkify recipe website screenshot",
    code: "https://github.com/rayankhan2003/forkify-main",
    demo: "https://forkify-rayan.netlify.app/",
  },
];

function ProjectCase({
  project,
  index,
  reverse,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  reverse: boolean;
}) {
  const imgRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-28, 28]);

  return (
    <Reveal>
      <TerminalWindow title={`~/projects/${project.slug}`}>
        <div
          className={`grid lg:grid-cols-2 gap-0 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
        >
          <div ref={imgRef} className="overflow-hidden">
            <motion.div style={{ y }} className="h-full">
              <Image
                src={project.image}
                alt={project.alt}
                width={700}
                height={560}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">
              case {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
              {project.title}
            </h3>

            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>

            <p className="font-mono text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1">
              {project.tags.map((tag) => (
                <span key={tag} className="text-primary">
                  #{tag.replace(/\s+/g, "").toLowerCase()}
                </span>
              ))}
            </p>

            <div className="flex gap-3 pt-2">
              <Link href={project.code} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 bg-transparent font-mono">
                  <GithubLogo weight="light" className="w-4 h-4" />
                  code
                </Button>
              </Link>
              <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2 font-mono">
                  <ArrowSquareOut weight="light" className="w-4 h-4" />
                  demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </TerminalWindow>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="sr-only">Projects</h2>
      <SectionPrompt path="projects" command="ls -la --sort=recent" className="mb-10" />

      <div className="space-y-10">
        {PROJECTS.map((project, i) => (
          <ProjectCase key={project.slug} project={project} index={i} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
