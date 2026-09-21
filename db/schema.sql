-- Mwambo initial PostgreSQL schema
-- Foundation only. Public content is not inserted by this migration.

create extension if not exists pgcrypto;

create type content_status as enum ('draft','in_review','verified','published','returned','archived');
create type source_type as enum ('book','academic','government','institutional','archive','oral_history','web');
create type role_type as enum ('reader','contributor','reviewer','editor','administrator');

create table if not exists cultural_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  place_type text not null,
  parent_id uuid references places(id) on delete set null,
  latitude double precision,
  longitude double precision,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  section text not null check (section in ('heritage_identity','marriage_family_community')),
  description text
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type source_type not null,
  author text,
  publisher text,
  publication_year integer,
  isbn text,
  url text,
  citation text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists knowledge_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  content text not null,
  status content_status not null default 'draft',
  category_id uuid references categories(id) on delete set null,
  cultural_group_id uuid references cultural_groups(id) on delete set null,
  place_id uuid references places(id) on delete set null,
  historical_context text,
  contemporary_context text,
  variation_notes text,
  contributor_name text,
  reviewer_name text,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists entry_sources (
  entry_id uuid not null references knowledge_entries(id) on delete cascade,
  source_id uuid not null references sources(id) on delete cascade,
  relevance_note text,
  primary_source boolean not null default false,
  primary key (entry_id, source_id)
);

create table if not exists entry_related (
  entry_id uuid not null references knowledge_entries(id) on delete cascade,
  related_entry_id uuid not null references knowledge_entries(id) on delete cascade,
  relationship text,
  primary key (entry_id, related_entry_id),
  check (entry_id <> related_entry_id)
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists entry_tags (
  entry_id uuid not null references knowledge_entries(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (entry_id, tag_id)
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  external_auth_id text unique,
  display_name text,
  email text unique,
  role role_type not null default 'reader',
  created_at timestamptz not null default now()
);

create table if not exists review_records (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references knowledge_entries(id) on delete cascade,
  reviewer_id uuid references users(id) on delete set null,
  previous_status content_status,
  new_status content_status not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_entries_status on knowledge_entries(status);
create index if not exists idx_entries_category on knowledge_entries(category_id);
create index if not exists idx_entries_group on knowledge_entries(cultural_group_id);
create index if not exists idx_entries_place on knowledge_entries(place_id);
create index if not exists idx_sources_type on sources(source_type);

-- Row-level security baseline
-- The current Next.js server uses the Neon connection owner, which bypasses RLS.
-- Once a least-privilege application role/authenticated database session is introduced,
-- FORCE ROW LEVEL SECURITY can be enabled and the editorial policies below can be activated.

alter table cultural_groups enable row level security;
alter table places enable row level security;
alter table categories enable row level security;
alter table sources enable row level security;
alter table knowledge_entries enable row level security;
alter table entry_sources enable row level security;
alter table entry_related enable row level security;
alter table tags enable row level security;
alter table entry_tags enable row level security;
alter table users enable row level security;
alter table review_records enable row level security;

drop policy if exists categories_public_read on categories;
create policy categories_public_read on categories for select using (true);

drop policy if exists cultural_groups_public_read on cultural_groups;
create policy cultural_groups_public_read on cultural_groups for select using (true);

drop policy if exists places_public_read on places;
create policy places_public_read on places for select using (true);

drop policy if exists tags_public_read on tags;
create policy tags_public_read on tags for select using (true);

drop policy if exists knowledge_entries_public_read on knowledge_entries;
create policy knowledge_entries_public_read on knowledge_entries for select using (status = 'published');

drop policy if exists sources_public_read on sources;
create policy sources_public_read on sources for select using (
  exists (
    select 1
    from entry_sources es
    join knowledge_entries ke on ke.id = es.entry_id
    where es.source_id = sources.id
      and ke.status = 'published'
  )
);

drop policy if exists entry_sources_public_read on entry_sources;
create policy entry_sources_public_read on entry_sources for select using (
  exists (
    select 1
    from knowledge_entries ke
    where ke.id = entry_sources.entry_id
      and ke.status = 'published'
  )
);

drop policy if exists entry_related_public_read on entry_related;
create policy entry_related_public_read on entry_related for select using (
  exists (
    select 1 from knowledge_entries ke
    where ke.id = entry_related.entry_id and ke.status = 'published'
  )
  and exists (
    select 1 from knowledge_entries rk
    where rk.id = entry_related.related_entry_id and rk.status = 'published'
  )
);

drop policy if exists entry_tags_public_read on entry_tags;
create policy entry_tags_public_read on entry_tags for select using (
  exists (
    select 1 from knowledge_entries ke
    where ke.id = entry_tags.entry_id and ke.status = 'published'
  )
);

drop policy if exists users_no_public_access on users;
create policy users_no_public_access on users for select using (false);

drop policy if exists review_records_no_public_access on review_records;
create policy review_records_no_public_access on review_records for select using (false);
