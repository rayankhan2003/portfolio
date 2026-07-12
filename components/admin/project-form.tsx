"use client";
import Link from "next/link";
import { useActionState } from "react";
import { saveProject, type ActionResult } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Project } from "@/lib/projects/types";

function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ProjectForm({ project }: { project: Project | null }) {
  const bound = saveProject.bind(null, project?.id ?? null);
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    bound,
    null
  );

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Title" htmlFor="title">
          <Input
            id="title"
            name="title"
            required
            defaultValue={project?.title ?? ""}
          />
        </Field>
        <Field
          label="Slug"
          htmlFor="slug"
          hint="lowercase-with-dashes; becomes /projects/<slug>"
        >
          <Input
            id="slug"
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            defaultValue={project?.slug ?? ""}
          />
        </Field>
      </div>

      <Field label="Short description" htmlFor="short_description">
        <Textarea
          id="short_description"
          name="short_description"
          rows={2}
          required
          defaultValue={project?.shortDescription ?? ""}
        />
      </Field>

      <Field label="Full description" htmlFor="full_description">
        <Textarea
          id="full_description"
          name="full_description"
          rows={5}
          defaultValue={project?.fullDescription ?? ""}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Technologies"
          htmlFor="technologies"
          hint="comma-separated, e.g. Next.js, Prisma, PostgreSQL"
        >
          <Input
            id="technologies"
            name="technologies"
            defaultValue={project?.technologies.join(", ") ?? ""}
          />
        </Field>
        <Field label="Category" htmlFor="category">
          <Input
            id="category"
            name="category"
            defaultValue={project?.category ?? ""}
          />
        </Field>
        <Field label="Year" htmlFor="year">
          <Input
            id="year"
            name="year"
            type="number"
            min={2000}
            max={2100}
            defaultValue={project?.year ?? ""}
          />
        </Field>
        <Field label="My role" htmlFor="role">
          <Input id="role" name="role" defaultValue={project?.role ?? ""} />
        </Field>
        <Field label="GitHub URL" htmlFor="github_url">
          <Input
            id="github_url"
            name="github_url"
            type="url"
            placeholder="https://github.com/…"
            defaultValue={project?.githubUrl ?? ""}
          />
        </Field>
        <Field label="Live URL" htmlFor="live_url">
          <Input
            id="live_url"
            name="live_url"
            type="url"
            placeholder="https://…"
            defaultValue={project?.liveUrl ?? ""}
          />
        </Field>
      </div>

      <Field label="Challenge (optional)" htmlFor="challenge">
        <Textarea
          id="challenge"
          name="challenge"
          rows={3}
          defaultValue={project?.challenge ?? ""}
        />
      </Field>
      <Field label="Solution (optional)" htmlFor="solution">
        <Textarea
          id="solution"
          name="solution"
          rows={3}
          defaultValue={project?.solution ?? ""}
        />
      </Field>
      <Field label="Results (optional)" htmlFor="results">
        <Textarea
          id="results"
          name="results"
          rows={3}
          defaultValue={project?.results ?? ""}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-8 rounded-lg border border-border p-4">
        <label className="flex items-center gap-3 text-sm font-medium">
          <Switch name="published" defaultChecked={project?.published ?? false} />
          Published
        </label>
        <label className="flex items-center gap-3 text-sm font-medium">
          <Switch name="featured" defaultChecked={project?.featured ?? false} />
          Featured on homepage
        </label>
      </div>

      {state && !state.ok && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="text-sm text-primary">
          Saved.
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : project ? "Save changes" : "Create project"}
        </Button>
        {project && (
          <Button asChild variant="outline">
            <Link href={`/admin/projects/${project.id}/preview`} target="_blank">
              Preview
            </Link>
          </Button>
        )}
        <Button asChild variant="ghost">
          <Link href="/admin/projects">Back to list</Link>
        </Button>
      </div>
    </form>
  );
}
