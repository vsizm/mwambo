"use server";

import { redirect } from "next/navigation";
import { requireEditorialUser } from "../../lib/editorial-auth";
import { withEditorialTransaction } from "../../lib/db-context";

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

  const id = clean(formData.get("id"));
  const next = clean(formData.get("new_status"));
  const notes = clean(formData.get("notes")) || null;

  if (!id || !next) throw new Error("Entry and workflow status are required.");

  const validNext = Object.values(allowedTransitions).some((statuses) => statuses.includes(next));
  if (!validNext) throw new Error("Invalid workflow transition: " + next);

  if (next === "verified" && !["reviewer", "editor", "administrator"].includes(role)) {
    throw new Error("Only reviewers, editors or administrators can verify entries.");
  }
  if (next === "published" && !["editor", "administrator"].includes(role)) {
    throw new Error("Only editors or administrators can publish entries.");
  }
  if (next === "returned" && !["reviewer", "editor", "administrator"].includes(role)) {
    throw new Error("Only reviewers, editors or administrators can return entries.");
  }

  if (role === "contributor" && next !== "in_review") {
    throw new Error("Contributors may only submit draft or returned entries for review.");
  }

  const result = await withEditorialTransaction(user, async (client) => {
    const query = `
      with current as (
        select id, status
        from knowledge_entries
        where id = $1
        for update
      ),
      updated as (
        update knowledge_entries e
        set status = $2,
            reviewer_name = case
              when $2 in ('verified','published','returned')
              then coalesce(e.reviewer_name, $3)
              else e.reviewer_name
            end,
            reviewed_at = case
              when $2 in ('verified','published','returned') then now()
              else e.reviewed_at
            end,
            published_at = case
              when $2 = 'published' then coalesce(e.published_at, now())
              when $2 <> 'published' then null
              else e.published_at
            end,
            updated_at = now()
        from current c
        where e.id = c.id
          and (
            (c.status = 'draft' and $2 in ('in_review','archived'))
            or (c.status = 'returned' and $2 in ('in_review','archived'))
            or (c.status = 'in_review' and $2 in ('verified','returned','archived'))
            or (c.status = 'verified' and $2 in ('published','returned','archived'))
            or (c.status = 'published' and $2 = 'archived')
          )
          and (
            ($2 = 'verified' and current_setting('app.role', true) in ('reviewer','editor','administrator'))
            or ($2 = 'published' and current_setting('app.role', true) in ('editor','administrator'))
            or ($2 = 'returned' and current_setting('app.role', true) in ('reviewer','editor','administrator'))
            or ($2 in ('in_review','archived') and current_setting('app.role', true) in ('contributor','reviewer','editor','administrator'))
          )
        returning c.status as previous_status, e.status as new_status, e.id
      )
      insert into review_records (entry_id, reviewer_id, previous_status, new_status, notes)
      select id,
             (select id from users where external_auth_id = current_setting('app.external_auth_id', true) limit 1),
             previous_status,
             new_status,
             $4
      from updated
      returning entry_id, previous_status, new_status
    `;

    const response = await client.query(query, [
      id,
      next,
      user.display_name ?? user.email ?? "Editorial reviewer",
      notes
    ]);

    return response.rows[0] ?? null;
  });

  if (!result) {
    throw new Error("The requested workflow transition was not permitted or the entry was not found.");
  }

  redirect("/admin/entries/" + id);
}

export async function createEntry(formData: FormData) {
  const user = await requireEditorialUser();

  const title = clean(formData.get("title"));
  const slug = clean(formData.get("slug"));
  const categoryId = clean(formData.get("category_id"));
  const content = clean(formData.get("content"));

  if (!title || !slug || !categoryId || !content) {
    throw new Error("Title, slug, category and knowledge are required.");
  }

  const sourceIds = formData.getAll("source_ids").map(String);
  const id = await withEditorialTransaction(user, async (client) => {
    const result = await client.query(
      `insert into knowledge_entries
        (title, slug, summary, content, category_id, historical_context,
         contemporary_context, variation_notes, contributor_name)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       returning id`,
      [
        title,
        slug,
        clean(formData.get("summary")) || null,
        content,
        categoryId,
        clean(formData.get("historical_context")) || null,
        clean(formData.get("contemporary_context")) || null,
        clean(formData.get("variation_notes")) || null,
        clean(formData.get("contributor_name")) || null
      ]
    );

    const entryId = String(result.rows[0].id);

    for (const sourceId of sourceIds) {
      await client.query(
        "insert into entry_sources (entry_id, source_id) values ($1,$2) on conflict do nothing",
        [entryId, sourceId]
      );
    }

    return entryId;
  });

  redirect("/admin/entries/" + id);
}

export async function updateEntry(formData: FormData) {
  const user = await requireEditorialUser();

  const id = clean(formData.get("id"));
  const title = clean(formData.get("title"));
  const slug = clean(formData.get("slug"));
  const categoryId = clean(formData.get("category_id"));
  const content = clean(formData.get("content"));

  if (!id || !title || !slug || !categoryId || !content) {
    throw new Error("Entry, title, slug, category and knowledge are required.");
  }

  await withEditorialTransaction(user, async (client) => {
    const current = await client.query("select status from knowledge_entries where id=$1 for update", [id]);
    const currentStatus = current.rows[0]?.status;
    if (!currentStatus) throw new Error("The entry could not be found.");
    if (user.role === "reviewer") throw new Error("Reviewers cannot edit knowledge entries.");
    if (user.role === "contributor" && !["draft", "returned"].includes(String(currentStatus))) {
      throw new Error("Contributors may only edit draft or returned entries.");
    }
    if (user.role === "editor" && String(currentStatus) === "published") {
      throw new Error("Published entries must be archived before editorial changes are made.");
    }
    const updated = await client.query(
      `update knowledge_entries
       set title=$1,
           slug=$2,
           summary=$3,
           content=$4,
           category_id=$5,
           historical_context=$6,
           contemporary_context=$7,
           variation_notes=$8,
           contributor_name=$9,
           updated_at=now()
       where id=$10
       returning id`,
      [
        title,
        slug,
        clean(formData.get("summary")) || null,
        content,
        categoryId,
        clean(formData.get("historical_context")) || null,
        clean(formData.get("contemporary_context")) || null,
        clean(formData.get("variation_notes")) || null,
        clean(formData.get("contributor_name")) || null,
        id
      ]
    );

    if (!updated.rowCount) {
      throw new Error("The entry could not be updated for this editorial role.");
    }

    const sourceIds = formData.getAll("source_ids").map(String);
    await client.query("delete from entry_sources where entry_id=$1", [id]);

    for (const sourceId of sourceIds) {
      await client.query(
        "insert into entry_sources (entry_id, source_id) values ($1,$2) on conflict do nothing",
        [id, sourceId]
      );
    }
  });

  redirect("/admin/entries/" + id);
}
