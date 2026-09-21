import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

export const sql = databaseUrl ? neon(databaseUrl) : null;

export type Category = {
  id: string;
  name: string;
  slug: string;
  section: "heritage_identity" | "marriage_family_community";
  description: string | null;
};

export type KnowledgeEntry = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  status: string;
  category_id: string | null;
  historical_context: string | null;
  contemporary_context: string | null;
  variation_notes: string | null;
  contributor_name: string | null;
  reviewer_name: string | null;
  reviewed_at: string | null;
  published_at: string | null;
};

export async function getCategoryBySlug(slug: string) {
  if (!sql) return null;
  const rows = await sql`select id, name, slug, section, description from categories where slug = ${slug} limit 1`;
  return (rows[0] as Category | undefined) ?? null;
}

export async function getPublishedEntriesByCategory(categoryId: string) {
  if (!sql) return [] as KnowledgeEntry[];
  const rows = await sql`select id, title, slug, summary, content, status, category_id, historical_context, contemporary_context, variation_notes, contributor_name, reviewer_name, reviewed_at, published_at from knowledge_entries where category_id = ${categoryId} and status = 'published' order by title`;
  return rows as KnowledgeEntry[];
}

export async function getPublishedEntry(slug: string) {
  if (!sql) return null;
  const rows = await sql`select id, title, slug, summary, content, status, category_id, historical_context, contemporary_context, variation_notes, contributor_name, reviewer_name, reviewed_at, published_at from knowledge_entries where slug = ${slug} and status = 'published' limit 1`;
  return (rows[0] as KnowledgeEntry | undefined) ?? null;
}

export async function getCategories(section: Category["section"]) {
  if (!sql) return [] as Category[];
  const rows = await sql`select id, name, slug, section, description from categories where section = ${section} order by name`;
  return rows as Category[];
}