-- ConsCalc — Supabase schema (run once in Supabase SQL Editor)
-- Two tables, one row per user, RLS so users can only touch their own data.

-- 1) Active project (single-project-per-user for v0.1)
create table if not exists public.conscalc_projects (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  name         text         not null default '',
  contingency  numeric      not null default 0,
  instances    jsonb        not null default '[]'::jsonb,
  updated_at   timestamptz  not null default now()
);

-- 2) Per-user price overrides
create table if not exists public.conscalc_prices (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  prices       jsonb        not null default '{}'::jsonb,
  updated_at   timestamptz  not null default now()
);

-- ----- RLS: users can only see/edit their own row -----
alter table public.conscalc_projects enable row level security;
alter table public.conscalc_prices   enable row level security;

drop policy if exists "select_own_project"  on public.conscalc_projects;
drop policy if exists "upsert_own_project"  on public.conscalc_projects;
drop policy if exists "update_own_project"  on public.conscalc_projects;
drop policy if exists "delete_own_project"  on public.conscalc_projects;

create policy "select_own_project" on public.conscalc_projects
  for select using (auth.uid() = user_id);

create policy "upsert_own_project" on public.conscalc_projects
  for insert with check (auth.uid() = user_id);

create policy "update_own_project" on public.conscalc_projects
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "delete_own_project" on public.conscalc_projects
  for delete using (auth.uid() = user_id);

drop policy if exists "select_own_prices"  on public.conscalc_prices;
drop policy if exists "upsert_own_prices"  on public.conscalc_prices;
drop policy if exists "update_own_prices"  on public.conscalc_prices;
drop policy if exists "delete_own_prices"  on public.conscalc_prices;

create policy "select_own_prices" on public.conscalc_prices
  for select using (auth.uid() = user_id);

create policy "upsert_own_prices" on public.conscalc_prices
  for insert with check (auth.uid() = user_id);

create policy "update_own_prices" on public.conscalc_prices
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "delete_own_prices" on public.conscalc_prices
  for delete using (auth.uid() = user_id);

-- ----- updated_at auto-bump -----
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_touch_conscalc_projects on public.conscalc_projects;
create trigger trg_touch_conscalc_projects
  before update on public.conscalc_projects
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_touch_conscalc_prices on public.conscalc_prices;
create trigger trg_touch_conscalc_prices
  before update on public.conscalc_prices
  for each row execute function public.touch_updated_at();

<<<<<<< HEAD
-- ----- MIGRATION: Subscription paywall support -----
create table if not exists public.konstru_subscriptions (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  plan           text         not null default 'free',
  status         text         not null default 'inactive',
  subscribed_at  timestamptz,
  expires_at     timestamptz,
  updated_at     timestamptz  not null default now()
);

alter table public.konstru_subscriptions enable row level security;

drop policy if exists "select_own_subscription" on public.konstru_subscriptions;
create policy "select_own_subscription" on public.konstru_subscriptions
  for select using (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for authenticated users — service_role only.

drop trigger if exists trg_touch_konstru_subscriptions on public.konstru_subscriptions;
create trigger trg_touch_konstru_subscriptions
  before update on public.konstru_subscriptions
  for each row execute function public.touch_updated_at();
=======
-- =====================================================================
-- MIGRATION: Multi-project support (run against existing table)
-- Converts conscalc_projects from one-row-per-user to many-rows-per-user.
-- Existing rows are preserved and become the user's first project.
-- conscalc_prices is NOT changed.
-- =====================================================================

-- 1) Add new columns
alter table public.conscalc_projects
  add column if not exists id uuid not null default gen_random_uuid();

alter table public.conscalc_projects
  add column if not exists created_at timestamptz not null default now();

-- 2) Drop old PK on user_id, add new PK on id
alter table public.conscalc_projects
  drop constraint if exists conscalc_projects_pkey;

alter table public.conscalc_projects
  add primary key (id);

-- 3) Index on user_id for fast per-user queries
create index if not exists idx_conscalc_projects_user_id
  on public.conscalc_projects(user_id);

-- 4) Recreate RLS policies (same auth.uid() = user_id logic, multiple rows allowed)
drop policy if exists "select_own_project"  on public.conscalc_projects;
drop policy if exists "upsert_own_project"  on public.conscalc_projects;
drop policy if exists "update_own_project"  on public.conscalc_projects;
drop policy if exists "delete_own_project"  on public.conscalc_projects;

create policy "select_own_project" on public.conscalc_projects
  for select using (auth.uid() = user_id);

create policy "insert_own_project" on public.conscalc_projects
  for insert with check (auth.uid() = user_id);

create policy "update_own_project" on public.conscalc_projects
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "delete_own_project" on public.conscalc_projects
  for delete using (auth.uid() = user_id);
>>>>>>> 9a99d29858d4e1a91ddcfbb56bc3cdd87750566c
