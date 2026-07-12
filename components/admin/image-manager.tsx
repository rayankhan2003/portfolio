"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  deleteImage,
  reorderImages,
  setCoverImage,
  updateImageMeta,
  uploadProjectImage,
} from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Project } from "@/lib/projects/types";

export function ImageManager({ project }: { project: Project }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    start(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Failed");
      router.refresh();
    });
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    start(async () => {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.set("file", file);
        const res = await uploadProjectImage(project.id, fd);
        if (!res.ok) {
          setError(res.error ?? "Upload failed");
          break;
        }
      }
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    });
  }

  function onDropOn(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const ids = project.images.map((i) => i.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    setDragId(null);
    run(() => reorderImages(project.id, ids));
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm font-semibold">
          screenshots ({project.images.length})
        </h2>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            className="sr-only"
            id="image-upload"
            onChange={(e) => onUpload(e.target.files)}
          />
          <Button asChild variant="outline" size="sm" disabled={pending}>
            <label htmlFor="image-upload" className="cursor-pointer">
              {pending ? "Working…" : "Upload images"}
            </label>
          </Button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {project.images.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No screenshots yet. Upload PNG/JPEG/WebP up to 8 MB.
        </p>
      ) : (
        <ul className="space-y-3">
          {project.images.map((img) => (
            <li
              key={img.id}
              draggable
              onDragStart={() => setDragId(img.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropOn(img.id)}
              className={`flex flex-wrap items-center gap-4 rounded-lg border bg-card p-3 ${
                dragId === img.id ? "border-primary opacity-60" : "border-border"
              }`}
            >
              <span
                aria-hidden
                title="Drag to reorder"
                className="cursor-grab font-mono text-muted-foreground"
              >
                ⠿
              </span>
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded border border-border">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="112px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                <Input
                  aria-label="Caption"
                  placeholder="Caption"
                  defaultValue={img.caption}
                  onBlur={(e) =>
                    e.target.value !== img.caption &&
                    run(() => updateImageMeta(img.id, e.target.value, img.alt))
                  }
                />
                <Input
                  aria-label="Alt text"
                  placeholder="Alt text"
                  defaultValue={img.alt}
                  onBlur={(e) =>
                    e.target.value !== img.alt &&
                    run(() =>
                      updateImageMeta(img.id, img.caption, e.target.value)
                    )
                  }
                />
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pending || project.coverImage === img.url}
                  onClick={() => run(() => setCoverImage(project.id, img.url))}
                >
                  {project.coverImage === img.url ? "Cover ✓" : "Set cover"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  disabled={pending}
                  onClick={() => {
                    if (confirm("Delete this image?")) {
                      run(() => deleteImage(img.id));
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
