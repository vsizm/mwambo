import { sql } from "./db";

export type EditorialEntry = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  status: string;
  category_id: string | null;
  category_name: string | null;
  section: string | null;
  cultural_group_id: string | null;
  place_id: string | null;
  historical_context: string | null;
  contemporary_context: string | null;
  variation_notes: string | null;
  contributor_name: string | null;
  reviewer_name: string | null;
  reviewed_at: string | null;
  published_at: string | null;
  updated_at: string;
};

export type EditorialSource = {
  id: string;
  title: string;
  source_type: string;
  author: string | null;
  publisher: string | null;
  publication_year: number | null;
  citation: string | null;
};

export async function getEditorialEntries(status?: string) {
  if (!sql) return [] as EditorialEntry[];
  const rows = status
    ? await sql`select e.*, c.name as category_name, c.section from knowledge_entries e left join categories c on c.id=e.category_id where e.status = ${status} order by e.updated_at desc`
    : await sql`select e.*, c.name as category_name, c.section from knowledge_entries e left join categories c on c.id=e.category_id order by e.updated_at desc`;
  return rows as EditorialEntry[];
}

export async function getEditorialEntry(id: string) {
  if (!sql) return null;
  const rows = await sql`select e.*, c.name as category_name, c.section from knowledge_entries e left join categories c on c.id=e.category_id where e.id=${id} limit 1`;
  return (rows[0] as EditorialEntry | undefined) ?? null;
}

export async function getEditorialCategories() {
  if (!sql) return [];
  return await sql`select id,name,slug,section from categories order by section,name`;
}

export async function getEditorialSources() {
  if (!sql) return [] as EditorialSource[];
  const rows = await sql`select id,title,source_type,author,publisher,publication_year,citation from sources order by title`;
  return rows as EditorialSource[];
}

export async function getEntrySourceIds(entryId: string) {
  if (!sql) return [] as string[];
  const rows = await sql`select source_id from entry_sources where entry_id=${entryId}`;
  return rows.map((row) => String(row.source_id));
}

export async function getReviewHistory(entryId: string) {
  if (!sql) return [];
  return await sql`select rr.id,rr.previous_status,rr.new_status,rr.notes,rr.created_at,u.display_name,u.email from review_records rr left join users u on u.id=rr.reviewer_id where rr.entry_id=${entryId} order by rr.created_at desc`;
}
