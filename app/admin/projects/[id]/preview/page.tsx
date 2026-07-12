import { notFound } from "next/navigation";
import { getAdminProject } from "@/lib/admin/actions";
import { ProjectDetail } from "@/components/project-detail";

export const dynamic = "force-dynamic";

/** Renders the exact public detail view for a project regardless of its
 *  published state — session-protected, for checking drafts before publish. */
export default async function ProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getAdminProject(id);
  if (!project) notFound();

  return (
    <>
      <p className="bg-primary text-primary-foreground text-center font-mono text-xs py-1.5">
        admin preview — {project.published ? "published" : "draft, not publicly visible"}
      </p>
      <ProjectDetail project={project} />
    </>
  );
}
