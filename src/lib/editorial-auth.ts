import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { sql } from "./db";

export type EditorialRole = "contributor" | "reviewer" | "editor" | "administrator";

const editorialRoles: EditorialRole[] = ["contributor", "reviewer", "editor", "administrator"];

type DbUser = {
  id: string;
  external_auth_id: string | null;
  display_name: string | null;
  email: string | null;
  role: string;
};

function requireDatabase() {
  if (!sql) throw new Error("Database is not configured.");
  return sql;
}

export async function syncAuthenticatedUser() {
  const db = requireDatabase();
  const identity = await getAuthenticatedIdentity();
  if (!identity) return null;

  const [, rows] = await db.transaction((txn) => [
    txn`select set_config('app.external_auth_id', ${identity.externalAuthId}, true)`,
    txn`insert into users (external_auth_id, display_name, email, role)
      values (${identity.externalAuthId}, ${identity.displayName}, ${identity.email}, 'reader')
      on conflict (external_auth_id) do update
        set display_name = excluded.display_name,
            email = excluded.email
      returning id, external_auth_id, display_name, email, role`
  ]);

  return rows[0] as DbUser | undefined;
}

export async function getCurrentEditorialUser() {
  const db = requireDatabase();
  const { userId } = await auth();
  if (!userId) return null;

  const [, rows] = await db.transaction((txn) => [
    txn`select set_config('app.external_auth_id', ${userId}, true)`,
    txn`select id, external_auth_id, display_name, email, role
      from users
      where external_auth_id = ${userId}
      limit 1`
  ]);

  const user = rows[0] as DbUser | undefined;
  if (!user || !editorialRoles.includes(user.role as EditorialRole)) return null;

  return { ...user, role: user.role as EditorialRole };
}

export async function requireEditorialUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await syncAuthenticatedUser();

  const user = await getCurrentEditorialUser();
  if (!user) notFound();
  return user;
}

export async function requireEditorialAccess() {
  return (await requireEditorialUser()).role;
}

export async function getAuthenticatedIdentity() {
  const user = await currentUser();
  if (!user) return null;

  return {
    externalAuthId: user.id,
    displayName: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || null,
    email: user.emailAddresses[0]?.emailAddress ?? null
  };
}
