import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/projects/data";
import { ProjectsGallery } from "@/components/projects-gallery";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects — Rayan Khan",
  description:
    "All projects by Rayan Khan — full-stack web apps built with Next.js, React, and PostgreSQL.",
  alternates: { canonical: "https://rayankhan.dev/projects" },
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <main className="min-h-dvh py-16">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-sm sm:text-base text-muted-foreground mb-2">
          <span className="text-primary">rayan@portfolio</span>
          <span>:~/projects $ ls --interactive</span>
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-10">All projects</h1>
      </div>
      <ProjectsGallery projects={projects} />
    </main>
  );
}
