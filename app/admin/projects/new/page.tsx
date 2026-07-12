import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-mono text-xl font-semibold mb-2">new project</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Create the project first — you can upload screenshots on the edit page
        right after saving.
      </p>
      <ProjectForm project={null} />
    </main>
  );
}
