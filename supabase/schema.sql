create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  input jsonb not null,
  output jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idea_id uuid not null references public.ideas(id) on delete cascade,
  title text not null,
  content jsonb not null,
  checklist jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_timestamp on public.profiles;
create trigger profiles_set_timestamp before update on public.profiles
for each row execute function public.set_timestamp();

drop trigger if exists ideas_set_timestamp on public.ideas;
create trigger ideas_set_timestamp before update on public.ideas
for each row execute function public.set_timestamp();

drop trigger if exists saved_plans_set_timestamp on public.saved_plans;
create trigger saved_plans_set_timestamp before update on public.saved_plans
for each row execute function public.set_timestamp();

alter table public.profiles enable row level security;
alter table public.ideas enable row level security;
alter table public.saved_plans enable row level security;

create policy "Users can read own profile" on public.profiles
for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
for insert with check (auth.uid() = id);

create policy "Users can manage own ideas" on public.ideas
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own plans" on public.saved_plans
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
