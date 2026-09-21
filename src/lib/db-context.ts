import { Client, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import type { EditorialRole } from "./editorial-auth";

neonConfig.webSocketConstructor = ws;

export type EditorialDbUser = {
  id: string;
  external_auth_id: string | null;
  display_name: string | null;
  email: string | null;
  role: EditorialRole;
};

function connectionString() {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("Database is not configured.");
  return value;
}

export async function withEditorialTransaction<T>(
  user: EditorialDbUser,
  work: (client: Client) => Promise<T>
): Promise<T> {
  const client = new Client(connectionString());
  await client.connect();

  try {
    await client.query("BEGIN");
    await client.query("select set_config($1, $2, true)", [
      "app.external_auth_id",
      user.external_auth_id ?? ""
    ]);
    await client.query("select set_config($1, $2, true)", [
      "app.role",
      user.role
    ]);

    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Preserve the original database/application error.
    }
    throw error;
  } finally {
    await client.end();
  }
}
