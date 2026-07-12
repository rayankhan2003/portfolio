"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import TerminalWindow from "@/components/terminal-window";
import type { Project } from "@/lib/projects/types";

function GalleryCard({ project, active }: { project: Project; active: boolean }) {
  return (
    <TerminalWindow
      title={`~/projects/${project.slug}`}
      className={active ? "" : "pointer-events-none"}
    >
      <div className="relative aspect-[16/10] bg-secondary">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={`${project.title} cover`}
            fill
            sizes="(max-width: 1024px) 90vw, 720px"
            className="object-cover object-top"
            unoptimized={project.coverImage.startsWith("http")}
          />
        )}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold">{project.title}</h2>
          <p className="font-mono text-xs text-muted-foreground">
            {[project.year, project.category].filter(Boolean).join(" · ")}
          </p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {project.shortDescription}
        </p>
        <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs">
          {project.technologies.slice(0, 5).map((t) => (
            <span key={t} className="text-primary">
              #{t.replace(/\s+/g, "").toLowerCase()}
            </span>
          ))}
        </p>
      </div>
    </TerminalWindow>
  );
}

export function ProjectsGallery({ projects }: { projects: Project[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const wheelLock = useRef(0);

  const categories = useMemo(
    () => [...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects]
  );
  const visible = useMemo(
    () => (category ? projects.filter((p) => p.category === category) : projects),
    [projects, category]
  );
  const count = visible.length;
  const current = visible[Math.min(index, count - 1)];

  const go = useCallback(
    (dir: 1 | -1) => {
      if (count < 2) return;
      setIndex((i) => (i + dir + count) % count);
    },
    [count]
  );

  useEffect(() => setIndex(0), [category]);

  function onWheel(e: React.WheelEvent) {
    const now = Date.now();
    if (now - wheelLock.current < 450) return;
    if (Math.abs(e.deltaY) < 12 && Math.abs(e.deltaX) < 12) return;
    wheelLock.current = now;
    go(e.deltaY + e.deltaX > 0 ? 1 : -1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  }

  if (count === 0) {
    return (
      <p className="max-w-6xl mx-auto px-6 font-mono text-sm text-muted-foreground">
        ls: no projects found{category ? ` in ${category}` : ""}.
      </p>
    );
  }

  const neighbors = (offset: number) => visible[(index + offset + count) % count];

  return (
    <div>
      {categories.length > 1 && (
        <div
          role="group"
          aria-label="Filter by category"
          className="max-w-6xl mx-auto px-6 mb-8 flex flex-wrap gap-2"
        >
          <Button
            variant={category === null ? "default" : "outline"}
            size="sm"
            className="font-mono"
            onClick={() => setCategory(null)}
          >
            all
          </Button>
          {categories.map((c) => (
            <Button
              key={c}
              variant={category === c ? "default" : "outline"}
              size="sm"
              className="font-mono"
              onClick={() => setCategory(c)}
            >
              {c.toLowerCase()}
            </Button>
          ))}
        </div>
      )}

      {/* desktop: center-stage deck */}
      <section
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
        className="hidden lg:block relative mx-auto max-w-6xl px-6 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
      >
        <div className="relative h-[640px] overflow-hidden">
          {/* rear neighbors */}
          {count > 1 &&
            [-1, 1].map((offset) => {
              const p = neighbors(offset);
              if (count === 2 && offset === 1) return null;
              return (
                <motion.div
                  key={`${p.id}-${offset}`}
                  aria-hidden="true"
                  initial={false}
                  animate={{
                    x: offset * 420,
                    scale: 0.78,
                    opacity: 0.35,
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 220, damping: 28 }
                  }
                  className="absolute inset-x-0 top-6 mx-auto w-[680px] blur-[1px]"
                >
                  <GalleryCard project={p} active={false} />
                </motion.div>
              );
            })}

          {/* active card */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={current.id}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
              transition={
                reduceMotion
                  ? { duration: 0.1 }
                  : { type: "spring", stiffness: 240, damping: 26 }
              }
              drag={count > 1 && !reduceMotion ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(1);
                else if (info.offset.x > 80) go(-1);
              }}
              className="absolute inset-x-0 top-0 z-10 mx-auto w-[720px] cursor-grab active:cursor-grabbing"
            >
              <Link
                href={`/projects/${current.slug}`}
                className="block"
                draggable={false}
                aria-label={`Open ${current.title}`}
              >
                <GalleryCard project={current} active />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(-1)}
            disabled={count < 2}
            aria-label="Previous project"
          >
            <ArrowLeft weight="light" className="w-4 h-4" />
          </Button>
          <p aria-live="polite" className="font-mono text-xs text-muted-foreground">
            {Math.min(index, count - 1) + 1} / {count} — {current.title}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(1)}
            disabled={count < 2}
            aria-label="Next project"
          >
            <ArrowRight weight="light" className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* mobile / tablet: plain responsive grid */}
      <div className="lg:hidden max-w-6xl mx-auto px-6 grid gap-8 sm:grid-cols-2">
        {visible.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            aria-label={`Open ${p.title}`}
          >
            <GalleryCard project={p} active />
          </Link>
        ))}
      </div>

      {/* index list — works without JS, doubles as quick navigation */}
      <nav
        aria-label="All projects list"
        className="max-w-6xl mx-auto px-6 mt-12 hidden lg:block"
      >
        <ul className="font-mono text-sm space-y-1">
          {visible.map((p, i) => (
            <li key={p.id}>
              <Link
                href={`/projects/${p.slug}`}
                className={`transition-colors hover:text-primary ${
                  i === Math.min(index, count - 1)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {String(i + 1).padStart(2, "0")} · {p.title}
                {p.year ? ` — ${p.year}` : ""}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
