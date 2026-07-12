import Link from "next/link";
import { getAdminProjects, signOut } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { AdminProjectRow } from "@/components/admin/project-row";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono text-xl font-semibold">projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} total ·{" "}
            {projects.filter((p) => p.published).length} published
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/admin/projects/new">New project</Link>
          </Button>
          <form action={signOut}>
            <Button variant="outline" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">No projects yet.</p>
          <Button asChild>
            <Link href="/admin/projects/new">Create your first project</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {projects.map((p, i) => (
            <AdminProjectRow
              key={p.id}
              project={p}
              isFirst={i === 0}
              isLast={i === projects.length - 1}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
