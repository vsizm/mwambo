import { requireEditorialUser } from "./editorial-auth";
import { withEditorialTransaction } from "./db-context";

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
  const user = await requireEditorialUser();
  return withEditorialTransaction(user, async (client) => {
    const result = status
      ? await client.query(`select e.*, c.name as category_name, c.section
          from knowledge_entries e
          left join categories c on c.id=e.category_id
          where e.status = $1
          order by e.updated_at desc`, [status])
      : await client.query(`select e.*, c.name as category_name, c.section
          from knowledge_entries e
          left join categories c on c.id=e.category_id
          order by e.updated_at desc`);
    return result.rows as EditorialEntry[];
  });
}

export async function getEditorialEntry(id: string) {
  const user = await requireEditorialUser();
  return withEditorialTransaction(user, async (client) => {
    const result = await client.query(
      `select e.*, c.name as category_name, c.section
       from knowledge_entries e
       left join categories c on c.id=e.category_id
       where e.id=$1
       limit 1`,
      [id]
    );
    return (result.rows[0] as EditorialEntry | undefined) ?? null;
  });
}

export async function getEditorialCategories() {
  const user = await requireEditorialUser();
  return withEditorialTransaction(user, async (client) => {
    const result = await client.query(
      "select id,name,slug,section from categories order by section,name"
    );
    return result.rows;
  });
}

export async function getEditorialSources() {
  const user = await requireEditorialUser();
  return withEditorialTransaction(user, async (client) => {
    const result = await client.query(
      "select id,title,source_type,author,publisher,publication_year,citation from sources order by title"
    );
    return result.rows as EditorialSource[];
  });
}

export async function getEntrySourceIds(entryId: string) {
  const user = await requireEditorialUser();
  return withEditorialTransaction(user, async (client) => {
    const result = await client.query(
      "select source_id from entry_sources where entry_id=$1",
      [entryId]
    );
    return result.rows.map((row) => String(row.source_id));
  });
}

export async function getReviewHistory(entryId: string) {
  const user = await requireEditorialUser();
  return withEditorialTransaction(user, async (client) => {
    const result = await client.query(
      `select rr.id,rr.previous_status,rr.new_status,rr.notes,rr.created_at,
              u.display_name,u.email
       from review_records rr
       left join users u on u.id=rr.reviewer_id
       where rr.entry_id=$1
       order by rr.created_at desc`,
      [entryId]
    );
    return result.rows;
  });
}
