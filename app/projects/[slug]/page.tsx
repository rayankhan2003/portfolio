import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAdjacentProjects,
  getProjectBySlug,
  getPublishedProjects,
} from "@/lib/projects/data";
import { ProjectDetail } from "@/components/project-detail";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const url = `https://rayankhan.dev/projects/${project.slug}`;
  return {
    title: `${project.title} — Rayan Khan`,
    description: project.shortDescription,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      url,
      type: "article",
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const { prev, next } = await getAdjacentProjects(slug);

  return <ProjectDetail project={project} prev={prev} next={next} />;
}
