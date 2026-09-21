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

export async function getCategories(section: Category["section"]) {
  if (!sql) return [] as Category[];
  const rows = await sql`select id, name, slug, section, description from categories where section = ${section} order by name`;
  return rows as Category[];
}