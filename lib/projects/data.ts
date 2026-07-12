import { createAnonClient, supabaseConfigured } from "@/lib/supabase/server";
import { SEED_PROJECTS } from "./seed";
import type { Project, ProjectImage } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapImage(row: any): ProjectImage {
  return {
    id: row.id,
    url: row.url,
    caption: row.caption ?? "",
    alt: row.alt ?? "",
    sortOrder: row.sort_order ?? 0,
  };
}

export function mapProject(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description ?? "",
    fullDescription: row.full_description ?? "",
    coverImage: row.cover_image ?? null,
    technologies: row.technologies ?? [],
    category: row.category ?? "",
    year: row.year ?? null,
    role: row.role ?? "",
    githubUrl: row.github_url ?? null,
    liveUrl: row.live_url ?? null,
    featured: row.featured ?? false,
    published: row.published ?? false,
    displayOrder: row.display_order ?? 0,
    challenge: row.challenge ?? null,
    solution: row.solution ?? null,
    results: row.results ?? null,
    images: (row.project_images ?? [])
      .map(mapImage)
      .sort((a: ProjectImage, b: ProjectImage) => a.sortOrder - b.sortOrder),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const PROJECT_SELECT = "*, project_images(*)";

function seedPublished(): Project[] {
  return SEED_PROJECTS.filter((p) => p.published).sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
}

export async function getPublishedProjects(): Promise<Project[]> {
  if (!supabaseConfigured()) return seedPublished();
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("published", true)
    .order("display_order", { ascending: true });
  if (error || !data) return seedPublished();
  return data.map(mapProject);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getPublishedProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!supabaseConfigured()) {
    return seedPublished().find((p) => p.slug === slug) ?? null;
  }
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  return mapProject(data);
}

export async function getAdjacentProjects(
  slug: string
): Promise<{ prev: Project | null; next: Project | null }> {
  const all = await getPublishedProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? all[i - 1] : null,
    next: i < all.length - 1 ? all[i + 1] : null,
  };
}
