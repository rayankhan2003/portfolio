-- Portfolio projects CMS schema.
-- Apply with: supabase db push   (or paste into the Supabase SQL editor)

-- ============================== admins =====================================
-- Who may write. No public registration exists; you create your own user in
-- the Supabase dashboard (Authentication → Add user), then insert its UUID:
--   insert into public.admins (user_id) values ('<your-auth-user-uuid>');
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Admins can see the admins table (needed for the is_admin() check to work
-- from the client); nobody can write to it through the API.
create policy "admins can read admins"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ============================== projects ===================================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  short_description text not null default '',
  full_description text not null default '',
  cover_image text,                        -- URL (storage public URL or /public path)
  technologies text[] not null default '{}',
  category text not null default '',
  year int,
  role text not null default '',
  github_url text,
  live_url text,
  featured boolean not null default false,
  published boolean not null default false,
  display_order int not null default 0,
  challenge text,
  solution text,
  results text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_published_order_idx
  on public.projects (published, featured, display_order);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

create policy "anyone can read published projects"
  on public.projects for select
  using (published = true or public.is_admin());

create policy "admins can insert projects"
  on public.projects for insert
  to authenticated
  with check (public.is_admin());

create policy "admins can update projects"
  on public.projects for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete projects"
  on public.projects for delete
  to authenticated
  using (public.is_admin());

-- ============================ project_images ===============================
create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  url text not null,
  caption text not null default '',
  alt text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index project_images_project_idx
  on public.project_images (project_id, sort_order);

alter table public.project_images enable row level security;

create policy "anyone can read images of published projects"
  on public.project_images for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.published = true
    )
  );

create policy "admins can insert images"
  on public.project_images for insert
  to authenticated
  with check (public.is_admin());

create policy "admins can update images"
  on public.project_images for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete images"
  on public.project_images for delete
  to authenticated
  using (public.is_admin());

-- ============================== storage ====================================
-- Public-read bucket for project screenshots; only admins may write.
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "public read project images"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "admins upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images' and public.is_admin());

create policy "admins update project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin());

create policy "admins delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin());
