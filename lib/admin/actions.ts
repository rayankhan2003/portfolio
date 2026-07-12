"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSessionClient } from "@/lib/supabase/server";
import { mapProject } from "@/lib/projects/data";
import type { Project } from "@/lib/projects/types";

// ---------------------------------------------------------------- helpers

async function requireAdmin() {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const { data } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) throw new Error("Signed in, but not an admin");
  return supabase;
}

function revalidatePublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  if (slug) revalidatePath(`/projects/${slug}`);
}

export type ActionResult = { ok: true } | { ok: false; error: string };

function fail(err: unknown): ActionResult {
  return {
    ok: false,
    error: err instanceof Error ? err.message : "Something went wrong",
  };
}

// ------------------------------------------------------------------- auth

export async function signIn(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: "Invalid email or password" };
  redirect("/admin/projects");
}

export async function signOut(): Promise<void> {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- projects

const urlOrEmpty = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .pipe(z.string().url().nullable());

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug: lowercase letters, digits, dashes"),
  short_description: z.string().trim().min(1, "Short description is required"),
  full_description: z.string().trim().default(""),
  technologies: z
    .string()
    .default("")
    .transform((v) =>
      v
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    ),
  category: z.string().trim().default(""),
  year: z
    .string()
    .default("")
    .transform((v) => (v.trim() === "" ? null : Number(v)))
    .pipe(z.number().int().min(2000).max(2100).nullable()),
  role: z.string().trim().default(""),
  github_url: urlOrEmpty,
  live_url: urlOrEmpty,
  challenge: z.string().trim().transform((v) => v || null),
  solution: z.string().trim().transform((v) => v || null),
  results: z.string().trim().transform((v) => v || null),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(false),
});

export async function saveProject(
  id: string | null,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const parsed = projectSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0].message };
    }
    if (id) {
      const { error } = await supabase
        .from("projects")
        .update(parsed.data)
        .eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      const { data: max } = await supabase
        .from("projects")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      const { error } = await supabase.from("projects").insert({
        ...parsed.data,
        display_order: (max?.display_order ?? -1) + 1,
      });
      if (error) throw new Error(error.message);
    }
    revalidatePublic(parsed.data.slug);
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function moveProject(
  id: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { data: rows, error } = await supabase
      .from("projects")
      .select("id, display_order")
      .order("display_order", { ascending: true });
    if (error || !rows) throw new Error(error?.message ?? "load failed");
    const i = rows.findIndex((r) => r.id === id);
    const j = direction === "up" ? i - 1 : i + 1;
    if (i === -1 || j < 0 || j >= rows.length) return { ok: true };
    const a = rows[i];
    const b = rows[j];
    await supabase
      .from("projects")
      .update({ display_order: b.display_order })
      .eq("id", a.id);
    await supabase
      .from("projects")
      .update({ display_order: a.display_order })
      .eq("id", b.id);
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

// ------------------------------------------------------------------ images

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function uploadProjectImage(
  projectId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "No file selected" };
    }
    if (!IMAGE_TYPES.includes(file.type)) {
      return { ok: false, error: "Only PNG, JPEG, WebP, or GIF images" };
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return { ok: false, error: "Image is larger than 8 MB" };
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const path = `${projectId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("project-images")
      .upload(path, file, { contentType: file.type });
    if (upErr) throw new Error(upErr.message);
    const {
      data: { publicUrl },
    } = supabase.storage.from("project-images").getPublicUrl(path);

    const { data: max } = await supabase
      .from("project_images")
      .select("sort_order")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { error } = await supabase.from("project_images").insert({
      project_id: projectId,
      url: publicUrl,
      alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      sort_order: (max?.sort_order ?? -1) + 1,
    });
    if (error) throw new Error(error.message);
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function updateImageMeta(
  imageId: string,
  caption: string,
  alt: string
): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase
      .from("project_images")
      .update({ caption: caption.slice(0, 300), alt: alt.slice(0, 300) })
      .eq("id", imageId);
    if (error) throw new Error(error.message);
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function reorderImages(
  projectId: string,
  orderedIds: string[]
): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await supabase
        .from("project_images")
        .update({ sort_order: i })
        .eq("id", orderedIds[i])
        .eq("project_id", projectId);
      if (error) throw new Error(error.message);
    }
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteImage(imageId: string): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { data: img } = await supabase
      .from("project_images")
      .select("url")
      .eq("id", imageId)
      .maybeSingle();
    const { error } = await supabase
      .from("project_images")
      .delete()
      .eq("id", imageId);
    if (error) throw new Error(error.message);
    // best-effort removal from storage (public URL → bucket path)
    const marker = "/project-images/";
    const idx = img?.url?.indexOf(marker) ?? -1;
    if (img && idx !== -1) {
      await supabase.storage
        .from("project-images")
        .remove([img.url.slice(idx + marker.length)]);
    }
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

export async function setCoverImage(
  projectId: string,
  url: string
): Promise<ActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase
      .from("projects")
      .update({ cover_image: url })
      .eq("id", projectId);
    if (error) throw new Error(error.message);
    revalidatePublic();
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

// --------------------------------------------------------------- admin reads

export async function getAdminProjects(): Promise<Project[]> {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .order("display_order", { ascending: true });
  if (error || !data) return [];
  return data.map(mapProject);
}

export async function getAdminProject(id: string): Promise<Project | null> {
  const supabase = await requireAdmin();
  const { data } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("id", id)
    .maybeSingle();
  return data ? mapProject(data) : null;
}
