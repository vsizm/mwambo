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

export type EntrySource = {
  id: string;
  title: string;
  source_type: string;
  author: string | null;
  publisher: string | null;
  publication_year: number | null;
  url: string | null;
  citation: string | null;
  relevance_note: string | null;
  primary_source: boolean;
};

export async function getEntrySources(entryId: string) {
  if (!sql) return [] as EntrySource[];
  const rows = await sql`select s.id, s.title, s.source_type, s.author, s.publisher, s.publication_year, s.url, s.citation, es.relevance_note, es.primary_source from entry_sources es join sources s on s.id = es.source_id where es.entry_id = ${entryId} order by es.primary_source desc, s.title`;
  return rows as EntrySource[];
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