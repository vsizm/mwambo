"use server";

import { redirect } from "next/navigation";
import { sql } from "../../lib/db";
import { requireEditorialAccess } from "../../lib/editorial-auth";

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
