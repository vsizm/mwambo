import fs from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const migrationId = "004_marriage_family_government_sources";
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log("[mwambo-migrate] DATABASE_URL not configured; skipping.");
  process.exit(0);
}

const sql = neon(databaseUrl);

await sql`create table if not exists mwambo_migrations (
  id text primary key,
  applied_at timestamptz not null default now()
)`;

const applied = await sql`select 1 from mwambo_migrations where id = ${migrationId} limit 1`;
if (applied.length) {
  console.log(`[mwambo-migrate] ${migrationId} already applied.`);
  process.exit(0);
}

const targetSlugs = [
  "marriage-in-zambia",
  "marriage-traditions-and-custom",
  "family-systems-and-marriage",
  "preparing-for-marriage",
  "family-care-maintenance-and-children",
  "alangizi-and-cultural-guidance",
  "community-responsibilities-marriage-family"
];

const existing = await sql`select slug from knowledge_entries where slug = any(${targetSlugs})`;

if (existing.length === targetSlugs.length) {
  await sql`insert into mwambo_migrations (id) values (${migrationId}) on conflict do nothing`;
  console.log(`[mwambo-migrate] Target content already exists; marked ${migrationId} applied.`);
  process.exit(0);
}

if (existing.length > 0) {
  throw new Error(`[mwambo-migrate] Refusing partial migration: found ${existing.length} of ${targetSlugs.length} target entries.`);
}

const file = path.join(process.cwd(), "db", "migrations", "004_marriage_family_government_sources.sql");
const raw = await fs.readFile(file, "utf8");
const statements = raw.split(";").map((statement) => statement.trim()).filter((statement) => statement && !statement.split("\n").every((line) => line.trim().startsWith("--")));

await sql.transaction(statements.map((statement) => sql.query(statement)));
await sql`insert into mwambo_migrations (id) values (${migrationId})`;

console.log(`[mwambo-migrate] Applied ${migrationId} (${statements.length} statements).`);