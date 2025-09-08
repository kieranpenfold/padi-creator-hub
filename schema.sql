-- Create tables for PADI EMEA Creator Hub

-- App config (stores allowed Supabase auth user id for RLS)
create table if not exists app_config (
  key text primary key,
  value text not null
);

-- Core tables
create table if not exists creators (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  pronouns text,
  categories text[] default '{}',
  country text,
  timezone text,
  email text,
  phone text,
  agent_name text,
  agent_email text,
  description text,
  tags text[] default '{}',
  avatar_url text,
  cover_url text,
  consent_on_file boolean default false,
  consent_file_url text
);

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id) on delete cascade,
  platform text not null,
  url text not null,
  followers bigint
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id) on delete cascade,
  type text check (type in ('image','video','file')) not null,
  url text not null,
  title text,
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists work_items (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id) on delete cascade,
  title text not null,
  campaign text,
  status text check (status in ('Planned','In progress','Completed')) not null default 'Planned',
  start_date date,
  end_date date,
  deliverables text[] default '{}',
  links text[] default '{}',
  outcomes jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id) on delete cascade,
  work_item_id uuid references work_items(id) on delete cascade,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id) on delete cascade,
  stars numeric check (stars >= 0 and stars <= 5) not null,
  rater_name text not null,
  comment text,
  created_at timestamptz not null default now()
);

-- Updated_at triggers
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_creators on creators;
create trigger set_updated_at_creators before update on creators
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_work_items on work_items;
create trigger set_updated_at_work_items before update on work_items
for each row execute function public.set_updated_at();

-- RLS: Restrict all operations to ONE allowed auth user
alter table creators enable row level security;
alter table social_links enable row level security;
alter table media_assets enable row level security;
alter table work_items enable row level security;
alter table notes enable row level security;
alter table ratings enable row level security;
alter table app_config enable row level security;

-- Policies use auth.uid() equality to allowed_user_id in app_config
-- Replace the value below with your Supabase Auth user UUID
insert into app_config (key, value) values ('allowed_user_id', 'de4ff45d-feab-4f8e-a410-5618e7a9d196')
on conflict (key) do update set value = excluded.value;

-- app_config read (needed for app to verify config if desired)
create policy if not exists "config_read"
on app_config for select
using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );

-- creators
create policy if not exists "creators_select"
on creators for select using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "creators_insert"
on creators for insert with check ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "creators_update"
on creators for update using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "creators_delete"
on creators for delete using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );

-- social_links
create policy if not exists "social_select"
on social_links for select using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "social_insert"
on social_links for insert with check ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "social_update"
on social_links for update using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "social_delete"
on social_links for delete using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );

-- media_assets
create policy if not exists "media_select"
on media_assets for select using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "media_insert"
on media_assets for insert with check ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "media_update"
on media_assets for update using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "media_delete"
on media_assets for delete using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );

-- work_items
create policy if not exists "work_select"
on work_items for select using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "work_insert"
on work_items for insert with check ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "work_update"
on work_items for update using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "work_delete"
on work_items for delete using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );

-- notes
create policy if not exists "notes_select"
on notes for select using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "notes_insert"
on notes for insert with check ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "notes_update"
on notes for update using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "notes_delete"
on notes for delete using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );

-- ratings
create policy if not exists "ratings_select"
on ratings for select using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "ratings_insert"
on ratings for insert with check ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "ratings_update"
on ratings for update using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
create policy if not exists "ratings_delete"
on ratings for delete using ( auth.uid() = (select value::uuid from app_config where key='allowed_user_id') );
