-- Mwambo RLS baseline
-- Enable row-level security before any external/client-facing database access is introduced.
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
