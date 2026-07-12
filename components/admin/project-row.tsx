"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProject, moveProject } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/projects/types";

export function AdminProjectRow({
  project,
  isFirst,
  isLast,
}: {
  project: Project;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function run(fn: () => Promise<unknown>) {
    start(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <li className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded border border-border bg-secondary">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt=""
            fill
            sizes="96px"
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {project.title}{" "}
          <span className="font-mono text-xs text-muted-foreground">
            /{project.slug}
          </span>
        </p>
        <p className="mt-0.5 flex gap-2 font-mono text-xs">
          <span
            className={project.published ? "text-primary" : "text-muted-foreground"}
          >
            {project.published ? "published" : "draft"}
          </span>
          {project.featured && <span className="text-primary">featured</span>}
          <span className="text-muted-foreground">
            {project.images.length} images
          </span>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={pending || isFirst}
          onClick={() => run(() => moveProject(project.id, "up"))}
          aria-label={`Move ${project.title} up`}
        >
          ↑
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pending || isLast}
          onClick={() => run(() => moveProject(project.id, "down"))}
          aria-label={`Move ${project.title} down`}
        >
          ↓
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/projects/${project.id}/edit`}>Edit</Link>
        </Button>
        {confirming ? (
          <>
            <Button
              variant="destructive"
              size="sm"
              disabled={pending}
              onClick={() => run(() => deleteProject(project.id))}
            >
              Confirm delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            onClick={() => setConfirming(true)}
          >
            Delete
          </Button>
        )}
      </div>
    </li>
  );
}
