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
