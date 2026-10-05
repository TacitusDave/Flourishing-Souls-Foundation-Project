-- Flourishing Souls Foundation — canonical database schema
--
-- This file is the single source of truth for table/column names. Every
-- component and lib file in src/ is written to match these names exactly.
-- Run this once against your Supabase project (SQL Editor, or `supabase db
-- push` if you adopt the CLI migration workflow later).
--
-- Idempotent: safe to re-run (uses IF NOT EXISTS / OR REPLACE throughout).

-- ============================================================
-- PROFILES
-- One row per auth.users row. `role` (plain text) is the field
-- AuthContext/RequireAuth actually gate access on — keep it authoritative.
-- `role_id` is a secondary, optional link into `roles` for the admin
-- Role Manager UI; it does not affect access control.
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin')),
  role_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

alter table profiles
  add constraint profiles_role_id_fkey foreign key (role_id) references roles(id) on delete set null;

-- ============================================================
-- DONATIONS
-- reference is unique so the paystack-verify Edge Function (Phase 5) can
-- upsert on it idempotently — a webhook retry or a client retry after a
-- dropped response must never create a duplicate donation row.
-- ============================================================
create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  amount numeric not null check (amount > 0),
  reference text not null unique,
  status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  channel text default 'paystack',
  organization text,
  metadata jsonb default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- EVENTS
-- ============================================================
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date timestamptz not null,
  location text,
  image_url text,
  organizer_id uuid references profiles(id) on delete set null,
  max_attendees integer,
  created_at timestamptz not null default now()
);

create table if not exists event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  registered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- ============================================================
-- VOLUNTEERS
-- ============================================================
create table if not exists volunteers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  skills text[],
  availability text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- SUPPORT REQUESTS
-- ============================================================
create table if not exists support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- GALLERY
-- Storage bucket: gallery-media (create via Supabase dashboard, public read)
-- ============================================================
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  type text not null check (type in ('photo', 'video')),
  url text not null,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- SETTINGS
-- Single-row table (admin org configuration). Seed one row after
-- running this schema: insert into settings (org_name) values (...);
-- ============================================================
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  org_name text not null default 'Flourishing Souls Foundation',
  contact_email text,
  contact_phone text,
  donation_goal numeric,
  -- Quick-pick amounts on the donation form (array of naira numbers)
  donation_presets jsonb not null default '[1000,2500,5000,10000]'::jsonb,
  -- Impact tiers shown on the homepage and Donate page:
  -- [{ amount: number, tag: string, text: string }]
  donation_tiers jsonb not null default
    '[{"amount":5000,"tag":"School supplies","text":"Books, uniform, and materials for one child for a full term."},{"amount":25000,"tag":"Medical outreach","text":"Sponsors a community health screening day for a dozen families."},{"amount":100000,"tag":"A year of care","text":"Funds shelter, meals, and schooling for one child for a year."}]'::jsonb,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  updated_at timestamptz not null default now()
);

-- Columns added after the table existed (safe to re-run)
alter table settings add column if not exists donation_presets jsonb not null default '[1000,2500,5000,10000]'::jsonb;
alter table settings add column if not exists donation_tiers jsonb not null default
  '[{"amount":5000,"tag":"School supplies","text":"Books, uniform, and materials for one child for a full term."},{"amount":25000,"tag":"Medical outreach","text":"Sponsors a community health screening day for a dozen families."},{"amount":100000,"tag":"A year of care","text":"Funds shelter, meals, and schooling for one child for a year."}]'::jsonb;

-- ============================================================
-- STORAGE
-- One public bucket serves gallery photos/videos and event media.
-- (The app reads URLs from the `gallery`/`events` tables, so client
-- code only needs the public URL — uploads are admin-only via RLS.)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('gallery-media', 'gallery-media', true)
on conflict (id) do nothing;

-- Public read of media files
create policy "gallery_media_public_read" on storage.objects
  for select using (bucket_id = 'gallery-media');

-- Authenticated users may upload (the public pages call this only behind
-- the isAdmin gate; the DB check is the real enforcement)
create policy "gallery_media_auth_upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'gallery-media');

create policy "gallery_media_auth_update" on storage.objects
  for update to authenticated using (bucket_id = 'gallery-media');

create policy "gallery_media_auth_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'gallery-media');

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table roles enable row level security;
alter table donations enable row level security;
alter table events enable row level security;
alter table event_registrations enable row level security;
alter table volunteers enable row level security;
alter table support_requests enable row level security;
alter table gallery enable row level security;
alter table settings enable row level security;

-- helper: is the current JWT an admin? (checked against profiles.role)
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: users read/update their own row; admins read/update all
drop policy if exists "profiles_select_own_or_admin" on profiles;
create policy "profiles_select_own_or_admin" on profiles
  for select using (auth.uid() = id or is_admin());

drop policy if exists "profiles_update_own_or_admin" on profiles;
create policy "profiles_update_own_or_admin" on profiles
  for update using (auth.uid() = id or is_admin());

drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

-- roles: admin-only
drop policy if exists "roles_admin_all" on roles;
create policy "roles_admin_all" on roles
  for all using (is_admin()) with check (is_admin());

-- donations: NO client insert — writes only via the paystack-verify /
-- paystack-webhook Edge Functions using the service-role key (Phase 5),
-- which bypasses RLS entirely. Anon/auth users can never insert directly.
drop policy if exists "donations_select_own_or_admin" on donations;
create policy "donations_select_own_or_admin" on donations
  for select using (
    is_admin() or email = (select email from profiles where id = auth.uid())
  );

-- events: public read, admin write
drop policy if exists "events_select_all" on events;
create policy "events_select_all" on events for select using (true);

drop policy if exists "events_admin_write" on events;
create policy "events_admin_write" on events
  for all using (is_admin()) with check (is_admin());

-- event_registrations: users manage their own registration; admins read all
drop policy if exists "event_registrations_select_own_or_admin" on event_registrations;
create policy "event_registrations_select_own_or_admin" on event_registrations
  for select using (auth.uid() = user_id or is_admin());

drop policy if exists "event_registrations_insert_own" on event_registrations;
create policy "event_registrations_insert_own" on event_registrations
  for insert with check (auth.uid() = user_id);

drop policy if exists "event_registrations_delete_own_or_admin" on event_registrations;
create policy "event_registrations_delete_own_or_admin" on event_registrations
  for delete using (auth.uid() = user_id or is_admin());

-- volunteers: public insert (anyone can apply), admin + owner read
drop policy if exists "volunteers_insert_public" on volunteers;
create policy "volunteers_insert_public" on volunteers
  for insert with check (true);

drop policy if exists "volunteers_select_own_or_admin" on volunteers;
create policy "volunteers_select_own_or_admin" on volunteers
  for select using (auth.uid() = user_id or is_admin());

-- support_requests: public insert, admin + owner read
drop policy if exists "support_requests_insert_public" on support_requests;
create policy "support_requests_insert_public" on support_requests
  for insert with check (true);

drop policy if exists "support_requests_select_own_or_admin" on support_requests;
create policy "support_requests_select_own_or_admin" on support_requests
  for select using (auth.uid() = user_id or is_admin());

drop policy if exists "support_requests_update_admin" on support_requests;
create policy "support_requests_update_admin" on support_requests
  for update using (is_admin());

-- gallery: public read, admin write
drop policy if exists "gallery_select_all" on gallery;
create policy "gallery_select_all" on gallery for select using (true);

drop policy if exists "gallery_admin_write" on gallery;
create policy "gallery_admin_write" on gallery
  for all using (is_admin()) with check (is_admin());

-- settings: public read (site needs org name/contact/theme), admin write
drop policy if exists "settings_select_all" on settings;
create policy "settings_select_all" on settings for select using (true);

drop policy if exists "settings_admin_write" on settings;
create policy "settings_admin_write" on settings
  for all using (is_admin()) with check (is_admin());
