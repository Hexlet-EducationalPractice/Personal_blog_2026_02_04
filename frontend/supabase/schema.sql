create extension if not exists pgcrypto;

-- ===== TABLES =====
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  avatar_url text,
  updated_at timestamptz default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  body text not null,
  image_url text,
  tag text,
  created_at timestamptz default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  parent_id uuid references comments on delete cascade,
  body text not null,
  created_at timestamptz default now()
);
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  media_url text not null,
  created_at timestamptz default now()
);

create table if not exists works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  tags text[] default '{}',
  url text,
  created_at timestamptz default now()
);

-- ===== INDEXES =====
create index if not exists posts_created_at_idx on posts (created_at desc);
create index if not exists posts_tag_idx on posts (tag);
create index if not exists comments_post_id_idx on comments (post_id, created_at);

-- ===== RLS =====
alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table stories enable row level security;
alter table works enable row level security;

create policy "profiles read all" on profiles for select using (true);
create policy "profiles insert own" on profiles for insert with check (auth.uid() = id);
create policy "profiles update own" on profiles for update using (auth.uid() = id);

create policy "posts read all" on posts for select using (true);
create policy "posts insert own" on posts for insert with check (auth.uid() = user_id);
create policy "posts_update_own" on posts for update using (auth.uid() = user_id);
create policy "posts_delete_own" on posts for delete using (auth.uid() = user_id);

create policy "comments read all" on comments for select using (true);
create policy "comments insert own" on comments for insert with check (auth.uid() = user_id);
create policy "comments_update_own" on comments for update using (auth.uid() = user_id);
create policy "comments_delete_own" on comments for delete using (auth.uid() = user_id);

create policy "stories read all" on stories for select using (true);

create policy "works read all" on works for select using (true);

-- ===== AUTO-CREATE PROFILE ON SIGNUP =====
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name) values (new.id, split_part(new.email, '@', 1));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===== REALTIME (для advanced realtime comments) =====
alter publication supabase_realtime add table comments;
