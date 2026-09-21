-- Mwambo editorial RLS policies
-- Context is transaction-scoped. The application must set:
--   app.external_auth_id = Clerk user id
--   app.role = Mwambo role
-- before protected queries in the same transaction.
--
-- Do not use session-level SET for these values.

create index if not exists idx_users_external_auth_id on users(external_auth_id);

-- Users: a signed-in user may provision/update their own identity record.
-- Existing editorial users may read their own row; administrators may read all user rows.
drop policy if exists users_self_read on users;
create policy users_self_read on users
  for select
  using (
    external_auth_id = nullif(current_setting('app.external_auth_id', true), '')
    or current_setting('app.role', true) = 'administrator'
  );

drop policy if exists users_self_insert on users;
create policy users_self_insert on users
  for insert
  with check (
    external_auth_id = nullif(current_setting('app.external_auth_id', true), '')
    and role = 'reader'
  );

drop policy if exists users_self_update on users;
create policy users_self_update on users
  for update
  using (
    external_auth_id = nullif(current_setting('app.external_auth_id', true), '')
    or current_setting('app.role', true) = 'administrator'
  )
  with check (
    external_auth_id = nullif(current_setting('app.external_auth_id', true), '')
    or current_setting('app.role', true) = 'administrator'
  );

-- Editorial users can read the full editorial catalogue.
drop policy if exists knowledge_entries_editorial_read on knowledge_entries;
create policy knowledge_entries_editorial_read on knowledge_entries
  for select
  using (
    current_setting('app.role', true) in ('contributor','reviewer','editor','administrator')
  );

drop policy if exists knowledge_entries_editorial_insert on knowledge_entries;
create policy knowledge_entries_editorial_insert on knowledge_entries
  for insert
  with check (
    current_setting('app.role', true) in ('contributor','reviewer','editor','administrator')
    and status = 'draft'
  );

drop policy if exists knowledge_entries_editorial_update on knowledge_entries;
create policy knowledge_entries_editorial_update on knowledge_entries
  for update
  using (
    current_setting('app.role', true) in ('reviewer','editor','administrator')
    or (
      current_setting('app.role', true) = 'contributor'
      and status in ('draft','returned')
    )
  )
  with check (
    current_setting('app.role', true) in ('reviewer','editor','administrator')
    or (
      current_setting('app.role', true) = 'contributor'
      and status in ('draft','returned')
    )
  );

-- Editorial users can inspect source records. Public visibility remains governed
-- by the existing published-entry policy.
drop policy if exists sources_editorial_read on sources;
create policy sources_editorial_read on sources
  for select
  using (
    current_setting('app.role', true) in ('contributor','reviewer','editor','administrator')
  );

drop policy if exists entry_sources_editorial_read on entry_sources;
create policy entry_sources_editorial_read on entry_sources
  for select
  using (
    current_setting('app.role', true) in ('contributor','reviewer','editor','administrator')
  );

drop policy if exists entry_sources_editorial_insert on entry_sources;
create policy entry_sources_editorial_insert on entry_sources
  for insert
  with check (
    current_setting('app.role', true) in ('contributor','reviewer','editor','administrator')
  );

drop policy if exists entry_sources_editorial_delete on entry_sources;
create policy entry_sources_editorial_delete on entry_sources
  for delete
  using (
    current_setting('app.role', true) in ('contributor','reviewer','editor','administrator')
  );

-- Supporting editorial catalogue data is readable to authenticated editorial users.
drop policy if exists categories_editorial_read on categories;
create policy categories_editorial_read on categories
  for select
  using (
    current_setting('app.role', true) in ('contributor','reviewer','editor','administrator')
  );

drop policy if exists cultural_groups_editorial_read on cultural_groups;
create policy cultural_groups_editorial_read on cultural_groups
  for select
  using (
    current_setting('app.role', true) in ('contributor','reviewer','editor','administrator')
  );

drop policy if exists places_editorial_read on places;
create policy places_editorial_read on places
  for select
  using (
    current_setting('app.role', true) in ('contributor','reviewer','editor','administrator')
  );

drop policy if exists tags_editorial_read on tags;
create policy tags_editorial_read on tags
  for select
  using (
    current_setting('app.role', true) in ('contributor','reviewer','editor','administrator')
  );

-- Review history is private to editorial users.
drop policy if exists review_records_editorial_read on review_records;
create policy review_records_editorial_read on review_records
  for select
  using (
    current_setting('app.role', true) in ('reviewer','editor','administrator')
  );

drop policy if exists review_records_editorial_insert on review_records;
create policy review_records_editorial_insert on review_records
  for insert
  with check (
    current_setting('app.role', true) in ('reviewer','editor','administrator')
    and reviewer_id = (
      select id
      from users
      where external_auth_id = nullif(current_setting('app.external_auth_id', true), '')
      limit 1
    )
  );

-- Workflow transitions are still enforced by the server action, while RLS
-- provides a second database boundary for status changes.
drop policy if exists knowledge_entries_workflow_update on knowledge_entries;
create policy knowledge_entries_workflow_update on knowledge_entries
  for update
  using (
    current_setting('app.role', true) in ('reviewer','editor','administrator')
    or (
      current_setting('app.role', true) = 'contributor'
      and status in ('draft','returned')
    )
  )
  with check (
    (
      current_setting('app.role', true) = 'contributor'
      and status in ('draft','in_review')
    )
    or (
      current_setting('app.role', true) = 'reviewer'
      and status in ('draft','in_review','verified','returned','archived')
    )
    or (
      current_setting('app.role', true) = 'editor'
      and status in ('draft','in_review','verified','published','returned','archived')
    )
    or (
      current_setting('app.role', true) = 'administrator'
      and status in ('draft','in_review','verified','published','returned','archived')
    )
  );

-- Force RLS is deliberately not enabled here. It will be enabled only after
-- the application has switched to mwambo_app and transaction-scoped context
-- has passed end-to-end tests.
