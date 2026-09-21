"use server";

import { redirect } from "next/navigation";
import { sql } from "../../lib/db";
import { requireEditorialAccess } from "../../lib/editorial-auth";

const allowedTransitions: Record<string, string[]> = { draft: ["in_review","archived"], returned: ["in_review","archived"], in_review: ["verified","returned","archived"], verified: ["published","returned","archived"], published: ["archived"], archived: [] };

export async function transitionEntry(formData: FormData) {
  await requireEditorialAccess();
  if (!sql) throw new Error("Database is not configured.");
  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("new_status") ?? "");
  const currentRows = await sql`select status from knowledge_entries where id=${id} limit 1`;
  const current = String(currentRows[0]?.status ?? "");
  if (!allowedTransitions[current]?.includes(next)) throw new Error(`Invalid workflow transition: ${current} → ${next}`);
  await sql`update knowledge_entries set status=${next}, reviewer_name=case when ${next} in ('verified','published') then 'Editorial reviewer' else reviewer_name end, reviewed_at=case when ${next} in ('verified','published') then now() else reviewed_at end, published_at=case when ${next}='published' then now() else published_at end, updated_at=now() where id=${id}`;
  await sql`insert into review_records (entry_id,previous_status,new_status) values (${id},${current},${next})`;
  redirect(`/admin/entries/${id}`);
}

export async function createEntry(formData: FormData) {
  await requireEditorialAccess();
  if (!sql) throw new Error("Database is not configured.");
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title || !slug || !categoryId || !content) throw new Error("Title, slug, category and knowledge are required.");
  const sourceIds = formData.getAll("source_ids").map(String);
  const rows = await sql`insert into knowledge_entries (title,slug,summary,content,category_id,historical_context,contemporary_context,variation_notes,contributor_name) values (${title},${slug},${String(formData.get("summary") ?? "").trim() || null},${content},${categoryId},${String(formData.get("historical_context") ?? "").trim() || null},${String(formData.get("contemporary_context") ?? "").trim() || null},${String(formData.get("variation_notes") ?? "").trim() || null},${String(formData.get("contributor_name") ?? "").trim() || null}) returning id`;
  const id = String(rows[0].id);
  for (const sourceId of sourceIds) await sql`insert into entry_sources (entry_id,source_id) values (${id},${sourceId}) on conflict do nothing`;
  redirect(`/admin/entries/${id}`);
}
