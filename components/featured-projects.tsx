import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import SectionPrompt from "@/components/section-prompt";
import { getFeaturedProjects } from "@/lib/projects/data";
import { FeaturedStack } from "@/components/featured-stack";

export default async function FeaturedProjects() {
  const projects = await getFeaturedProjects(3);

  return (
    <section className="relative max-w-6xl mx-auto px-6 py-24">
      <h2 className="sr-only">Featured projects</h2>
      <SectionPrompt
        path="projects"
        command="ls --featured --limit=3"
        className="mb-10"
      />

      <FeaturedStack projects={projects} />

      <div className="mt-14 text-center">
        <Button asChild size="lg" className="gap-2 font-mono">
          <Link href="/projects">
            view all projects
            <ArrowRight weight="light" className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
