import Image from "next/image";
import Link from "next/link";
import {
  ArrowSquareOut,
  GithubLogo,
  ArrowLeft,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import TerminalWindow from "@/components/terminal-window";
import type { Project } from "@/lib/projects/types";

function CaseSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-mono text-sm text-primary mb-2"># {heading}</h2>
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </section>
  );
}

export function ProjectDetail({
  project,
  prev,
  next,
}: {
  project: Project;
  prev?: Project | null;
  next?: Project | null;
}) {
  const facts: Array<[string, string]> = [];
  if (project.role) facts.push(["role", project.role]);
  if (project.year) facts.push(["year", String(project.year)]);
  if (project.category) facts.push(["category", project.category]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-sm text-muted-foreground mb-8">
        <Link href="/projects" className="hover:text-primary transition-colors">
          ~/projects
        </Link>
        <span> / {project.slug}</span>
      </p>

      {project.coverImage && (
        <TerminalWindow title={`~/projects/${project.slug}`} className="mb-10">
          <Image
            src={project.coverImage}
            alt={`${project.title} cover`}
            width={1440}
            height={900}
            priority
            className="w-full h-auto"
            unoptimized={project.coverImage.startsWith("http")}
          />
        </TerminalWindow>
      )}

      <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {project.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {project.shortDescription}
          </p>
        </div>
        <div className="flex gap-3">
          {project.githubUrl && (
            <Button asChild variant="outline" className="gap-2 font-mono">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <GithubLogo weight="light" className="w-4 h-4" />
                code
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button asChild className="gap-2 font-mono">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ArrowSquareOut weight="light" className="w-4 h-4" />
                live
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 font-mono text-sm border-y border-border py-4 mb-10">
        {facts.map(([k, v]) => (
          <p key={k}>
            <span className="text-primary">{k}:</span>{" "}
            <span className="text-muted-foreground">{v}</span>
          </p>
        ))}
      </div>

      <div className="space-y-8 mb-12">
        {project.fullDescription && (
          <CaseSection heading="about">{project.fullDescription}</CaseSection>
        )}
        {project.challenge && (
          <CaseSection heading="challenge">{project.challenge}</CaseSection>
        )}
        {project.solution && (
          <CaseSection heading="solution">{project.solution}</CaseSection>
        )}
        {project.results && (
          <CaseSection heading="results">{project.results}</CaseSection>
        )}
      </div>

      {project.technologies.length > 0 && (
        <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-sm mb-14">
          {project.technologies.map((t) => (
            <span key={t} className="text-primary">
              #{t.replace(/\s+/g, "").toLowerCase()}
            </span>
          ))}
        </p>
      )}

      {project.images.length > 0 && (
        <div className="space-y-10 mb-16">
          {project.images.map((img) => (
            <figure key={img.id}>
              <TerminalWindow title={img.caption || project.title}>
                <Image
                  src={img.url}
                  alt={img.alt || `${project.title} screenshot`}
                  width={1440}
                  height={900}
                  loading="lazy"
                  className="w-full h-auto"
                  unoptimized={img.url.startsWith("http")}
                />
              </TerminalWindow>
              {img.caption && (
                <figcaption className="mt-2 text-center font-mono text-xs text-muted-foreground">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {(prev || next) && (
        <nav
          aria-label="Adjacent projects"
          className="flex justify-between border-t border-border pt-8 font-mono text-sm"
        >
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft weight="light" className="w-4 h-4" />
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              {next.title}
              <ArrowRight weight="light" className="w-4 h-4" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </main>
  );
}
