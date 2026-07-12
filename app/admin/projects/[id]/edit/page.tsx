import { notFound } from "next/navigation";
import { getAdminProject } from "@/lib/admin/actions";
import { ProjectForm } from "@/components/admin/project-form";
import { ImageManager } from "@/components/admin/image-manager";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getAdminProject(id);
  if (!project) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
      <div>
        <h1 className="font-mono text-xl font-semibold mb-8">
          edit · {project.title}
        </h1>
        <ProjectForm project={project} />
      </div>
      <hr className="border-border" />
      <ImageManager project={project} />
    </main>
  );
}
