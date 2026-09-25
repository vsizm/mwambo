import fs from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const migrationId = "005_marriage_readiness_feedback";
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log("[mwambo-migrate] DATABASE_URL not configured; skipping assessment feedback migration.");
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

const file = path.join(process.cwd(), "db", "migrations", "005_marriage_readiness_feedback.sql");
const raw = await fs.readFile(file, "utf8");
const statements = raw.split(";").map((statement) => statement.trim()).filter(Boolean);

await sql.transaction(statements.map((statement) => sql.query(statement)));
await sql`insert into mwambo_migrations (id) values (${migrationId}) on conflict do nothing`;

console.log(`[mwambo-migrate] Applied ${migrationId} (${statements.length} statements).`);
