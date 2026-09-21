import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { sql } from "./db";

export type EditorialRole = "contributor" | "reviewer" | "editor" | "administrator";

const editorialRoles: EditorialRole[] = ["contributor", "reviewer", "editor", "administrator"];

export async function syncAuthenticatedUser() {
  if (!sql) return null;

  const identity = await getAuthenticatedIdentity();
  if (!identity) return null;

  const rows = await sql`
    insert into users (external_auth_id, display_name, email, role)
    values (
      ${identity.externalAuthId},
      ${identity.displayName},
      ${identity.email},
      'reader'
    )
    on conflict (external_auth_id) do update
      set display_name = excluded.display_name,
          email = excluded.email
    returning id, external_auth_id, display_name, email, role
  `;

  return rows[0] as {
    id: string;
    external_auth_id: string | null;
    display_name: string | null;
    email: string | null;
    role: string;
  } | undefined;
}

export async function getCurrentEditorialUser() {
  if (!sql) return null;

  const { userId } = await auth();
  if (!userId) return null;

  const rows = await sql`
    select id, external_auth_id, display_name, email, role
    from users
    where external_auth_id = ${userId}
    limit 1
  `;

  const user = rows[0] as {
    id: string;
    external_auth_id: string | null;
    display_name: string | null;
    email: string | null;
    role: string;
  } | undefined;

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
