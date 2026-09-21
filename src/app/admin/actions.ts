"use server";

import { redirect } from "next/navigation";
import { sql } from "../../lib/db";
import { requireEditorialAccess, requireEditorialUser } from "../../lib/editorial-auth";

const allowedTransitions: Record<string, string[]> = {
  draft: ["in_review", "archived"],
  returned: ["in_review", "archived"],
  in_review: ["verified", "returned", "archived"],
  verified: ["published", "returned", "archived"],
  published: ["archived"],
  archived: []
};

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function transitionEntry(formData: FormData) {
  const user = await requireEditorialUser();
  const role = user.role;
  if (!sql) throw new Error("Database is not configured.");

  const id = clean(formData.get("id"));
  const next = clean(formData.get("new_status"));
  const notes = clean(formData.get("notes")) || null;

  if (!id || !next) throw new Error("Entry and workflow status are required.");

  const currentRows = await sql`select status from knowledge_entries where id=${id} limit 1`;
  const current = String(currentRows[0]?.status ?? "");
  if (!allowedTransitions[current]?.includes(next)) {
    throw new Error(`Invalid workflow transition: ${current} → ${next}`);
  }

  if (next === "verified" && !["reviewer", "editor", "administrator"].includes(role)) {
    throw new Error("Only reviewers, editors or administrators can verify entries.");
  }
  if (next === "published" && !["editor", "administrator"].includes(role)) {
    throw new Error("Only editors or administrators can publish entries.");
  }
  if (next === "returned" && !["reviewer", "editor", "administrator"].includes(role)) {
    throw new Error("Only reviewers, editors or administrators can return entries.");
  }

  await sql`update knowledge_entries
    set status=${next},
        reviewer_name=case when ${next} in ('verified','published','returned') then coalesce(reviewer_name, ${user.display_name ?? user.email ?? "Editorial reviewer"}) else reviewer_name end,
        reviewed_at=case when ${next} in ('verified','published','returned') then now() else reviewed_at end,
        published_at=case when ${next}='published' then coalesce(published_at, now()) when ${next}<>'published' then null else published_at end,
        updated_at=now()
    where id=${id}`;

  await sql`insert into review_records (entry_id, reviewer_id, previous_status, new_status, notes)
    values (${id}, ${user.id}, ${current}, ${next}, ${notes})`;

  redirect(`/admin/entries/${id}`);
}

export async function createEntry(formData: FormData) {
  await requireEditorialAccess();
  if (!sql) throw new Error("Database is not configured.");

  const title = clean(formData.get("title"));
  const slug = clean(formData.get("slug"));
  const categoryId = clean(formData.get("category_id"));
  const content = clean(formData.get("content"));

  if (!title || !slug || !categoryId || !content) {
    throw new Error("Title, slug, category and knowledge are required.");
  }

  const sourceIds = formData.getAll("source_ids").map(String);
  const rows = await sql`insert into knowledge_entries
    (title, slug, summary, content, category_id, historical_context, contemporary_context, variation_notes, contributor_name)
    values (
      ${title},
      ${slug},
      ${clean(formData.get("summary")) || null},
      ${content},
      ${categoryId},
      ${clean(formData.get("historical_context")) || null},
      ${clean(formData.get("contemporary_context")) || null},
      ${clean(formData.get("variation_notes")) || null},
      ${clean(formData.get("contributor_name")) || null}
    )
    returning id`;

  const id = String(rows[0].id);
  for (const sourceId of sourceIds) {
    await sql`insert into entry_sources (entry_id, source_id) values (${id}, ${sourceId}) on conflict do nothing`;
  }

  redirect(`/admin/entries/${id}`);
}

export async function updateEntry(formData: FormData) {
  const user = await requireEditorialUser();
  if (!sql) throw new Error("Database is not configured.");

  const id = clean(formData.get("id"));
  const title = clean(formData.get("title"));
  const slug = clean(formData.get("slug"));
  const categoryId = clean(formData.get("category_id"));
  const content = clean(formData.get("content"));

  if (!id || !title || !slug || !categoryId || !content) {
    throw new Error("Entry, title, slug, category and knowledge are required.");
  }

  await sql`update knowledge_entries
    set title=${title},
        slug=${slug},
        summary=${clean(formData.get("summary")) || null},
        content=${content},
        category_id=${categoryId},
        historical_context=${clean(formData.get("historical_context")) || null},
        contemporary_context=${clean(formData.get("contemporary_context")) || null},
        variation_notes=${clean(formData.get("variation_notes")) || null},
        contributor_name=${clean(formData.get("contributor_name")) || null},
        updated_at=now()
    where id=${id}`;

  const sourceIds = formData.getAll("source_ids").map(String);
  await sql`delete from entry_sources where entry_id=${id}`;
  for (const sourceId of sourceIds) {
    await sql`insert into entry_sources (entry_id, source_id) values (${id}, ${sourceId}) on conflict do nothing`;
  }

  redirect(`/admin/entries/${id}`);
}
