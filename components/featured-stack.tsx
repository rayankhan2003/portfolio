"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowSquareOut, GithubLogo, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import TerminalWindow from "@/components/terminal-window";
import type { Project } from "@/lib/projects/types";

function CardContent({ project, index }: { project: Project; index: number }) {
  return (
    <TerminalWindow title={`~/projects/${project.slug}`} className="shadow-2xl">
      <div className="grid lg:grid-cols-2">
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`Open ${project.title} case study`}
          className="relative block aspect-[16/10] lg:aspect-auto lg:min-h-[380px] bg-secondary overflow-hidden"
        >
          {project.coverImage && (
            <Image
              src={project.coverImage}
              alt={`${project.title} cover`}
              fill
              sizes="(max-width: 1024px) 90vw, 560px"
              className="object-cover object-top"
              unoptimized={project.coverImage.startsWith("http")}
            />
          )}
        </Link>

        <div className="p-6 sm:p-8 flex flex-col justify-center gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            featured {String(index + 1).padStart(2, "0")}
            {project.year ? ` · ${project.year}` : ""}
            {project.category ? ` · ${project.category}` : ""}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold">
            <Link
              href={`/projects/${project.slug}`}
              className="hover:text-primary transition-colors"
            >
              {project.title}
            </Link>
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {project.shortDescription}
          </p>
          <p className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs">
            {project.technologies.slice(0, 6).map((t) => (
              <span key={t} className="text-primary">
                #{t.replace(/\s+/g, "").toLowerCase()}
              </span>
            ))}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="sm" className="gap-2 font-mono">
              <Link href={`/projects/${project.slug}`}>
                case study
                <ArrowRight weight="light" className="w-4 h-4" />
              </Link>
            </Button>
            {project.githubUrl && (
              <Button asChild size="sm" variant="outline" className="gap-2 font-mono">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <GithubLogo weight="light" className="w-4 h-4" />
                  code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild size="sm" variant="outline" className="gap-2 font-mono">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ArrowSquareOut weight="light" className="w-4 h-4" />
                  live
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </TerminalWindow>
  );
}

function StackedCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // as the NEXT card scrolls over this one, this one settles back slightly
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const isLast = index === total - 1;

  return (
    <div
      ref={ref}
      className="lg:sticky"
      style={{ top: `calc(6rem + ${index * 1.75}rem)` }}
    >
      <motion.div
        style={reduceMotion || isLast ? undefined : { scale }}
        className="origin-top"
      >
        <CardContent project={project} index={index} />
      </motion.div>
      {!isLast && <div className="h-16 lg:h-40" aria-hidden="true" />}
    </div>
  );
}

export function FeaturedStack({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="font-mono text-sm text-muted-foreground">
        ls: no featured projects yet.
      </p>
    );
  }

  return (
    <div>
      {projects.map((p, i) => (
        <StackedCard key={p.id} project={p} index={i} total={projects.length} />
      ))}
    </div>
  );
}
