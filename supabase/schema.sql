create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  auth_user_id uuid unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_users_auth_user_id_fkey
    foreign key (auth_user_id) references auth.users (id) on delete set null
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where is_active = true
      and (
        auth_user_id = auth.uid()
        or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  display_name text not null,
  headline text,
  bio text,
  location text,
  availability text default 'Available for work',
  cv_url text,
  contact_email text,
  contact_cta_text text,
  footer_summary text,
  avatar_url text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_auth_user_id_fkey
    foreign key (auth_user_id) references auth.users (id) on delete set null
);

alter table public.profile
  add column if not exists contact_email text,
  add column if not exists contact_cta_text text,
  add column if not exists footer_summary text;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  summary text,
  cover_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  stack text[] not null default '{}',
  year integer,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  live_url text,
  repo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects
  add column if not exists category text;

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  graduation_label text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coursework (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  title text not null,
  company text not null,
  summary text,
  highlights text[] not null default '{}',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  year text not null,
  image_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stack_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  icon_url text,
  icon_class text,
  website_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stack_items
  add column if not exists icon_class text;

alter table public.stack_items
  alter column icon_url drop not null;

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  icon_name text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_sort_idx
  on public.projects (status, sort_order, year desc nulls last);

create index if not exists stack_items_category_sort_idx
  on public.stack_items (category, sort_order);

create index if not exists social_links_sort_idx
  on public.social_links (sort_order);

create index if not exists education_sort_idx
  on public.education (sort_order);

create index if not exists coursework_sort_idx
  on public.coursework (sort_order);

create index if not exists experience_sort_idx
  on public.experience (sort_order);

create index if not exists certificates_sort_idx
  on public.certificates (sort_order);

create index if not exists admin_users_email_idx
  on public.admin_users (lower(email));

drop trigger if exists profile_set_updated_at on public.profile;
create trigger profile_set_updated_at
before update on public.profile
for each row execute procedure public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute procedure public.set_updated_at();

drop trigger if exists stack_items_set_updated_at on public.stack_items;
create trigger stack_items_set_updated_at
before update on public.stack_items
for each row execute procedure public.set_updated_at();

drop trigger if exists social_links_set_updated_at on public.social_links;
create trigger social_links_set_updated_at
before update on public.social_links
for each row execute procedure public.set_updated_at();

drop trigger if exists education_set_updated_at on public.education;
create trigger education_set_updated_at
before update on public.education
for each row execute procedure public.set_updated_at();

drop trigger if exists coursework_set_updated_at on public.coursework;
create trigger coursework_set_updated_at
before update on public.coursework
for each row execute procedure public.set_updated_at();

drop trigger if exists experience_set_updated_at on public.experience;
create trigger experience_set_updated_at
before update on public.experience
for each row execute procedure public.set_updated_at();

drop trigger if exists certificates_set_updated_at on public.certificates;
create trigger certificates_set_updated_at
before update on public.certificates
for each row execute procedure public.set_updated_at();

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at
before update on public.admin_users
for each row execute procedure public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.stack_items enable row level security;
alter table public.social_links enable row level security;
alter table public.education enable row level security;
alter table public.coursework enable row level security;
alter table public.experience enable row level security;
alter table public.certificates enable row level security;

drop policy if exists "authenticated can read own admin row" on public.admin_users;
create policy "authenticated can read own admin row"
on public.admin_users
for select
to authenticated
using (
  auth_user_id = auth.uid()
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

drop policy if exists "admins can manage admin users" on public.admin_users;
create policy "admins can manage admin users"
on public.admin_users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read profile" on public.profile;
create policy "public can read profile"
on public.profile
for select
to anon, authenticated
using (is_public = true);

drop policy if exists "admins can manage profile" on public.profile;
create policy "admins can manage profile"
on public.profile
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read published projects" on public.projects;
create policy "public can read published projects"
on public.projects
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "admins can manage projects" on public.projects;
create policy "admins can manage projects"
on public.projects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read active stack items" on public.stack_items;
create policy "public can read active stack items"
on public.stack_items
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "admins can manage stack items" on public.stack_items;
create policy "admins can manage stack items"
on public.stack_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read active social links" on public.social_links;
create policy "public can read active social links"
on public.social_links
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "admins can manage social links" on public.social_links;
create policy "admins can manage social links"
on public.social_links
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read active education" on public.education;
create policy "public can read active education"
on public.education
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "admins can manage education" on public.education;
create policy "admins can manage education"
on public.education
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read active coursework" on public.coursework;
create policy "public can read active coursework"
on public.coursework
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "admins can manage coursework" on public.coursework;
create policy "admins can manage coursework"
on public.coursework
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read active experience" on public.experience;
create policy "public can read active experience"
on public.experience
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "admins can manage experience" on public.experience;
create policy "admins can manage experience"
on public.experience
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read active certificates" on public.certificates;
create policy "public can read active certificates"
on public.certificates
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "admins can manage certificates" on public.certificates;
create policy "admins can manage certificates"
on public.certificates
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
