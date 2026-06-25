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
